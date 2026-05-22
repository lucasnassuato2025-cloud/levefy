import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const CONFIRMATION_TEXT = "EXCLUIR";
const SERVICE_ROLE_KEY_ENV_NAMES = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
  "SUPABASE_SERVICE_ROLE",
  "SUPABASE_SERVICE_ROLE_SECRET",
];

function getSupabaseServiceRoleKey() {
  for (const envName of SERVICE_ROLE_KEY_ENV_NAMES) {
    const value = process.env[envName]?.trim();
    if (value) return value;
  }

  return null;
}

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) {
    return {
      client: null,
      error:
        "Configuracao do Supabase incompleta: adicione SUPABASE_SERVICE_ROLE_KEY no Vercel com a chave service_role do Supabase antes de excluir contas.",
    };
  }

  return {
    client: createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }),
    error: null,
  };
}

function missingSupabaseAdminResponse(message: string) {
  return NextResponse.json(
    {
      error: message,
      reason: "missing_supabase_service_role",
      expectedEnv: "SUPABASE_SERVICE_ROLE_KEY",
      acceptedEnvNames: SERVICE_ROLE_KEY_ENV_NAMES,
    },
    { status: 500 }
  );
}

async function cancelCustomerSubscriptions(stripeCustomerId?: string | null) {
  if (!stripeCustomerId) return { canceled: 0 };

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 100,
  });

  const activeSubscriptions = subscriptions.data.filter((subscription) =>
    ["active", "trialing", "past_due", "unpaid"].includes(subscription.status)
  );

  for (const subscription of activeSubscriptions) {
    await stripe.subscriptions.cancel(subscription.id);
  }

  return { canceled: activeSubscriptions.length };
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body?.confirmation !== CONFIRMATION_TEXT) {
      return NextResponse.json(
        { error: `Digite ${CONFIRMATION_TEXT} para confirmar a exclusão da conta.` },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !supabaseUser) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { client: supabaseAdmin, error: adminConfigError } = getSupabaseAdminClient();

    if (adminConfigError || !supabaseAdmin) {
      return missingSupabaseAdminResponse(adminConfigError ?? "Supabase admin nao configurado.");
    }

    const { error: adminLookupError } = await supabaseAdmin.auth.admin.getUserById(supabaseUser.id);

    if (adminLookupError) {
      return NextResponse.json(
        {
          error:
            "Nao foi possivel validar a chave admin do Supabase. Nenhum dado foi removido. Verifique a SUPABASE_SERVICE_ROLE_KEY.",
          details: adminLookupError.message,
        },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: {
        id: true,
        email: true,
        stripeId: true,
        plan: true,
      },
    });

    if (user?.stripeId) {
      await cancelCustomerSubscriptions(user.stripeId);
    }

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);

    if (deleteAuthError) {
      return NextResponse.json(
        {
          error:
            "Nao foi possivel excluir o login do Supabase. Nenhum dado do app foi removido. Verifique a SUPABASE_SERVICE_ROLE_KEY.",
          details: deleteAuthError.message,
        },
        { status: 500 }
      );
    }

    // Remove todos os dados relacionais pelo onDelete: Cascade definido no Prisma.
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }

    return NextResponse.json({
      success: true,
      message: "Conta excluída e assinatura cancelada com sucesso.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Erro ao excluir conta." },
      { status: 500 }
    );
  }
}
