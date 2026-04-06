export type QuizAnswers = {
  firstName: string;
  birthDate: string;
  birthPlace: string;
  currentFocus:
    | ""
    | "blocage"
    | "transition"
    | "profondeur"
    | "relations"
    | "curiosite";
  energyState:
    | ""
    | "epuise"
    | "instable"
    | "tension"
    | "plat"
    | "presque";
  stressResponse:
    | ""
    | "retrait"
    | "suranalyse"
    | "suradaptation"
    | "irritabilite"
    | "masque";
};

export type NumerologyProfile = {
  lifePath: number;
  dayNumber: number;
  attitudeNumber: number;
  personalYear: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
};

export type FreeAnalysis = {
  title: string;
  subtitle: string;
  overview: string;
  survivalMode: string;
  blindSpot: string;
  generationalPattern: string;
  moneyBlock: string;
  hardTruth: string;
  weekShift: string;
  premiumTease: string;
};

export type PremiumAnalysis = {
  globalReading: string;
  deepBlocks: string;
  inheritedPatterns: string;
  currentCycles: string;
  careerMoney: string;
  mutedVitalImpulse: string;
  hardTruthExpanded: string;
  shiftPlan: string;
  journalQuestions: string[];
};

export type FullAnalysisPayload = {
  numerology: NumerologyProfile;
  free: FreeAnalysis;
  premium?: PremiumAnalysis;
};
