import OpenAI from "openai";
import { computeNumerology } from "@/lib/numerology";
import { buildFreePrompt, buildPremiumPrompt } from "@/lib/prompts";
import { freeAnalysisSchema, premiumAnalysisSchema } from "@/lib/schemas";
import { FreeAnalysis, PremiumAnalysis, QuizAnswers } from "@/lib/types";

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Réponse IA non exploitable");
  }
  return text.slice(start, end + 1);
}

function mockFree(answers: QuizAnswers): FreeAnalysis {
  const numerology = computeNumerology(answers.birthDate);
  const firstName = answers.firstName;

  return {
    title: "Ce que votre portrait révèle",
    subtitle:
      `${firstName} montre probablement quelqu’un de plus maîtrisé, plus lisible et plus solide que ce qui se joue réellement à l’intérieur. Vous retenez davantage que vous ne le pensez. Cela vous protège encore, mais cela vous coûte déjà en clarté, en élan et en vérité simple. Ce qui cherche à bouger maintenant n’est pas une nouvelle idée de vous-même. C’est une manière plus franche d’exister.`,
    overview:
      `Votre profil ne parle pas d’un manque de profondeur. Il parle plutôt d’une profondeur qui s’est organisée pour tenir. La logique symbolique derrière votre date suggère une personne qui capte vite, comprend beaucoup, et transforme souvent cette perception en retenue, en contrôle fin ou en adaptation. Cela donne une image de stabilité. En réalité, ce fonctionnement peut produire un décalage discret mais coûteux. Vous sentez parfois très tôt quand quelque chose ne vous convient plus, mais vous mettez plus de temps à le rendre visible. Vous l’expliquez, vous le nuancez, vous le temporisez. Le problème n’est donc pas que vous ne voyez pas. C’est que vous différez encore l’endroit où cette lucidité devrait devenir un acte.`,
    survivalMode:
      `Votre mode de protection principal ressemble à une forme de maîtrise intérieure. Vous gardez la main sur ce que vous montrez. Vous tenez. Vous filtrez. Vous attendez parfois le bon moment, le bon ton, la bonne formulation. Cette stratégie vous a probablement évité de trop vous exposer. Aujourd’hui, elle produit un effet plus pervers. Elle vous protège encore d’un inconfort immédiat, mais elle vous maintient aussi dans des situations, des liens ou des choix qui durent au-delà du juste.`,
    blindSpot:
      `Votre angle mort émotionnel n’est pas la sensibilité. C’est le fait d’avoir transformé la retenue en identité. Vous pouvez croire que vous prenez du recul, que vous faites preuve de maturité ou que vous attendez simplement d’y voir clair. Une partie de cela est vraie. Une autre partie sert à ne pas nommer assez tôt ce qui vous dérange, ce qui vous blesse, ou ce que vous ne voulez plus porter.`,
    generationalPattern:
      `L’héritage qui apparaît ici évoque un climat où il a pu être plus sûr de contenir que d’exprimer. Ne pas déranger. Rester correct. Tenir sans trop demander. Quand ce type de règle traverse une famille, elle produit souvent des personnes fines, adaptables, profondes, mais peu habituées à exister franchement. Vous ne portez pas seulement un tempérament. Vous portez peut-être aussi une vieille manière de rester acceptable.`,
    moneyBlock:
      `Sur la valeur et la légitimité, le nœud semble moins économique que psychique. Vous pouvez sous-estimer ce que vous apportez non parce que vous doutez de vos capacités, mais parce que demander plus, montrer plus, ou prendre plus de place active un coût intérieur. L’argent vient alors révéler autre chose. Votre droit à vous affirmer sans trop justifier votre présence.`,
    hardTruth:
      `Vous n’avez probablement pas besoin de vous comprendre davantage. Vous avez surtout besoin de devenir plus lisible là où vous restez encore protégé par la retenue, le délai ou la nuance.`,
    weekShift:
      `Cette semaine, choisissez un seul endroit où vous entretenez encore du flou. Une relation, une demande, une limite, une décision. Puis formulez une phrase simple. Pas parfaite. Pas brillante. Juste nette. Le mouvement ne viendra pas d’une meilleure analyse. Il viendra d’une parole plus claire.`,
    premiumTease:
      `La lecture complète révèle le verrou principal que vous n’avez pas encore vu entièrement. Elle montre la peur racine, le schéma de protection plus profond, votre rapport caché à la légitimité, et le point exact où votre vie vous demande de sortir du mode survie.`,
  };
}

