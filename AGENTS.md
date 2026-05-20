# Levefy — Instruções para Codex

## Produto
Levefy é um SaaS fitness com IA focado em emagrecimento, hábitos diários, gamificação, retenção e conversão Free → Starter/Premium.

## Stack
- Next.js App Router
- TypeScript
- Tailwind
- Supabase Auth
- Supabase Storage
- Prisma
- Stripe
- Vercel

## Regras críticas
- Nunca commitar `.env`, `.env.local`, `.next`, `node_modules` ou `.git`.
- Não alterar Stripe sem necessidade.
- Em `lib/stripe.ts`, manter:
  `apiVersion: "2025-02-24.acacia"`
- Não quebrar login Google nem login manual.
- Manter mobile-first.
- Antes de concluir, rodar:
  `npx tsc --noEmit`
- Se mexer em build, testar:
  `npm run build`

## Problemas atuais
- Login manual funciona, mas ao clicar em “Painel Dashboard” no menu ele volta para login.
- Google/Gmail funciona corretamente.
- Suspeita: usuário manual não está sincronizando corretamente com tabela Prisma User ou dashboard está validando Prisma User em vez da sessão Supabase.

## O que precisa corrigir agora
- Garantir que login manual crie/sincronize usuário no banco.
- Garantir que menu Dashboard aponte para `/dashboard`.
- Garantir que `/dashboard` não redirecione para `/login` se existe sessão Supabase válida.
- Criar/upsert seguro por email.
- Evitar erro Unique constraint failed on email.

## Funcionalidades recentes
- Check-in diário
- XP
- Streak
- Conquistas
- Onboarding IA
- Projeção Premium 30/90 dias
- PWA modal
- Avatar Google/manual
- Excluir conta + cancelar assinatura