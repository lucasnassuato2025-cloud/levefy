import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const CONFIRMATION_TEXT = "EXCLUIR";

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione essa variável no Vercel para permitir excluir contas."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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

    // Remove todos os dados relacionais pelo onDelete: Cascade definido no Prisma.
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);

    if (deleteAuthError) {
      return NextResponse.json(
        {
          error:
            "Dados do app removidos, mas não foi possível excluir o login do Supabase. Verifique a SUPABASE_SERVICE_ROLE_KEY.",
          details: deleteAuthError.message,
        },
        { status: 500 }
      );
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
