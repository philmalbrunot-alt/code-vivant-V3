import { z } from "zod";

export const quizAnswersSchema = z.object({
  firstName: z.string().min(1).max(80),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthPlace: z.string().min(2).max(120),
  currentFocus: z.enum(["blocage", "transition", "profondeur", "relations", "curiosite"]),
  energyState: z.enum(["epuise", "instable", "tension", "plat", "presque"]),
  stressResponse: z.enum(["retrait", "suranalyse", "suradaptation", "irritabilite", "masque"]),
});

export const freeAnalysisSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  overview: z.string(),
  survivalMode: z.string(),
  blindSpot: z.string(),
  generationalPattern: z.string(),
  moneyBlock: z.string(),
  hardTruth: z.string(),
  weekShift: z.string(),
  premiumTease: z.string(),
});

export const premiumAnalysisSchema = z.object({
  globalReading: z.string(),
  deepBlocks: z.string(),
  inheritedPatterns: z.string(),
  currentCycles: z.string(),
  careerMoney: z.string(),
  mutedVitalImpulse: z.string(),
  hardTruthExpanded: z.string(),
  shiftPlan: z.string(),
  journalQuestions: z.array(z.string()).length(3),
});
