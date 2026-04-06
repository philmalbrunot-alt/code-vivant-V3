'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { BadgeRow, BrandHeader, Container, Label, Panel, PrimaryButton, Shell } from '@/app/components/v3/ui';
import { QuestionFlow, type QuizAnswers } from '@/app/components/v3/question-flow';

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit(values: QuizAnswers) {
  try {
    setIsSubmitting(true);

    const [day = '', month = '', year = ''] = values.birthDate.split('/');

    const payload = {
      prenom: values.firstName,
      dateNaissance: {
        day,
        month,
        year,
      },
      lieu: values.birthPlace,
      situation: values.situation,
      energie: values.energy,
      defense: values.reaction,
    };

    const res = await fetch('/api/analyze/free', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Impossible de générer votre portrait.');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'code-vivant-free-reading',
        JSON.stringify({
          answers: payload,
          analysis: data,
        }),
      );
    }

    router.push('/resultat');
  } catch (error) {
    console.error(error);
    alert("Impossible de générer le portrait pour le moment.");
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <Shell>
      <Container>
        <BrandHeader />

        {!started ? (
          <Panel className="py-12 md:py-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">
                <Sparkles className="h-6 w-6" />
              </div>

              <div className="mt-8">
                <Label>DIAGNOSTIC INTÉRIEUR</Label>
                <h1 className="mt-4 font-serif text-4xl leading-tight text-cv-text md:text-7xl">
                  Votre portrait intérieur : ce qui vous protège et vous bloque
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cv-text/90 md:text-2xl">
                  Mettez en lumière le mécanisme intérieur qui vous protège encore… mais vous retient de vivre plus pleinement.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-cv-muted md:text-base">
                  Répondez à quelques questions et recevez un premier décryptage de votre mode de protection, de votre blocage central et de ce qui cherche à bouger en vous.
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cv-muted md:text-base">
                  Votre portrait s’appuie sur la numérologie, une lecture psychospirituelle et une approche systémique de vos schémas profonds.
                </p>
              </div>

              <BadgeRow items={['DIAGNOSTIC EXPRESS', 'APERÇU GRATUIT', 'LECTURE IMMÉDIATE']} />

              <PrimaryButton type="button" onClick={() => setStarted(true)} className="mt-10 min-w-[190px]">
                Voir mon portrait
              </PrimaryButton>
            </div>
          </Panel>
        ) : (
          <QuestionFlow onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </Container>
    </Shell>
  );
}
