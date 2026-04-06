# CODE VIVANT V3

## Routes
- `/` : landing + questionnaire
- `/resultat` : aperçu gratuit
- `/checkout/success` : retour Stripe puis redirection immédiate
- `/lecture/prepare` : page d’attente premium
- `/lecture/[token]` : lecture complète

## Logique
1. Le gratuit est généré puis stocké en localStorage (`code-vivant:v3-free`)
2. Le 7 € ouvre Stripe Checkout
3. Stripe revient sur `/checkout/success?session_id=...`
4. La page `/lecture/prepare` appelle `/api/checkout/unlock`
5. Le premium est stocké en localStorage sous `code-vivant:v3-premium:<session_id>`
6. Redirection vers `/lecture/[token]`

## Intégrations conservées
- OpenAI
- Stripe Checkout
- Webhook Stripe
- Brevo conservé dans `lib/` pour rebranchement ultérieur

## Fichiers principaux
- `app/components/v3/question-flow.tsx`
- `app/components/v3/free-result.tsx`
- `app/components/v3/payment-transition.tsx`
- `app/components/v3/premium-reading.tsx`
- `app/components/v3/ui.tsx`
