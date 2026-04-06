'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Shield, Sparkles, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRAND, QUIZ_OPTIONS } from '@/lib/content';
import { quizAnswersSchema } from '@/lib/schemas';
import type { FullAnalysisPayload, QuizAnswers } from '@/lib/types';
import { FREE_STORAGE_KEY } from '@/lib/storage';
import { BadgeRow, BrandHeader, Container, Label, Panel, PrimaryButton, ProgressBar, SecondaryButton, Shell } from './ui';

const INITIAL_ANSWERS: QuizAnswers = {
  firstName: '',
  birthDate: '',
  birthPlace: '',
  currentFocus: '',
  energyState: '',
  stressResponse: '',
};

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function LandingQuestionFlow() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const progress = useMemo(() => ((step - 1) / 5) * 100, [step]);

  async function generate() {
    try {
      setLoading(true);
      setError(null);
      quizAnswersSchema.parse(answers);

      const res = await fetch('/api/analyze/free', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible de générer votre aperçu.');
      }

      const payload: FullAnalysisPayload = { numerology: data.numerology, free: data.free };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(FREE_STORAGE_KEY, JSON.stringify({ answers, analysis: payload }));
      }
      router.push('/resultat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => {
    setError(null);
    setStep((prev) => (prev === 0 ? 0 : ((prev - 1) as Step)));
  };

  const goNext = () => {
    setError(null);
    setStep((prev) => (prev === 6 ? 6 : ((prev + 1) as Step)));
  };

  return (
    <Shell>
      <Container className="max-w-3xl">
        <BrandHeader />

        {step === 0 ? (
          <Panel className="px-6 py-8 md:px-10 md:py-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>

            <div className="mx-auto max-w-2xl text-center">
              <Label>{BRAND.heroLabel}</Label>
              <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{BRAND.headline}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-cv-muted md:text-xl">{BRAND.subheadline}</p>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cv-faint md:text-base">{BRAND.description}</p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-cv-muted/90 md:text-base">{BRAND.method}</p>
            </div>

            <BadgeRow items={BRAND.badges} />

            <div className="mt-8 flex justify-center md:mt-10">
              <PrimaryButton onClick={() => setStep(1)}>
                {BRAND.cta}
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </Panel>
        ) : (
          <Panel>
            <ProgressBar value={progress} />

            {step === 1 ? (
              <QuestionShell icon={<User className="h-5 w-5" />} title="Votre prénom" subtitle="Il sera réutilisé avec parcimonie, uniquement pour ancrer la lecture.">
                <input
                  value={answers.firstName}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/40"
                  placeholder="Ex. Martin"
                />
                <Actions onBack={goBack} onNext={goNext} nextDisabled={!answers.firstName.trim()} />
              </QuestionShell>
            ) : null}

            {step === 2 ? (
              <QuestionShell icon={<CalendarDays className="h-5 w-5" />} title="Votre date de naissance" subtitle="Elle sert uniquement à la lecture interne. Elle n’est pas affichée ensuite.">
                <input
                  type="date"
                  value={answers.birthDate}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, birthDate: e.target.value }))}
                  className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/40"
                />
                <Actions onBack={goBack} onNext={goNext} nextDisabled={!answers.birthDate} />
              </QuestionShell>
            ) : null}

            {step === 3 ? (
              <QuestionShell icon={<MapPin className="h-5 w-5" />} title="Votre lieu de naissance" subtitle="Ville ou ville et pays. Une réponse simple suffit.">
                <input
                  value={answers.birthPlace}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, birthPlace: e.target.value }))}
                  className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/40"
                  placeholder="Ex. Boulogne-Billancourt, France"
                />
                <Actions onBack={goBack} onNext={goNext} nextDisabled={!answers.birthPlace.trim()} />
              </QuestionShell>
            ) : null}

            {step === 4 ? (
              <ChoiceStep
                title="Qu’est-ce qui vous amène ici aujourd’hui ?"
                subtitle="Choisissez la réponse la plus vivante, pas la plus flatteuse."
                options={QUIZ_OPTIONS.focus}
                value={answers.currentFocus}
                onSelect={(value) => setAnswers((prev) => ({ ...prev, currentFocus: value as QuizAnswers['currentFocus'] }))}
                onBack={goBack}
                onContinue={goNext}
              />
            ) : null}

            {step === 5 ? (
              <ChoiceStep
                title="En ce moment, votre niveau d’énergie ressemble à…"
                subtitle="Le but n’est pas d’être positif. Le but est d’être exact."
                options={QUIZ_OPTIONS.energy}
                value={answers.energyState}
                onSelect={(value) => setAnswers((prev) => ({ ...prev, energyState: value as QuizAnswers['energyState'] }))}
                onBack={goBack}
                onContinue={goNext}
              />
            ) : null}

            {step === 6 ? (
              <QuestionShell icon={<Shield className="h-5 w-5" />} title="Quand ça ne va pas, vous faites quoi le plus souvent ?" subtitle="C’est souvent là que le mécanisme se montre le plus clairement.">
                <div className="mt-8 space-y-3">
                  {QUIZ_OPTIONS.stress.map((option) => {
                    const active = answers.stressResponse === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, stressResponse: option.value as QuizAnswers['stressResponse'] }))}
                        className={`w-full rounded-2xl border px-4 py-4 text-left text-sm leading-7 transition md:text-base ${
                          active ? 'border-cv-gold/35 bg-cv-gold/10 text-cv-text' : 'border-cv-line bg-cv-panelAlt text-cv-muted hover:border-cv-gold/20'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {error ? <p className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SecondaryButton onClick={goBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </SecondaryButton>
                  <PrimaryButton onClick={generate} disabled={!answers.stressResponse || loading}>
                    {loading ? 'Génération…' : 'Voir mon portrait'}
                    <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>
                </div>
              </QuestionShell>
            ) : null}
          </Panel>
        )}
      </Container>
    </Shell>
  );
}

function QuestionShell({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">{icon}</div>
      <div className="mx-auto mt-5 max-w-2xl text-center">
        <h2 className="font-serif text-2xl leading-tight md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-cv-faint md:text-base">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ChoiceStep({ title, subtitle, options, value, onSelect, onBack, onContinue }: { title: string; subtitle: string; options: readonly { value: string; label: string }[]; value: string; onSelect: (value: string) => void; onBack: () => void; onContinue: () => void }) {
  return (
    <QuestionShell icon={<Shield className="h-5 w-5" />} title={title} subtitle={subtitle}>
      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`w-full rounded-2xl border px-4 py-4 text-left text-sm leading-7 transition md:text-base ${
                active ? 'border-cv-gold/35 bg-cv-gold/10 text-cv-text' : 'border-cv-line bg-cv-panelAlt text-cv-muted hover:border-cv-gold/20'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <Actions onBack={onBack} onNext={onContinue} nextDisabled={!value} />
    </QuestionShell>
  );
}

function Actions({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SecondaryButton onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Retour
      </SecondaryButton>
      <PrimaryButton onClick={onNext} disabled={nextDisabled}>
        Continuer
        <ArrowRight className="h-4 w-4" />
      </PrimaryButton>
    </div>
  );
}
