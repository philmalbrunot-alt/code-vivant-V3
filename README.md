# CODE VIVANT V3

## Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Stripe Checkout
- OpenAI Responses API
- Brevo (conservé, non rebranché dans le flow V3 par défaut)

## Nouveau flow
1. Landing + questionnaire sur `/`
2. Résultat gratuit sur `/resultat`
3. Paiement Stripe pour l’offre 7 €
4. Retour sur `/checkout/success`
5. Page d’attente sur `/lecture/prepare`
6. Lecture complète sur `/lecture/[token]`

## Variables d’environnement
Copier `.env.example` vers `.env.local` puis renseigner :
- OPENAI_API_KEY
- OPENAI_FREE_MODEL
- OPENAI_PREMIUM_MODEL
- APP_BASE_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_ID_PROFILE
- BREVO_API_KEY
- BREVO_FROM_EMAIL

## Déploiement Vercel
Le projet fonctionne avec les mêmes variables qu’avant.
Après ajout ou modification d’une variable, faire un redeploy.

## Stripe
- `STRIPE_SECRET_KEY` doit être une clé secrète (`sk_test_...` ou `sk_live_...`)
- `STRIPE_PRICE_ID_PROFILE` doit être un identifiant de prix (`price_...`), pas un produit (`prod_...`)
- Le webhook doit pointer vers `/api/stripe/webhook`

## Note UX
Le webhook Stripe ne génère plus le premium. Il valide seulement l’événement.
La génération premium se fait sur la page d’attente `/lecture/prepare` afin d’éviter un retour lent ou opaque après paiement.
