"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Copy,
  Crown,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  MessageCircleMore,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { BRAND, QUIZ_OPTIONS } from "@/lib/content";
import { FullAnalysisPayload, QuizAnswers } from "@/lib/types";
import { cn, splitParagraphs } from "@/lib/utils";

type Props = {
  searchParams?: { session_id?: string; paid?: string };
};

type Step = 0 | 1 | 2 | 3 | 4 | 5;

type ChoiceOption = Readonly<{
  value: string;
  label: string;
}>;

const FIRST_STEP: Step = 0;
const LAST_STEP: Step = 5;

const initialAnswers: QuizAnswers = {
  firstName: "",
  birthDate: "",
  birthPlace: "",
  currentFocus: "",
  energyState: "",
  stressResponse: "",
};

const storageKey = "code-vivant:last-analysis";
const reservationUrl = "https://koalendar.com/e/echange-avec-philippe-malbrunot";

function previousStep(step: Step): Step {
  return step === FIRST_STEP ? FIRST_STEP : ((step - 1) as Step);
}

function nextStep(step: Step): Step {
  return step === LAST_STEP ? LAST_STEP : ((step + 1) as Step);
}

export default function HomeClient({ searchParams }: Props) {
  const [step, setStep] = useState<Step>(FIRST_STEP);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisPayload | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const params = searchParams || {};

      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as {
              answers: QuizAnswers;
              analysis: FullAnalysisPayload;
            };
            setAnswers(parsed.answers);
            setAnalysis(parsed.analysis);
          } catch {
            // ignore corrupt storage
          }
        }
      }

      if (params.session_id) {
        setSessionId(params.session_id);
      }
    };

    hydrate();
  }, [searchParams]);

  useEffect(() => {
    const unlock = async () => {
      if (!sessionId || !analysis?.free || analysis.premium || unlocking) return;

      try {
        setUnlocking(true);
        setError(null);

        const res = await fetch("/api/checkout/unlock", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Impossible de déverrouiller le profil.");
        }

        const nextAnalysis: FullAnalysisPayload = {
          ...analysis,
          premium: data.premium,
        };

        setAnalysis(nextAnalysis);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            storageKey,
            JSON.stringify({
              answers,
              analysis: nextAnalysis,
            }),
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inattendue.");
      } finally {
        setUnlocking(false);
      }
    };

    unlock();
  }, [sessionId, analysis, answers, unlocking]);

  const progress = useMemo(() => {
    if (step === FIRST_STEP) return 0;
    return (step / LAST_STEP) * 100;
  }, [step]);

  async function handleGenerate() {
    if (
      !answers.firstName.trim() ||
      !answers.birthDate ||
      !answers.birthPlace.trim() ||
      !answers.currentFocus ||
      !answers.energyState ||
      !answers.stressResponse
    ) {
      setError("Merci de compléter chaque réponse avant de générer votre aperçu.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/analyze/free", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de générer la lecture.");
      }

      const nextAnalysis: FullAnalysisPayload = {
        numerology: data.numerology,
        free: data.free,
      };

      setAnalysis(nextAnalysis);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            answers,
            analysis: nextAnalysis,
          }),
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    try {
      setUnlocking(true);
      setError(null);

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Paiement indisponible pour le moment.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setUnlocking(false);
    }
  }

  async function handleCopyLink() {
    try {
      if (typeof window === "undefined" || !navigator?.clipboard) return;
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (analysis) {
    return (
      <main className="min-h-screen px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-5xl">
          <BrandHeader compact />
          <ResultPage
            analysis={analysis}
            answers={answers}
            onUnlock={handleCheckout}
            unlocking={unlocking}
            error={error}
            copied={copied}
            onCopyLink={handleCopyLink}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        <BrandHeader />

        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            {step === FIRST_STEP && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <HeroSection onStart={() => setStep(1)} />
              </motion.div>
            )}

            {step > FIRST_STEP && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <QuestionFlow
                  step={step}
                  progress={progress}
                  answers={answers}
                  error={error}
                  loading={loading}
                  setAnswers={setAnswers}
                  onBack={() => {
                    setError(null);
                    setStep((prev) => previousStep(prev));
                  }}
                  onNext={() => {
                    setError(null);
                    setStep((prev) => nextStep(prev));
                  }}
                  onGenerate={handleGenerate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={cn("mx-auto max-w-5xl", compact ? "mb-8" : "mb-4")}>
      <div className="inline-flex flex-col">
        <p className={cn("font-serif tracking-[0.28em] text-cv-gold", compact ? "text-sm" : "text-base")}>
          {BRAND.name}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cv-faint">{BRAND.signature}</p>
      </div>
    </header>
  );
}

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="gold-panel rounded-[32px] px-6 py-8 md:px-10 md:py-12">
      <div className="mb-8 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cv-gold/25 bg-cv-panelAlt">
          <Sparkles className="h-6 w-6 text-cv-gold" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.26em] text-cv-gold/80">diagnostic intérieur</p>
        <h1 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">{BRAND.headline}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cv-muted">{BRAND.subheadline}</p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cv-faint md:text-base">{BRAND.description}</p>
      </div>

      <BadgeRow items={BRAND.badges} />

      <div className="mt-10 flex justify-center">
        <PrimaryButton onClick={onStart}>
          {BRAND.cta}
          <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </section>
  );
}

