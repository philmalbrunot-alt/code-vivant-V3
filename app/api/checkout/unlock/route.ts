import { NextResponse } from "next/server";
import { expandAnswersFromStripe } from "@/lib/numerology";
import { generatePremiumAnalysis } from "@/lib/openai";
import { getStripe } from "@/lib/stripe";
import { quizAnswersSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session invalide." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Le paiement n'est pas confirmé." },
        { status: 402 },
      );
    }

    const compact = session.metadata?.answers;
    if (!compact) {
      return NextResponse.json(
        { error: "Les données du profil sont introuvables." },
        { status: 400 },
      );
    }

    const answers = quizAnswersSchema.parse(expandAnswersFromStripe(compact));
    const premium = await generatePremiumAnalysis(answers);

    return NextResponse.json({
      premium,
      customerEmail: session.customer_details?.email || null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de déverrouiller le profil complet." },
      { status: 400 },
    );
  }
}
