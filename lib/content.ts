export const QUIZ_OPTIONS = {
  focus: [
    { value: 'blocage', label: 'Je me sens bloqué(e), comme si je tournais en rond' },
    { value: 'transition', label: 'Je traverse une période de changement ou de doute' },
    { value: 'profondeur', label: 'Je veux mieux me comprendre, en profondeur' },
    { value: 'relations', label: 'Mes relations m’épuisent ou me questionnent' },
    { value: 'curiosite', label: 'Simple curiosité, je veux voir ce que ça donne' },
  ],
  energy: [
    { value: 'epuise', label: 'Épuisé(e), même le repos ne suffit plus' },
    { value: 'instable', label: 'Des hauts et des bas, je ne sais jamais comment je vais me réveiller' },
    { value: 'tension', label: 'Sous tension, je tiens, mais je sens que ça tire' },
    { value: 'plat', label: 'Plat, pas de fatigue extrême, mais pas d’élan non plus' },
    { value: 'presque', label: 'Plutôt bien, mais quelque chose manque quand même' },
  ],
  stress: [
    { value: 'retrait', label: 'Je me replie et je disparais un peu' },
    { value: 'suranalyse', label: 'Je suranalyse tout' },
    { value: 'suradaptation', label: 'Je m’occupe des autres pour éviter de me regarder' },
    { value: 'irritabilite', label: 'Je deviens irritable ou sec' },
    { value: 'masque', label: 'Je fais comme si tout allait bien' },
  ],
} as const;

export const BRAND = {
  name: 'CODE VIVANT',
  signature: 'par Philippe Malbrunot',
  heroLabel: 'DIAGNOSTIC INTÉRIEUR',
  headline: 'Votre portrait intérieur : ce qui vous protège et vous bloque',
  subheadline:
    'Mettez en lumière le mécanisme intérieur qui vous protège encore… mais vous retient de vivre plus pleinement.',
  description:
    'Répondez à quelques questions et recevez un premier décryptage de votre mode de protection, de votre blocage central et de ce qui cherche à bouger en vous.',
  method:
    'Votre portrait s’appuie sur la numérologie, une lecture psychospirituelle et une approche systémique de vos schémas profonds.',
  badges: ['diagnostic express', 'aperçu gratuit', 'lecture immédiate'],
  cta: 'Voir mon portrait',
} as const;

export const STATIC_COPY = {
  freeHeroTitle: 'Ce que votre portrait révèle',
  lockedLabel: 'CE QUE VOUS N’AVEZ PAS ENCORE VU',
  lockedTitle: 'Le vrai nœud n’est pas encore révélé',
  lockedBody1:
    'Le verrou principal n’est pas celui que vous montrez. Il est plus discret et plus ancien. Il touche à votre droit d’exister sans surcontrôle, sans compensation, sans devoir mériter votre place en vous retenant.',
  lockedBody2:
    'Tant que ce point reste invisible, vous avancerez par correction plus que par élan. La suite va là où votre tension prend sa source… et là où elle peut enfin commencer à céder.',
  lockedLine:
    'La lecture complète révèle le verrou principal, la peur racine, le rapport à la légitimité, l’élan retenu et la direction de bascule la plus juste.',
  freeOfferTitle: 'Profil complet',
  freeOfferPrice: '7 €',
  freeOfferBody:
    'Déverrouillez la lecture complète : le verrou principal, l’héritage invisible, le rapport à la légitimité, l’élan retenu et la direction de bascule la plus juste.',
  freeOfferCta: 'Déverrouiller mon portrait complet',
  sessionLabel: 'ACCOMPAGNEMENT PRIVÉ',
  sessionTitle: 'Séance avec Philippe',
  sessionPrice: '97 €',
  sessionShort:
    '1 h en visio pour travailler l’endroit exact où votre verrou se rejoue aujourd’hui.',
  sessionBody:
    'Nous partons de votre lecture complète pour voir clair dans ce qui vous retient encore, remettre en mouvement ce qui s’est figé, et clarifier un prochain cap plus juste, plus vivant, plus incarné.',
  sessionBody2: 'Ce n’est pas seulement un décryptage. C’est une première traversée accompagnée.',
  sessionCta: 'Réserver ma séance',
  sessionMicro: 'La lecture complète est incluse.',
  waitingTitle: 'Votre lecture complète se prépare',
  waitingBody:
    'Nous relions maintenant votre mode de protection, le verrou principal, votre rapport à la légitimité, l’élan retenu et la direction de bascule la plus juste.',
  waitingMicro: 'Cela peut prendre quelques instants.',
  waitingFooter: 'Vous avez franchi un premier seuil. La suite entre au cœur du nœud.',
  waitingSteps: [
    'Lecture du schéma principal',
    'Mise en relation des tensions profondes',
    'Clarification du rapport à la légitimité',
    'Détection de l’élan retenu',
    'Finalisation de votre lecture complète',
  ],
  premiumHeroLabel: 'LECTURE COMPLÈTE',
  premiumHeroTitle: 'Vous êtes allé au-delà du premier seuil',
  premiumHeroBody:
    'Ce qui suit ne tourne plus autour du mécanisme visible. Cette lecture relie le verrou central, l’héritage invisible, le rapport à la valeur, l’élan retenu et le point de bascule le plus juste.',
  premiumHeroBridge: 'Ici, on ne reste plus à la surface. On entre dans la structure.',
  premiumStepTitles: [
    'Le verrou principal',
    'L’héritage invisible',
    'Valeur, légitimité, argent',
    'Ce qui cherche à vivre davantage',
    'Traversée concrète',
    'Questions de confrontation',
  ],
  bridgeLabel: 'ET MAINTENANT',
  bridgeTitle: 'Voir plus clair ne suffit pas toujours à traverser',
  bridgeBody:
    'Ce que vous venez de lire met une structure en lumière. Mais certaines retenues ne cèdent pas simplement parce qu’on les comprend. Elles se rejouent dans vos choix, votre parole, votre rapport à la valeur, votre manière de prendre place, de décider, d’aimer ou de vous exposer.',
  bridgeBody2:
    'La séance privée permet de travailler l’endroit exact où cela reste vivant aujourd’hui. Pas pour ajouter une couche d’analyse. Pour commencer à remettre du mouvement là où quelque chose en vous se retient encore.',
  bridgeLine:
    'Passer de la lucidité au mouvement demande parfois un espace tenu, précis, incarné.',
  shareTitle: 'Vous avez pensé à quelqu’un en lisant ceci ?',
  shareBody: 'Partagez-lui cette expérience.',
  shareCopy: 'Copier le lien',
  shareSend: 'Envoyer le lien',
};