function BadgeRow({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-cv-faint">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-cv-gold/15 bg-cv-panelAlt px-3 py-1.5">
          {item}
        </span>
      ))}
    </div>
  );
}

function QuestionFlow({
  step,
  progress,
  answers,
  error,
  loading,
  setAnswers,
  onBack,
  onNext,
  onGenerate,
}: {
  step: Step;
  progress: number;
  answers: QuizAnswers;
  error: string | null;
  loading: boolean;
  setAnswers: Dispatch<SetStateAction<QuizAnswers>>;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
}) {
  return (
    <section className="gold-panel rounded-[32px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-8 h-1 overflow-hidden rounded-full bg-cv-goldSoft">
        <motion.div
          className="h-full rounded-full bg-cv-gold"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {step === 1 && (
        <QuestionShell
          icon={<User className="h-5 w-5" />}
          title="Votre prénom"
          subtitle="Il sera utilisé avec parcimonie pour personnaliser la lecture."
        >
          <input
            value={answers.firstName}
            onChange={(e) => setAnswers((prev) => ({ ...prev, firstName: e.target.value }))}
            className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/50"
            placeholder="Ex. Martin"
          />
          <StepActions onBack={onBack} onNext={onNext} nextDisabled={!answers.firstName.trim()} />
        </QuestionShell>
      )}

      {step === 2 && (
        <QuestionShell
          icon={<CalendarDays className="h-5 w-5" />}
          title="Votre date de naissance"
          subtitle="Elle sert au calcul interne du profil, sans être affichée dans le rendu."
        >
          <input
            type="date"
            value={answers.birthDate}
            onChange={(e) => setAnswers((prev) => ({ ...prev, birthDate: e.target.value }))}
            className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/50"
          />
          <StepActions onBack={onBack} onNext={onNext} nextDisabled={!answers.birthDate} />
        </QuestionShell>
      )}

      {step === 3 && (
        <QuestionShell
          icon={<MapPin className="h-5 w-5" />}
          title="Votre lieu de naissance"
          subtitle="Ville ou ville et pays. Une réponse simple suffit."
        >
          <input
            value={answers.birthPlace}
            onChange={(e) => setAnswers((prev) => ({ ...prev, birthPlace: e.target.value }))}
            className="mt-8 w-full rounded-2xl border border-cv-gold/20 bg-cv-panelAlt px-5 py-4 text-base outline-none transition focus:border-cv-gold/50"
            placeholder="Ex. Boulogne-Billancourt, France"
          />
          <StepActions onBack={onBack} onNext={onNext} nextDisabled={!answers.birthPlace.trim()} />
        </QuestionShell>
      )}

      {step === 4 && (
        <ChoiceStep
          title="Qu’est-ce qui vous amène ici aujourd’hui ?"
          subtitle="Choisissez la réponse la plus vivante, pas la plus flatteuse."
          value={answers.currentFocus}
          options={QUIZ_OPTIONS.focus}
          onBack={onBack}
          onChange={(value) =>
            setAnswers((prev) => ({
              ...prev,
              currentFocus: value as QuizAnswers["currentFocus"],
            }))
          }
          onContinue={onNext}
        />
      )}

      {step === 5 && (
        <QuestionShell
          icon={<Shield className="h-5 w-5" />}
          title="Votre état actuel"
          subtitle="Deux réponses courtes pour faire remonter le mécanisme actif en ce moment."
        >
          <div className="mt-8 space-y-8">
            <ChoiceGroup
              legend="En ce moment, votre niveau d’énergie ressemble à…"
              value={answers.energyState}
              options={QUIZ_OPTIONS.energy}
              onChange={(value) =>
                setAnswers((prev) => ({
                  ...prev,
                  energyState: value as QuizAnswers["energyState"],
                }))
              }
            />
            <ChoiceGroup
              legend="Quand ça ne va pas, vous faites quoi le plus souvent ?"
              value={answers.stressResponse}
              options={QUIZ_OPTIONS.stress}
              onChange={(value) =>
                setAnswers((prev) => ({
                  ...prev,
                  stressResponse: value as QuizAnswers["stressResponse"],
                }))
              }
            />
          </div>

          {error && (
            <p className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SecondaryButton onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Retour
            </SecondaryButton>
            <PrimaryButton onClick={onGenerate} disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  Générer mon aperçu
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>
          </div>
        </QuestionShell>
      )}
    </section>
  );
}

function QuestionShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cv-gold/25 bg-cv-panelAlt text-cv-gold">
        {icon}
      </div>
      <div className="mx-auto mt-5 max-w-2xl text-center">
        <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-cv-faint md:text-base">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ChoiceStep({
  title,
  subtitle,
  value,
  options,
  onBack,
  onChange,
  onContinue,
}: {
  title: string;
  subtitle: string;
  value: string;
  options: readonly ChoiceOption[];
  onBack: () => void;
  onChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <QuestionShell icon={<Sparkles className="h-5 w-5" />} title={title} subtitle={subtitle}>
      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "w-full rounded-2xl border px-5 py-4 text-left text-sm leading-7 transition",
                selected
                  ? "border-cv-gold/45 bg-cv-gold/10 text-cv-text"
                  : "border-cv-gold/15 bg-cv-panelAlt text-cv-muted hover:border-cv-gold/30 hover:text-cv-text",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onContinue} nextDisabled={!value} />
    </QuestionShell>
  );
}

