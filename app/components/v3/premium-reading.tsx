'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { STATIC_COPY } from '@/lib/content';
import { premiumStorageKey } from '@/lib/storage';
import type { FullAnalysisPayload, QuizAnswers } from '@/lib/types';
import { splitParagraphs } from '@/lib/utils';
import { AnchorButton, BrandHeader, Container, Label, Panel, Shell } from './ui';

const reservationUrl = 'https://koalendar.com/e/echange-avec-philippe-malbrunot';

type PremiumPageProps = {
  token: string;
};

export function PremiumReadingPage({ token }: PremiumPageProps) {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(premiumStorageKey(token));
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as { answers: QuizAnswers; analysis: FullAnalysisPayload };
      setAnswers(parsed.answers);
      setAnalysis(parsed.analysis);
    } catch {
      router.replace('/');
    }
  }, [router, token]);

  const steps = useMemo(() => {
    if (!analysis?.premium) return [];
    return [
      { title: STATIC_COPY.premiumStepTitles[0], text: analysis.premium.deepBlocks },
      { title: STATIC_COPY.premiumStepTitles[1], text: analysis.premium.inheritedPatterns },
      { title: STATIC_COPY.premiumStepTitles[2], text: analysis.premium.careerMoney },
      { title: STATIC_COPY.premiumStepTitles[3], text: analysis.premium.mutedVitalImpulse },
      { title: STATIC_COPY.premiumStepTitles[4], text: analysis.premium.shiftPlan },
      { title: STATIC_COPY.premiumStepTitles[5], text: analysis.premium.journalQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n') },
    ];
  }, [analysis]);

  if (!analysis?.premium || !answers) {
    return (
      <Shell>
        <Container>
          <BrandHeader compact />
          <Panel>
            <p className="text-sm text-cv-muted">Chargement de votre lecture complète…</p>
          </Panel>
        </Container>
      </Shell>
    );
  }

  return (
    <Shell>
      <Container className="max-w-4xl">
        <BrandHeader compact />
        <div className="space-y-5">
          <Panel className="px-6 py-7 md:px-8 md:py-8">
            <Label>{STATIC_COPY.premiumHeroLabel}</Label>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{STATIC_COPY.premiumHeroTitle}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-cv-muted">{STATIC_COPY.premiumHeroBody}</p>
            <p className="mt-4 text-sm leading-7 text-cv-gold/90 md:text-base">{STATIC_COPY.premiumHeroBridge}</p>
          </Panel>

          <Panel className="px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
              {STATIC_COPY.premiumStepTitles.map((title, index) => (
                <div key={title} className="rounded-2xl border border-cv-line bg-cv-panelAlt px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-cv-gold/80">Étape {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-cv-text">{title}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">Lecture d’ensemble</h2>
            <div className="mt-5 space-y-4">
              {splitParagraphs(analysis.premium.globalReading).map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-cv-muted md:text-base md:leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </Panel>

          {steps.map((step, index) => (
            <Panel key={step.title}>
              <Label>ÉTAPE {index + 1}</Label>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{step.title}</h2>
              <div className="mt-5 space-y-4">
                {splitParagraphs(step.text).map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="text-sm leading-7 text-cv-muted md:text-base md:leading-8 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Panel>
          ))}

          <Panel className="px-6 py-7 md:px-8 md:py-8">
            <Label>{STATIC_COPY.bridgeLabel}</Label>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{STATIC_COPY.bridgeTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.bridgeBody}</p>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.bridgeBody2}</p>
            <p className="mt-5 text-sm leading-7 text-cv-gold/90 md:text-base">{STATIC_COPY.bridgeLine}</p>
          </Panel>

          <Panel className="relative overflow-hidden border-cv-gold/22 bg-cv-panelAlt px-6 py-7 md:px-8 md:py-8">
            <Label>{STATIC_COPY.sessionLabel}</Label>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{STATIC_COPY.sessionTitle}</h2>
            <p className="mt-4 text-5xl font-semibold text-cv-gold">{STATIC_COPY.sessionPrice}</p>
            <p className="mt-5 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.sessionShort}</p>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.sessionBody}</p>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.sessionBody2}</p>
            <p className="mt-4 text-sm leading-7 text-cv-faint">{STATIC_COPY.sessionMicro}</p>
            <div className="mt-7">
              <AnchorButton href={reservationUrl} target="_blank" rel="noreferrer" className="w-full justify-center border-cv-gold/30 bg-cv-gold/10 text-cv-text hover:bg-cv-gold/15 md:w-auto">
                {STATIC_COPY.sessionCta}
                <ArrowRight className="h-4 w-4" />
              </AnchorButton>
            </div>
          </Panel>
        </div>
      </Container>
    </Shell>
  );
}
