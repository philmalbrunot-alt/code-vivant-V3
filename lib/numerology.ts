import { NumerologyProfile } from "@/lib/types";

function preserveMasters(n: number) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

export function parseBirthDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("Date de naissance invalide");
  }
  return { year, month, day };
}

export function computeNumerology(birthDate: string, now = new Date()): NumerologyProfile {
  const { year, month, day } = parseBirthDate(birthDate);

  const lifePath = preserveMasters(
    preserveMasters(day) +
      preserveMasters(month) +
      preserveMasters(String(year).split("").reduce((a, b) => a + Number(b), 0)),
  );

  const dayNumber = preserveMasters(day);
  const attitudeNumber = preserveMasters(day + month);
  const currentYear = now.getFullYear();
  const personalYear = preserveMasters(
    preserveMasters(day) +
      preserveMasters(month) +
      preserveMasters(String(currentYear).split("").reduce((a, b) => a + Number(b), 0)),
  );

  return {
    lifePath,
    dayNumber,
    attitudeNumber,
    personalYear,
    birthDay: day,
    birthMonth: month,
    birthYear: year,
  };
}

export function compactAnswersForStripe(answers: {
  firstName: string;
  birthDate: string;
  birthPlace: string;
  currentFocus: string;
  energyState: string;
  stressResponse: string;
}) {
  return JSON.stringify({
    n: answers.firstName,
    d: answers.birthDate,
    p: answers.birthPlace,
    f: answers.currentFocus,
    e: answers.energyState,
    s: answers.stressResponse,
  });
}

export function expandAnswersFromStripe(value: string) {
  const parsed = JSON.parse(value);
  return {
    firstName: parsed.n,
    birthDate: parsed.d,
    birthPlace: parsed.p,
    currentFocus: parsed.f,
    energyState: parsed.e,
    stressResponse: parsed.s,
  };
}
