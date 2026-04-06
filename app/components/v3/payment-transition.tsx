'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { STATIC_COPY } from '@/lib/content';
import { FREE_STORAGE_KEY, premiumStorageKey } from '@/lib/storage';
import type { FullAnalysisPayload, PremiumAnalysis, QuizAnswers } from '@/lib/types';
import { BrandHeader, Container, Label, Panel, Shell } from './ui';

export function PaymentTransitionPage({ sessionId }: { sessionId: string }) {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [freeAnalysis, setFreeAnalysis] = useState<FullAnalysisPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  const progress = useMemo(() => ((stepIndex + 1) / STATIC_COPY.waitingSteps.length) * 100, [stepIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(FREE_STORAGE_KEY);
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as { answers: QuizAnswers; analysis: FullAnalysisPayload };
      setAnswers(parsed.answers);
      setFreeAnalysis(parsed.analysis);
    } catch {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex((prev) => (prev >= STATIC_COPY.waitingSteps.length - 1 ? prev : prev + 1));
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sessionId || !answers || !freeAnalysis || ready) return;
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch('/api/checkout/unlock', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok || !data.premium) {
          throw new Error(data.error || 'Impossible de préparer la lecture complète.');
        }
        if (cancelled) return;

        const token = sessionId;
        const payload = {
          answers,
          analysis: {
            ...freeAnalysis,
            premium: data.premium as PremiumAnalysis,
          },
        };

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(premiumStorageKey(token), JSON.stringify(payload));
        }
        setReady(true);
        window.setTimeout(() => {
          router.replace(`/lecture/${encodeURIComponent(token)}`);
        }, 600);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inattendue.');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [answers, freeAnalysis, ready, router, sessionId]);

  return (
    <Shell>
      <Container className="max-w-3xl">
        <BrandHeader compact />
        <Panel className="px-6 py-8 md:px-10 md:py-10">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </div>
            <div className="flex-1">
              <Label>LECTURE COMPLÈTE</Label>
              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{STATIC_COPY.waitingTitle}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-cv-muted">{STATIC_COPY.waitingBody}</p>
              <p className="mt-3 text-sm leading-7 text-cv-faint">{STATIC_COPY.waitingMicro}</p>
            </div>
          </div>

          <div className="mt-8 h-1 overflow-hidden rounded-full bg-cv-goldSoft">
            <div className="h-full rounded-full bg-cv-gold transition-all duration-500" style={{ width: `${ready ? 100 : progress}%` }} />
          </div>

          <div className="mt-8 space-y-4">
            {STATIC_COPY.waitingSteps.map((step, index) => {
              const active = index <= stepIndex || ready;
              return (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-cv-line bg-cv-panelAlt px-4 py-4">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${active ? 'border-cv-gold/35 bg-cv-gold/10 text-cv-gold' : 'border-cv-line text-cv-faint'}`}>
                    {index + 1}
                  </div>
                  <p className={active ? 'text-cv-text' : 'text-cv-muted'}>{step}</p>
                </div>
              );
            })}
          </div>

          {error ? <p className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <p className="mt-8 text-sm leading-7 text-cv-faint">{STATIC_COPY.waitingFooter}</p>
        </Panel>
      </Container>
    </Shell>
  );
}
