# 🚀 Levefy — Instruções de Deploy

## Stack
- Next.js 15 App Router · TypeScript · Tailwind CSS
- Prisma ORM · Neon PostgreSQL
- Supabase Auth · Stripe Pagamentos
- Render (deploy) · Zero custo operacional

---

## 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Preencha todos os valores no .env
```

### Variáveis necessárias:
- **SUPABASE**: URL e anon key do seu projeto
- **DATABASE_URL / DIRECT_URL**: String de conexão Neon
- **STRIPE_SECRET_KEY**: Chave secreta Stripe
- **STRIPE_PRICE_START**: Price ID do produto START (R$27, pagamento único)
- **STRIPE_PRICE_PREMIUM**: Price ID do produto PREMIUM (R$19/mês, recorrente)
- **STRIPE_WEBHOOK_SECRET**: Secret do webhook Stripe
- **ADMIN_EMAIL**: Email do administrador

---

## 2. Instalar dependências

```bash
npm install
```

---

## 3. Configurar banco de dados

```bash
# Gerar client Prisma
npx prisma generate

# Criar tabelas no Neon
npx prisma db push

# Popular com dados iniciais (receitas + templates)
npm run db:seed
```

---

## 4. Configurar Stripe

1. Crie conta em stripe.com
2. Crie dois produtos:
   - **START**: R$27,00 · pagamento único → copie o Price ID
   - **PREMIUM**: R$19,00/mês · assinatura recorrente → copie o Price ID
3. Configure webhook: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.deleted`
4. Copie o Webhook Secret para `STRIPE_WEBHOOK_SECRET`
5. Para PIX, ative nos métodos de pagamento do Stripe (conta BR necessária)

---

## 5. Deploy no Render

```bash
# O render.yaml já está configurado
# No Render dashboard: New → Web Service → connect Git
# Build command: npm install && npx prisma generate && next build
# Start command: node .next/standalone/server.js
```

No Render, adicione as variáveis de ambiente da mesma forma que no `.env`.

---

## 6. Rodar localmente

```bash
npm run dev
# Acesse: http://localhost:3000
```

---

## 7. Tracking (opcional)

Para Meta Ads / Google Ads:
- `NEXT_PUBLIC_META_PIXEL_ID` → ID do seu Meta Pixel
- `NEXT_PUBLIC_GA4_ID` → ID do Google Analytics 4 (ex: G-XXXXXXXXXX)

---

## Arquitetura do Meal AI

O Meal AI **não usa LLM externo**. Funciona 100% localmente:

1. `lib/meal-engine.ts` → Motor de macros (TMB/TDEE/Harris-Benedict)
2. Banco de refeições em memória com 80+ opções
3. Randomização com seed temporal (plano diferente toda vez)
4. Score nutricional calculado localmente
5. Lista de compras gerada automaticamente
6. Custo: **R$ 0 por usuário**

---

## Estrutura de pastas

```
app/
  page.tsx          → Landing page
  dashboard/        → Dashboard com gráficos
  meal-ai/          → Meal AI (motor local)
  recipes/          → Receitas
  challenge/        → Desafio 21 dias
  profile/          → Perfil + conquistas
  membership/       → Planos e checkout
  admin/            → Analytics admin
  api/
    ai/generate-meal/ → Engine fake AI
    stripe/checkout/  → Checkout Stripe
    stripe/webhook/   → Webhook Stripe
    admin/stats/      → Stats admin
lib/
  meal-engine.ts    → Motor principal do Meal AI
  stripe.ts         → Config Stripe
  gamification.ts   → XP, níveis, medalhas
prisma/
  schema.prisma     → Schema completo (13 tabelas)
  seed.ts           → Dados iniciais
```
