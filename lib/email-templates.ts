import { PremiumAnalysis, QuizAnswers } from "@/lib/types";

export function buildPremiumEmailHtml(
  answers: QuizAnswers,
  premium: PremiumAnalysis,
  appBaseUrl: string,
) {
  const questions = premium.journalQuestions
    .map((q) => `<li style="margin: 0 0 12px 0;">${q}</li>`)
    .join("");

  return `
  <div style="background:#070512;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#f4efe7;">
    <div style="max-width:720px;margin:0 auto;background:#0d0a1f;border:1px solid rgba(216,163,93,.22);border-radius:20px;padding:32px;">
      <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d8a35d;margin:0 0 8px;">CODE VIVANT</p>
      <p style="font-size:13px;color:#bfb7cb;margin:0 0 24px;">par Philippe Malbrunot</p>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.2;margin:0 0 16px;">Votre lecture complète est prête</h1>
      <p style="font-size:15px;line-height:1.8;color:#c7c0d3;margin:0 0 24px;">
        Bonjour ${answers.firstName}, voici votre lecture premium CODE VIVANT.
      </p>

      ${section("Lecture globale", premium.globalReading)}
      ${section("Blocages profonds", premium.deepBlocks)}
      ${section("Héritage et patterns", premium.inheritedPatterns)}
      ${section("Cycles actuels", premium.currentCycles)}
      ${section("Carrière, argent et valeur", premium.careerMoney)}
      ${section("Élan vital étouffé", premium.mutedVitalImpulse)}
      ${section("Vérité à entendre", premium.hardTruthExpanded)}
      ${section("Plan de bascule", premium.shiftPlan)}

      <div style="margin-top:28px;padding:22px;border-radius:16px;background:rgba(216,163,93,.08);border:1px solid rgba(216,163,93,.22);">
        <p style="margin:0 0 12px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#d8a35d;">Questions de journal</p>
        <ol style="padding-left:20px;margin:0;font-size:15px;line-height:1.8;color:#c7c0d3;">${questions}</ol>
      </div>

      <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(216,163,93,.18);">
        <p style="font-size:15px;line-height:1.8;color:#c7c0d3;margin:0 0 16px;">
          Si vous voulez aller plus loin, vous pouvez réserver un échange avec Philippe.
        </p>
        <a href="https://koalendar.com/e/echange-avec-philippe-malbrunot" style="display:inline-block;padding:12px 18px;border-radius:12px;background:rgba(216,163,93,.12);border:1px solid rgba(216,163,93,.35);color:#f4efe7;text-decoration:none;">
          Réserver un échange
        </a>
      </div>

      <p style="font-size:12px;line-height:1.7;color:#8b819f;margin:28px 0 0;">
        Vous pouvez retrouver l'expérience CODE VIVANT sur <a href="${appBaseUrl}" style="color:#d8a35d;">${appBaseUrl}</a>.
      </p>
    </div>
  </div>
  `;
}

function section(title: string, text: string) {
  return `
    <div style="margin-top:24px;padding:22px;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid rgba(216,163,93,.16);">
      <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#d8a35d;">${title}</p>
      <p style="margin:0;font-size:15px;line-height:1.8;color:#c7c0d3;white-space:pre-wrap;">${text}</p>
    </div>
  `;
}

export function buildPremiumEmailText(answers: QuizAnswers, premium: PremiumAnalysis) {
  return `
CODE VIVANT
par Philippe Malbrunot

Bonjour ${answers.firstName},

Votre lecture premium est prête.

LECTURE GLOBALE
${premium.globalReading}

BLOCAGES PROFONDS
${premium.deepBlocks}

HÉRITAGE ET PATTERNS
${premium.inheritedPatterns}

CYCLES ACTUELS
${premium.currentCycles}

CARRIÈRE, ARGENT ET VALEUR
${premium.careerMoney}

ÉLAN VITAL ÉTOUFFÉ
${premium.mutedVitalImpulse}

VÉRITÉ À ENTENDRE
${premium.hardTruthExpanded}

PLAN DE BASCULE
${premium.shiftPlan}

QUESTIONS DE JOURNAL
1. ${premium.journalQuestions[0]}
2. ${premium.journalQuestions[1]}
3. ${premium.journalQuestions[2]}

Réserver un échange :
https://koalendar.com/e/echange-avec-philippe-malbrunot
  `.trim();
}
