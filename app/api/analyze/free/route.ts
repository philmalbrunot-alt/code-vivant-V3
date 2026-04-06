import { NextResponse } from "next/server";
import { generateFreeAnalysis } from "@/lib/openai";
import { computeNumerology } from "@/lib/numerology";
import { quizAnswersSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const answers = quizAnswersSchema.parse(json);
    const numerology = computeNumerology(answers.birthDate);
    const free = await generateFreeAnalysis(answers);

    return NextResponse.json({
      numerology,
      free,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de générer l’aperçu gratuit." },
      { status: 400 },
    );
  }
}
