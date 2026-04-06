'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, MapPin, User } from 'lucide-react';
import { PrimaryButton, ProgressBar, SecondaryButton, Panel } from './ui';

export type QuizAnswers = {
  firstName: string;
  birthDate: string;
  birthPlace: string;
  situation: string;
  energy: string;
  reaction: string;
};

type StepKey = 'firstName' | 'birthDate' | 'birthPlace' | 'situation' | 'energy' | 'reaction';

const steps: {
  key: StepKey;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'text' | 'date' | 'choice';
  options?: string[];
  placeholder?: string;
}[] = [
  {
    key: 'firstName',
    title: 'Votre prénom',
    subtitle: 'Il sera réutilisé avec parcimonie, uniquement pour ancrer la lecture.',
    icon: User,
    type: 'text',
    placeholder: 'Ex. Martin',
  },
  {
    key: 'birthDate',
    title: 'Votre date de naissance',
    subtitle: 'Elle sert de base symbolique à la lecture.',
    icon: Calendar,
    type: 'date',
    placeholder: 'JJ/MM/AAAA',
  },
  {
    key: 'birthPlace',
    title: 'Votre lieu de naissance',
    subtitle: 'Ville ou commune de naissance.',
    icon: MapPin,
    type: 'text',
    placeholder: 'Ex. Aix-les-Bains',
  },
  {
    key: 'situation',
    title: 'Qu’est-ce qui vous amène ici ?',
    subtitle: 'Choisissez ce qui résonne le plus aujourd’hui.',
    icon: User,
    type: 'choice',
    options: [
      'Je me sens bloqué(e), comme si je tournais en rond',
      'Je traverse une période de changement ou de doute',
      'Je veux mieux me comprendre, en profondeur',
      'Mes relations m’épuisent ou me questionnent',
      'Simple curiosité, je veux voir ce que ça donne',
    ],
  },
  {
    key: 'energy',
    title: 'En ce moment, votre niveau d’énergie ressemble à…',
    subtitle: 'Choisissez la formule la plus juste.',
    icon: User,
    type: 'choice',
    options: [
      'Épuisé(e), même le repos ne suffit plus',
      'Des hauts et des bas, je ne sais jamais comment je vais me réveiller',
      'Sous tension, je tiens, mais je sens que ça tire',
      'Plat, pas de fatigue extrême, mais pas d’élan non plus',
      'Plutôt bien, mais quelque chose manque quand même',
    ],
  },
  {
    key: 'reaction',
    title: 'Quand ça ne va pas, vous faites quoi le plus souvent ?',
    subtitle: 'Choisissez votre réflexe dominant.',
    icon: User,
    type: 'choice',
    options: [
      'Je me replie et je disparais un peu',
      'Je suranalyse tout',
      'Je m’occupe des autres pour éviter de me regarder',
      'Je deviens irritable ou sec',
      'Je fais comme si tout allait bien',
    ],
  },
];

const initialAnswers: QuizAnswers = {
  firstName: '',
  birthDate: '',
  birthPlace: '',
  situation: '',
  energy: '',
  reaction: '',
};

export function QuestionFlow({
  onSubmit,
  isSubmitting = false,
}: {
  onSubmit: (values: QuizAnswers) => void;
  isSubmitting?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);

  const step = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  const canContinue = useMemo(() => {
    const value = answers[step.key];
    return typeof value === 'string' && value.trim().length > 0;
  }, [answers, step.key]);

  function updateValue(value: string) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  function handleNext() {
    if (!canContinue) return;
    if (index === steps.length - 1) {
      onSubmit(answers);
      return;
    }
    setIndex((prev) => prev + 1);
  }

  function handleBack() {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
  }

  return (
    <Panel className="mt-8">
      <ProgressBar value={progress} />

      <div className="mx-auto max-w-3xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">
          <step.icon className="h-5 w-5" />
        </div>

        <h2 className="mt-6 text-center font-serif text-3xl text-cv-text md:text-4xl">{step.title}</h2>
        <p className="mt-3 text-center text-sm leading-7 text-cv-muted md:text-base">{step.subtitle}</p>

        <div className="mt-8">
          {step.type === 'text' && (
            <input
              value={answers[step.key]}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={step.placeholder}
              className="w-full rounded-2xl border border-cv-line bg-cv-panelAlt px-5 py-4 text-base text-cv-text outline-none placeholder:text-cv-faint"
            />
          )}

          {step.type === 'date' && (
            <input
              value={answers[step.key]}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={step.placeholder}
              className="w-full rounded-2xl border border-cv-line bg-cv-panelAlt px-5 py-4 text-base text-cv-text outline-none placeholder:text-cv-faint"
            />
          )}

          {step.type === 'choice' && (
            <div className="space-y-3">
              {step.options?.map((option) => {
                const selected = answers[step.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateValue(option)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-sm leading-7 transition ${
                      selected
                        ? 'border-cv-gold/30 bg-cv-gold/10 text-cv-text'
                        : 'border-cv-line bg-cv-panelAlt text-cv-muted hover:border-cv-gold/15'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <SecondaryButton type="button" onClick={handleBack} className="min-w-[120px]">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </SecondaryButton>

          <PrimaryButton
            type="button"
            onClick={handleNext}
            disabled={!canContinue || isSubmitting}
            className="min-w-[150px]"
          >
            {index === steps.length - 1 ? 'Voir mon portrait' : 'Continuer'}
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </Panel>
  );
}
