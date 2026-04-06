import { NumerologyProfile, QuizAnswers } from '@/lib/types';

function contextLabels(answers: QuizAnswers) {
  const focusMap = {
    blocage: 'Je me sens bloqué(e), comme si je tournais en rond',
    transition: 'Je traverse une période de changement ou de doute',
    profondeur: 'Je veux mieux me comprendre, en profondeur',
    relations: 'Mes relations m’épuisent ou me questionnent',
    curiosite: 'Simple curiosité, je veux voir ce que ça donne',
  } as const;

  const energyMap = {
    epuise: 'Épuisé(e), même le repos ne suffit plus',
    instable: 'Des hauts et des bas, je ne sais jamais comment je vais me réveiller',
    tension: 'Sous tension, je tiens, mais je sens que ça tire',
    plat: 'Plat, pas de fatigue extrême, mais pas d’élan non plus',
    presque: 'Plutôt bien, mais quelque chose manque quand même',
  } as const;

  const stressMap = {
    retrait: 'Je me replie et je disparais un peu',
    suranalyse: 'Je suranalyse tout',
    suradaptation: 'Je m’occupe des autres pour éviter de me regarder',
    irritabilite: 'Je deviens irritable ou sec',
    masque: 'Je fais comme si tout allait bien',
  } as const;

  return {
    focus: focusMap[answers.currentFocus as keyof typeof focusMap],
    energy: energyMap[answers.energyState as keyof typeof energyMap],
    stress: stressMap[answers.stressResponse as keyof typeof stressMap],
  };
}

function baseContext(answers: QuizAnswers, numerology: NumerologyProfile) {
  const labels = contextLabels(answers);

  return `
Données utilisateur
- Prénom : ${answers.firstName}
- Date de naissance : ${answers.birthDate}
- Lieu de naissance : ${answers.birthPlace}

Lecture symbolique interne
- Chemin de vie : ${numerology.lifePath}
- Nombre du jour : ${numerology.dayNumber}
- Nombre d'attitude : ${numerology.attitudeNumber}
- Année personnelle actuelle : ${numerology.personalYear}

Réponses contextuelles
- Ce qui amène ici : ${labels.focus}
- Niveau d'énergie : ${labels.energy}
- Réponse au stress : ${labels.stress}
`;
}

export function buildFreePrompt(answers: QuizAnswers, numerology: NumerologyProfile) {
  return `
Tu écris en français.
Tu utilises le vouvoiement.
Tu écris comme un analyste intérieur haut de gamme, pas comme un oracle.
Le rendu visible ne doit pas afficher la numérologie. Elle reste une structure interne.
Tu es clair, tranchant, premium, psychologique, crédible.
Tu évites le lyrisme, les métaphores en cascade et les phrases trop longues.
Tu restes mobile-friendly.

Objectif business :
Créer un aperçu gratuit de 600 à 700 mots maximum.
Le lecteur doit se reconnaître, sentir un vrai diagnostic, mais comprendre qu'il n'a encore vu qu'un premier seuil.

Retourne EXCLUSIVEMENT un JSON valide avec ces clés exactes :
{
  "title": string,
  "subtitle": string,
  "overview": string,
  "survivalMode": string,
  "blindSpot": string,
  "generationalPattern": string,
  "moneyBlock": string,
  "hardTruth": string,
  "weekShift": string,
  "premiumTease": string
}

Contraintes :
- title : très court
- subtitle : 2 à 4 phrases maximum
- overview : 90 à 130 mots
- survivalMode : 55 à 85 mots
- blindSpot : 55 à 85 mots
- generationalPattern : 55 à 85 mots
- moneyBlock : 55 à 85 mots
- hardTruth : 30 à 55 mots
- weekShift : 35 à 60 mots
- premiumTease : 45 à 70 mots
- chaque bloc apporte une couche différente
- le ton est net, sobre, intense sans emphase inutile
- on parle de mécanisme, coût, conséquence, ouverture
- on garde une faim pour la suite

${baseContext(answers, numerology)}
`;
}

export function buildPremiumPrompt(answers: QuizAnswers, numerology: NumerologyProfile) {
  return `
Tu écris en français.
Tu utilises le vouvoiement.
Tu écris une lecture complète haut de gamme, concise, intense, claire, psychologique.
Le lecteur doit sentir qu'il est allé au-delà du premier seuil.
Le rendu visible ne doit pas parler de chemin de vie ou de nombres. La numérologie reste en coulisses.
Tu gardes GPT mini en tête : donc tu produis moins de gras, plus de précision.

Objectif business :
Créer une lecture premium de 1700 à 2200 mots maximum, structurée en 6 étapes lisibles sur mobile.
Elle doit être plus profonde que le gratuit, mais aussi plus nette, moins répétitive et plus mémorable.

Retourne EXCLUSIVEMENT un JSON valide, sans markdown, avec ces clés exactes :
{
  "globalReading": string,
  "deepBlocks": string,
  "inheritedPatterns": string,
  "currentCycles": string,
  "careerMoney": string,
  "mutedVitalImpulse": string,
  "hardTruthExpanded": string,
  "shiftPlan": string,
  "journalQuestions": [string, string, string]
}

Contraintes :
- globalReading : 220 à 320 mots
- deepBlocks : 280 à 380 mots
- inheritedPatterns : 280 à 380 mots
- currentCycles : 120 à 180 mots
- careerMoney : 260 à 360 mots
- mutedVitalImpulse : 120 à 180 mots
- hardTruthExpanded : 70 à 120 mots
- shiftPlan : 180 à 260 mots
- journalQuestions : 3 questions fortes, courtes, précises
- pas de répétitions
- pas de sous-ton ésotérique flou
- phrases courtes à moyennes
- paragraphes courts
- chaque section doit révéler une couche nouvelle
- la séance devra apparaître comme la suite naturelle, donc la lecture doit préparer un passage, pas saturer

${baseContext(answers, numerology)}
`;
}