function ChoiceGroup({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: string;
  options: readonly ChoiceOption[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm leading-7 text-cv-muted md:text-base">{legend}</legend>
      <div className="mt-4 space-y-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "w-full rounded-2xl border px-5 py-4 text-left text-sm leading-7 transition",
                selected
                  ? "border-cv-gold/45 bg-cv-gold/10 text-cv-text"
                  : "border-cv-gold/15 bg-cv-panelAlt text-cv-muted hover:border-cv-gold/30 hover:text-cv-text",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResultPage({
  analysis,
  answers,
  onUnlock,
  unlocking,
  error,
  copied,
  onCopyLink,
}: {
  analysis: FullAnalysisPayload;
  answers: QuizAnswers;
  onUnlock: () => void;
  unlocking: boolean;
  error: string | null;
  copied: boolean;
  onCopyLink: () => void;
}) {
  const premiumUnlocked = Boolean(analysis.premium);

  return (
    <div className="space-y-6">
      <ResultIntro
        firstName={answers.firstName}
        title={analysis.free.title}
        subtitle={analysis.free.subtitle}
        overview={analysis.free.overview}
      />

      <div className="grid gap-5">
        <ResultSection title="Votre mode de protection principal" content={analysis.free.survivalMode} />
        <ResultSection title="Votre angle mort émotionnel" content={analysis.free.blindSpot} />
        <ResultSection title="Héritage" content={analysis.free.generationalPattern} />
        <ResultSection title="Valeur et légitimité" content={analysis.free.moneyBlock} />
        <ResultSection title="La vérité à entendre maintenant" content={analysis.free.hardTruth} emphasis />
        <ResultSection title="Votre première bascule" content={analysis.free.weekShift} compact />
      </div>

      <LockedContentTeaser text={analysis.free.premiumTease} />

      {unlocking && !premiumUnlocked ? <UnlockingState /> : null}

      {!unlocking && !premiumUnlocked ? (
        <OfferCards
          onUnlock={onUnlock}
          unlocking={unlocking}
          premiumUnlocked={premiumUnlocked}
          error={error}
        />
      ) : null}

      {premiumUnlocked && analysis.premium ? <PremiumArea premium={analysis.premium} /> : null}

      <ShareBlock copied={copied} onCopyLink={onCopyLink} />
      <FooterNote />
    </div>
  );
}

function ResultIntro({
  firstName,
  title,
  subtitle,
  overview,
}: {
  firstName: string;
  title: string;
  subtitle: string;
  overview: string;
}) {
  return (
    <section className="gold-panel rounded-[32px] px-6 py-7 md:px-8 md:py-9">
      <p className="text-xs uppercase tracking-[0.22em] text-cv-gold/80">{title || "résultat"}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div>
          <h1 className="font-serif text-3xl leading-tight md:text-5xl">Ce que votre portrait révèle</h1>
          <div className="prose-cv mt-5 max-w-3xl">
            {splitParagraphs(subtitle).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="prose-cv mt-4 max-w-3xl">
            {splitParagraphs(overview).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] border border-cv-gold/15 bg-cv-panelAlt p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-cv-gold/75">aperçu gratuit</p>
          <p className="mt-4 text-sm leading-7 text-cv-muted">
            {firstName}, ce que vous venez de lire montre déjà un mécanisme précis. Pas encore le verrou complet. Juste ce qu’il faut pour voir où quelque chose vous protège encore… et commence aussi à vous retenir.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultSection({
  title,
  content,
  emphasis = false,
  compact = false,
}: {
  title: string;
  content: string;
  emphasis?: boolean;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border bg-cv-panel/90 px-6 py-6 md:px-7",
        emphasis ? "border-cv-gold/28 shadow-glow" : "border-cv-gold/14",
        compact ? "md:py-5" : "md:py-6",
      )}
    >
      <h2 className="font-serif text-2xl leading-tight md:text-[30px]">{title}</h2>
      <div className="prose-cv mt-4 max-w-none">
        {splitParagraphs(content).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function LockedContentTeaser({ text }: { text: string }) {
  return (
    <section className="rounded-[32px] border border-cv-gold/18 bg-gradient-to-b from-cv-panelAlt to-cv-panel px-6 py-7 md:px-8 md:py-8">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-cv-gold/25 bg-cv-gold/10 text-cv-gold">
          <Lock className="h-5 w-5" />
        </div>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-cv-gold/75">ce que vous n’avez pas encore vu</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight md:text-4xl">Le vrai nœud n’est pas encore révélé</h2>
          <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{text}</p>
          <div className="mt-5 space-y-2 text-sm leading-7 text-cv-faint">
            <p>
              La suite montre le verrou principal, la peur racine, le rapport à la légitimité, l’élan retenu et la direction de bascule la plus juste.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function UnlockingState() {
  return (
    <section className="rounded-[32px] border border-cv-gold/18 bg-gradient-to-b from-cv-panelAlt to-cv-panel px-6 py-7 md:px-8 md:py-8">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-cv-gold/25 bg-cv-gold/10 text-cv-gold">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-cv-gold/75">paiement confirmé</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight md:text-4xl">
            Nous préparons votre lecture complète
          </h2>
          <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">
            Votre paiement a bien été validé. Nous générons maintenant votre lecture complète.
            Cela peut prendre jusqu’à une minute. Ne fermez pas cette page.
          </p>
        </div>
      </div>
    </section>
  );
}

function OfferCards({
  onUnlock,
  unlocking,
  premiumUnlocked,
  error,
}: {
  onUnlock: () => void;
  unlocking: boolean;
  premiumUnlocked: boolean;
  error: string | null;
}) {
  return (
    <section className="gold-panel rounded-[32px] px-6 py-7 md:px-8 md:py-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <OfferCard
          title="Profil complet"
          price="7 €"
          description="Déverrouillez la lecture complète : le verrou principal, la peur racine, le schéma de protection plus profond, le rapport à la légitimité, l’élan retenu et une direction de bascule plus précise."
          buttonLabel={premiumUnlocked ? "Lecture complète déverrouillée" : "Accéder à la lecture complète"}
          onClick={premiumUnlocked ? undefined : onUnlock}
          loading={unlocking}
          disabled={premiumUnlocked}
        />

        <OfferCard
          title="Séance avec Philippe"
          price="97 €"
          description="1 h en visio pour décrypter votre profil ensemble, voir clair dans vos blocages, commencer à les traverser et clarifier votre prochain cap. L’analyse complète est incluse."
          buttonLabel="Réserver votre séance"
          href={reservationUrl}
          icon={<MessageCircleMore className="h-4 w-4" />}
          recommended
        />
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </section>
  );
}

function OfferCard({
  title,
  price,
  description,
  buttonLabel,
  onClick,
  loading,
  disabled,
  href,
  icon,
  recommended = false,
}: {
  title: string;
  price: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  recommended?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border px-5 py-5 md:px-6 md:py-6",
        recommended ? "border-cv-gold/28 bg-cv-panelAlt shadow-glow" : "border-cv-gold/14 bg-cv-panelAlt/70",
      )}
    >
      {recommended ? (
        <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full border border-cv-gold/30 bg-cv-bg px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cv-gold">
          recommandé
        </span>
      ) : null}

      <p className="font-serif text-2xl leading-tight">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-cv-gold">{price}</p>
      <p className="mt-4 text-sm leading-7 text-cv-muted">{description}</p>

      <div className="mt-6">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-cv-gold/20 bg-cv-gold/10 px-5 py-3 text-sm font-medium text-cv-text transition hover:border-cv-gold/35 hover:bg-cv-gold/14"
          >
            {icon}
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <button
            onClick={onClick}
            disabled={disabled || loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-cv-gold/20 bg-cv-gold/10 px-5 py-3 text-sm font-medium text-cv-text transition hover:border-cv-gold/35 hover:bg-cv-gold/14 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function PremiumArea({ premium }: { premium: NonNullable<FullAnalysisPayload["premium"]> }) {
  return (
    <section className="space-y-5">
      <section className="gold-panel rounded-[32px] px-6 py-7 md:px-8 md:py-8">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-cv-gold/25 bg-cv-gold/10 text-cv-gold">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cv-gold/75">lecture complète</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight md:text-4xl">
              Vous êtes allé au-delà du premier seuil
            </h2>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">
              Ce qui suit relie le blocage central, l’héritage invisible, le rapport à la valeur, l’élan retenu et le point de bascule. Là, on ne tourne plus autour. On va au nœud.
            </p>
          </div>
        </div>
      </section>

      <ResultSection title="Le verrou principal" content={premium.deepBlocks} />
      <ResultSection title="Ce que vous portez encore" content={premium.inheritedPatterns} />
      <ResultSection title="Le cycle qui vous rattrape" content={premium.currentCycles} />
      <ResultSection title="Valeur, légitimité, argent" content={premium.careerMoney} />
      <ResultSection title="Ce qui cherche à vivre davantage" content={premium.mutedVitalImpulse} />
      <ResultSection title="La vérité que vous ne pouvez plus contourner" content={premium.hardTruthExpanded} emphasis />
      <ResultSection title="Votre traversée concrète" content={premium.shiftPlan} />

      <section className="rounded-[28px] border border-cv-gold/16 bg-cv-panel px-6 py-6 md:px-7">
        <h2 className="font-serif text-2xl leading-tight md:text-[30px]">Questions de confrontation</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-cv-muted md:text-[15px]">
          {premium.journalQuestions.map((question, index) => (
            <p key={question}>
              <span className="mr-2 text-cv-gold">{index + 1}.</span>
              {question}
            </p>
          ))}
        </div>
      </section>
    </section>
  );
}

function ShareBlock({ copied, onCopyLink }: { copied: boolean; onCopyLink: () => void }) {
  const shareHref =
    typeof window !== "undefined"
      ? `mailto:?subject=${encodeURIComponent("Code Vivant")}&body=${encodeURIComponent(
          "Je pense que cette expérience pourrait vous parler : " + window.location.href,
        )}`
      : "mailto:?subject=Code%20Vivant";

  return (
    <section className="rounded-[28px] border border-cv-gold/12 bg-cv-panelAlt/70 px-6 py-6 md:px-7">
      <h2 className="font-serif text-2xl leading-tight md:text-[30px]">
        Vous avez pensé à quelqu’un en lisant ceci ?
      </h2>
      <p className="mt-3 text-sm leading-7 text-cv-muted">Partagez-lui cette expérience.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onCopyLink}
          className="inline-flex items-center gap-2 rounded-2xl border border-cv-gold/16 bg-cv-panel px-4 py-3 text-sm font-medium text-cv-text transition hover:border-cv-gold/30 hover:bg-cv-gold/8"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
        <a
          href={shareHref}
          className="inline-flex items-center gap-2 rounded-2xl border border-cv-gold/16 bg-cv-panel px-4 py-3 text-sm font-medium text-cv-text transition hover:border-cv-gold/30 hover:bg-cv-gold/8"
        >
          <Mail className="h-4 w-4" />
          Envoyer le lien
        </a>
      </div>
    </section>
  );
}

function FooterNote() {
  return (
    <p className="pb-4 text-center text-xs leading-6 text-cv-faint">
      Cette lecture est générée en temps réel. Elle n’a pas vocation à poser un diagnostic clinique. Elle éclaire un mécanisme intérieur pour vous aider à sortir du mode survie avec plus de clarté.
    </p>
  );
}

function StepActions({
  onBack,
  onNext,
  nextDisabled,
  backLabel = "Retour",
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  backLabel?: string;
}) {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SecondaryButton onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </SecondaryButton>
      <PrimaryButton onClick={onNext} disabled={nextDisabled}>
        Continuer
        <ArrowRight className="h-4 w-4" />
      </PrimaryButton>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cv-gold/25 bg-cv-gold/10 px-6 py-3 text-sm font-medium text-cv-text transition hover:border-cv-gold/40 hover:bg-cv-gold/14 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cv-gold/15 bg-transparent px-5 py-3 text-sm font-medium text-cv-muted transition hover:border-cv-gold/25 hover:text-cv-text"
    >
      {children}
    </button>
  );
}