function mockPremium(answers: QuizAnswers): PremiumAnalysis {
  const numerology = computeNumerology(answers.birthDate);
  const firstName = answers.firstName;

  return {
    globalReading:
      `${firstName} n’a pas un problème de manque. Le problème semble plutôt être un excès de protection bien organisé. La structure symbolique issue de votre date parle d’une personne qui ressent, comprend et anticipe beaucoup. C’est une force. Mais cette force peut devenir un piège quand elle sert davantage à contrôler l’exposition qu’à soutenir l’incarnation. Vous pouvez apparaître posé, profond, cohérent, parfois même très clair. Pourtant, à l’intérieur, une partie de vous reste encore engagée dans une tâche moins noble qu’elle n’en a l’air. Éviter le coût émotionnel d’une vérité plus simple. Ce coût peut être de déplaire, de demander, de renoncer, de prendre votre place, ou de ne plus pouvoir vous cacher derrière la complexité.

Le point important, c’est que votre blocage n’est pas un défaut isolé. Il ressemble à un système. Un système de protection qui a appris à préserver le lien, à préserver l’image, à préserver une forme de maîtrise. Ce système a souvent un air respectable. Il peut prendre la forme de la patience, du recul, de la hauteur de vue, de la prudence, de la finesse. Mais quand on regarde de près, on voit autre chose. Une difficulté à rendre visible ce que vous savez déjà. Vous comprenez souvent avant d’agir. Vous sentez avant de nommer. Vous anticipez avant de demander. Le problème n’est pas l’absence de lucidité. Le problème est que la lucidité ne débouche pas toujours assez vite sur une position.

C’est là que la lecture devient utile. Elle ne cherche pas à vous flatter. Elle cherche à montrer où se situe le mécanisme qui vous protège encore, mais vous retient aussi. Ce mécanisme vous a peut-être aidé à rester digne, acceptable, solide, ou aimable. Aujourd’hui, il vous demande un prix trop élevé. Il vous coûte en lisibilité, en énergie, en puissance d’action, en rapport à la valeur et en capacité à choisir sans vous trahir.`,
    deepBlocks:
      `Votre mécanisme de protection principal ressemble à une maîtrise intérieure devenue réflexe. Vous gardez une partie de vous sous contrôle. Vous ajustez. Vous filtrez. Vous contenez. Vous pouvez attendre une meilleure compréhension, de meilleures conditions, un meilleur moment, alors que le vrai sujet est souvent ailleurs. Une part de vous sait déjà. Elle sait qu’un lien est trop pauvre, qu’un projet est trop flou, qu’une situation n’est plus juste, qu’une demande doit être formulée, qu’une limite devrait être posée. Mais une autre part refuse le coût que cette netteté provoquerait.

C’est ce refus qui fabrique le blocage. Pas l’ignorance. Pas le manque d’intelligence. Pas l’absence de profondeur. Le coût peut être très simple. Déplaire. Sortir d’un rôle. Cesser d’être celui ou celle qui comprend tout. Montrer un besoin. Assumer un désir. Être plus visible. Être plus clair. Ce sont souvent des coûts relationnels ou identitaires, bien plus que des obstacles matériels.

Votre angle mort majeur semble être celui-ci. Vous pouvez prendre pour de la maturité une forme de retenue qui vous coupe de votre vérité simple. Vous pouvez prendre pour du discernement une manière d’éviter la confrontation avec le réel. Vous pouvez prendre pour de la finesse ce qui est aussi, parfois, une peur d’être trop net. C’est dur à entendre, parce que cette protection a souvent été valorisée. Elle vous a peut-être rendu crédible, intelligent, fiable, mesuré. Mais elle vous a aussi appris à tourner autour de certains nœuds au lieu de les traverser.

La peur racine qui apparaît derrière ce type de profil est généralement une peur du coût de l’exposition. Pour certains, c’est la peur de perdre le lien. Pour d’autres, c’est la peur d’être mal lu, envahi, ou décevant. Pour d’autres encore, c’est la peur de ne plus pouvoir tenir une image de solidité, de profondeur ou de maîtrise. Dans tous les cas, la conséquence se ressemble. Vous repoussez l’endroit où il faudrait devenir plus simple.

C’est pour cela que vous pouvez parfois vivre des séquences en dents de scie. Beaucoup de lucidité, puis du délai. Beaucoup d’élan, puis du frein. Beaucoup de conscience, puis un retour à l’entre-deux. Tant que votre système continue à considérer la protection comme une autorité morale, il gardera la main. Le vrai travail commence quand vous arrêtez de le respecter comme s’il avait toujours raison.`,
    inheritedPatterns:
      `L’héritage invisible qui se dessine ici ne doit pas être lu comme un verdict sur votre famille. Il s’agit d’une lecture plausible. Un climat transmis. Une règle silencieuse. Une manière d’exister qui a pu être récompensée ou rendue nécessaire. Ce type de schéma ressemble souvent à ceci. Ne pas trop déranger. Supporter sans trop se plaindre. Préserver l’équilibre. Rester correct. Se débrouiller avec ce qui manque. Comprendre avant de réclamer.

Quand une telle atmosphère traverse un système familial, elle produit des personnes fines, responsables, parfois très profondes. Mais elle produit aussi une difficulté à se vivre comme pleinement autorisé. La personne apprend à sentir très tôt ce qui est acceptable et ce qui ne l’est pas. Elle apprend à se contenir avant même de savoir ce qu’elle veut. Elle apprend à rester compatible avec le système. Plus tard, cela donne souvent des adultes capables de lire les autres avec beaucoup de finesse, mais moins entraînés à se dire eux-mêmes avec simplicité.

La sensation de décalage vient souvent de là. Pas d’un destin exceptionnel. Pas d’une singularité romantique. D’un fait plus concret. Une partie de vous veut vivre selon une logique plus vraie que celle qui vous a structuré. Elle veut moins de compression, moins de devoir, moins d’adaptation, moins de retenue automatique. Mais une loyauté invisible continue parfois de murmurer qu’aller plus loin serait trahir quelque chose. Aller plus vite. Demander plus. Être plus visible. Réussir davantage. Être plus libre. Tout cela peut activer une culpabilité silencieuse.

Le pattern à casser ressemble donc à un renversement de priorité. Tant que vous placez la loyauté au système ancien au-dessus de la fidélité à ce qui est vivant en vous, votre vie reste en retard sur votre maturité. La croyance héritée qui semble devoir être quittée pourrait être formulée ainsi. Il faut tenir avant de vivre. Il faut rester acceptable avant d’être vrai. Il faut porter avant de se choisir.

La permission à vous donner est presque l’inverse. Vous avez le droit de vivre sans passer en premier par la contraction. Vous avez le droit d’exister sans tout mériter par la retenue. Vous avez le droit de parler plus clair, de demander plus net, de prendre plus de place, sans devoir vous excuser d’exister.

Votre contribution naturelle se situe de l’autre côté de ce passage. La logique symbolique de votre profil indique une capacité réelle à éclairer, relier, transmettre, clarifier, accompagner ou structurer avec profondeur. Mais cette contribution reste bridée tant que vous utilisez votre intelligence pour vous protéger plus que pour vous engager.`,
    currentCycles:
      `Votre cycle actuel agit comme un révélateur. L’année personnelle ${numerology.personalYear} ne crée pas magiquement votre réalité. En revanche, elle appuie là où quelque chose doit bouger. Si ça frotte en ce moment, ce n’est pas forcément parce que la vie est contre vous. C’est souvent parce qu’un ancien fonctionnement arrive à sa limite d’efficacité.

Ce cycle vous demande moins de délai intérieur et plus de cohérence concrète. Il remet sous tension ce que vous ne pouvez plus continuer à gérer à l’ancienne. Une relation. Un positionnement. Une manière de travailler. Un rapport à l’argent. Une façon de vous taire. Une façon de tenir. Ce n’est pas forcément spectaculaire, mais c’est précis.

La bonne question n’est pas seulement. Que dois-je faire maintenant. La bonne question est. Qu’est-ce que je sais déjà, mais que je n’ose pas encore rendre concret. C’est là que le cycle pousse. Pas vers plus de compréhension abstraite. Vers plus de conséquence réelle.`,
    careerMoney:
      `Votre rapport à la valeur et à l’argent mérite une lecture franche. Le problème ne semble pas être l’absence de capacité. Il semble être la difficulté à assumer complètement ce que votre valeur exigerait comme visibilité, comme cadre, comme demande, comme autorité ou comme exposition.

L’argent a une fonction redoutable. Il révèle ce que vous pensez valoir quand personne ne vous rassure. Il révèle aussi le niveau de place que vous êtes prêt à occuper. Si vous attendez trop avant de demander, si vous restez flou sur ce que vous proposez, si vous minimisez ce que vous apportez, si vous sous-facturez, si vous diluez votre positionnement, ou si vous espérez être reconnu sans vous montrer plus clairement, le sujet n’est pas seulement commercial. Il touche à votre légitimité incarnée.

Certaines personnes gardent inconsciemment un plafond financier parce que ce plafond les protège. Tant qu’elles ne gagnent pas vraiment plus, elles n’ont pas à gérer la visibilité, la rivalité, l’augmentation des attentes, ou le risque d’être contestées. La frustration est réelle, mais elle évite certaines expositions. C’est dur à admettre, pourtant c’est souvent vrai.

Votre énergie naturelle semble aller vers des terrains où il faut comprendre l’humain, sentir les dynamiques, relier ce qui ne se parle pas, clarifier ce qui est confus, ou accompagner des passages. Là où ça bloque, c’est quand cette profondeur doit se traduire en offre claire, en prix, en rythme, en décision, en répétition. Vous pouvez aimer la profondeur et résister à l’incarnation qu’elle demande.

Le potentiel non exploité, ici, n’est pas une qualité cachée dans un coin. Il est souvent visible depuis longtemps. Ce qui manque, c’est l’autorisation. L’autorisation d’être plus net. De demander. De trancher. D’occuper plus de place. De rendre la valeur plus simple à voir. Si vous dépassez ce seuil, vous n’obtenez pas seulement plus de résultats. Vous changez de rapport à vous-même.`,
    mutedVitalImpulse:
      `Ce qui cherche à vivre davantage en vous semble étonnamment simple. Plus de franchise. Plus d’élan assumé. Plus de cohérence entre ce que vous sentez et ce que vous faites. Votre élan vital n’est pas absent. Il est comprimé. Il attend moins de précautions et plus de passage à l’acte.

Le problème, c’est que cet élan a longtemps dû composer avec un système de protection plus ancien. Il a donc appris à se montrer par vagues. Un peu d’envie, puis du frein. Un peu de désir, puis du report. Un peu de puissance, puis du contrôle. Tant que cette logique reste en place, vous pouvez croire que vous manquez de constance alors que vous manquez surtout d’autorisation.

Ce qui veut bouger n’est pas une nouvelle version spectaculaire de vous-même. C’est une version plus simple, plus tranchée, plus vivante. Une version qui ne confond plus profondeur et retenue.`,
    hardTruthExpanded:
      `La vérité la plus utile tient en peu de mots. Vous savez probablement déjà une partie importante de ce que vous devriez faire. Ce qui manque n’est pas un nouveau déclic. Ce qui manque, c’est l’acceptation du coût du réel. Dire. Demander. Refuser. Montrer. Renoncer. Tenir une position. Tant que vous gardez la compréhension comme refuge, vous restez protégé. Vous restez aussi partiellement empêché.`,
    shiftPlan:
      `Pendant les sept prochains jours, observez un seul mécanisme. Chaque fois que vous savez déjà ce que vous devriez dire, demander, arrêter ou clarifier, mais que vous ajoutez du délai. Notez la situation. Notez la peur associée. Notez la phrase simple que vous auriez pu poser.

À la fin de la semaine, choisissez un seul terrain de vérité. Pas toute votre vie. Un endroit précis. Une relation, un cadre, une offre, une décision, une demande. Puis posez un acte net. Une phrase. Une limite. Un prix. Un refus. Une annonce. Pas un grand virage théorique. Un geste réel.

Ensuite, regardez ce qui se passe en vous. Si l’inconfort monte, ne concluez pas que vous avez eu tort. Concluez simplement que vous avez touché la zone exacte que votre système protège. C’est cette zone qu’il faut maintenant traverser avec plus de régularité.

Enfin, retirez une chose à votre système de protection. Une seule. Une justification inutile. Une nuance de trop. Un délai. Une manière de rester flou. Une façon de vous faire petit pour rester tranquille. Vous ne changez pas de vie d’un coup. Vous commencez à la rendre plus cohérente, un acte à la fois.`,
    journalQuestions: [
      "Où est-ce que je continue à appeler maturité une forme de retenue qui me coupe de ma vérité simple ?",
      "Quel ancien contrat suis-je encore en train d’honorer alors qu’il étouffe mon élan ?",
      "Si je cessais d’attendre la permission, qu’est-ce que je rendrais visible maintenant ?",
    ],
  };
}

