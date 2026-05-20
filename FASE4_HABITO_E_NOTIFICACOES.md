# Levefy — Fase 4 Hábito / Retenção

Implementado no código:

- Central de check-in diário no dashboard.
- XP por ações pequenas: água, alimentação, movimento e humor.
- Streak com risco de perda quando o usuário ainda não fez check-in no dia.
- FOMO inteligente: mensagem para proteger a sequência.
- Lembrete por Notification API do navegador.
- Service Worker preparado para push notification futura.
- Upsell Free → Premium conectado ao hábito: Free cria rotina, Premium usa check-ins para ajustar plano.

Observação importante:

Notificações realmente em segundo plano exigem Web Push com VAPID keys e endpoint salvo por usuário. Esta fase deixa a UX e o service worker preparados, mas sem criar nova tabela no banco para evitar migração arriscada agora.