async function callOpenAI(prompt: string, model: string) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model,
    input: prompt,
  });
  return response.output_text;
}

export async function generateFreeAnalysis(answers: QuizAnswers) {
  const numerology = computeNumerology(answers.birthDate);
  if (!process.env.OPENAI_API_KEY) {
    return mockFree(answers);
  }

  try {
    const prompt = buildFreePrompt(answers, numerology);
    const text = await callOpenAI(prompt, process.env.OPENAI_FREE_MODEL || "gpt-5.4-mini");
    const json = extractJson(text);
    return freeAnalysisSchema.parse(JSON.parse(json));
  } catch (error) {
    console.error("generateFreeAnalysis fallback", error);
    return mockFree(answers);
  }
}

export async function generatePremiumAnalysis(answers: QuizAnswers) {
  const numerology = computeNumerology(answers.birthDate);
  if (!process.env.OPENAI_API_KEY) {
    return mockPremium(answers);
  }

  try {
    const prompt = buildPremiumPrompt(answers, numerology);
    const text = await callOpenAI(prompt, process.env.OPENAI_PREMIUM_MODEL || process.env.OPENAI_FREE_MODEL || "gpt-5.4-mini");
    const json = extractJson(text);
    return premiumAnalysisSchema.parse(JSON.parse(json));
  } catch (error) {
    console.error("generatePremiumAnalysis fallback", error);
    return mockPremium(answers);
  }
}
