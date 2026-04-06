'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Copy, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRAND, STATIC_COPY } from '@/lib/content';
import { FREE_STORAGE_KEY } from '@/lib/storage';
import type { FullAnalysisPayload, QuizAnswers } from '@/lib/types';
import { splitParagraphs } from '@/lib/utils';
import { AnchorButton, BrandHeader, Container, Label, Panel, PrimaryButton, SecondaryButton, Shell } from './ui';

const reservationUrl = 'https://koalendar.com/e/echange-avec-philippe-malbrunot';

export function FreeResultPage() {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisPayload | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setShareUrl(window.location.href);
    const raw = window.localStorage.getItem(FREE_STORAGE_KEY);
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
  }, [router]);

  const introText = useMemo(() => {
    if (!analysis?.free || !answers) return '';
    return analysis.free.subtitle;
  }, [analysis, answers]);

  async function handleCheckout() {
    if (!answers) return;
    try {
      setUnlocking(true);
      setError(null);
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Paiement indisponible pour le moment.');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setUnlocking(false);
    }
  }

  async function handleCopy() {
    if (typeof window === 'undefined') return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (!analysis || !answers) {
    return (
      <Shell>
        <Container>
          <BrandHeader compact />
          <Panel>
            <p className="text-sm text-cv-muted">Chargement de votre aperçu…</p>
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
            <Label>APERÇU GRATUIT</Label>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{STATIC_COPY.freeHeroTitle}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-cv-muted">{introText}</p>
          </Panel>

          <InsightSection title="Votre mode de protection principal" text={analysis.free.survivalMode} />
          <InsightSection title="Votre angle mort émotionnel" text={analysis.free.blindSpot} />
          <InsightSection title="Héritage" text={analysis.free.generationalPattern} />
          <InsightSection title="Valeur et légitimité" text={analysis.free.moneyBlock} />
          <InsightSection title="La vérité à entendre maintenant" text={analysis.free.hardTruth} accent />
          <InsightSection title="Votre première bascule" text={analysis.free.weekShift} />

          <Panel className="px-6 py-7 md:px-8 md:py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cv-gold/20 bg-cv-panelAlt text-cv-gold">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <Label>{STATIC_COPY.lockedLabel}</Label>
              </div>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">{STATIC_COPY.lockedTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.lockedBody1}</p>
            <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{STATIC_COPY.lockedBody2}</p>
            <p className="mt-6 text-sm leading-7 text-cv-faint md:text-base">{STATIC_COPY.lockedLine}</p>
          </Panel>

          <div className="grid gap-4 md:grid-cols-[1.2fr_.95fr]">
            <OfferCard
              title={STATIC_COPY.freeOfferTitle}
              price={STATIC_COPY.freeOfferPrice}
              text={STATIC_COPY.freeOfferBody}
              cta={STATIC_COPY.freeOfferCta}
              onClick={handleCheckout}
              loading={unlocking}
              primary
            />
            <OfferCard
              title={STATIC_COPY.sessionTitle}
              price={STATIC_COPY.sessionPrice}
              text={`${STATIC_COPY.sessionShort} ${STATIC_COPY.sessionMicro}`}
              cta={STATIC_COPY.sessionCta}
              href={reservationUrl}
              badge="RECOMMANDÉ"
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
          ) : null}

          <Panel className="px-6 py-7 md:px-8 md:py-8">
            <h3 className="font-serif text-3xl leading-tight md:text-4xl">{STATIC_COPY.shareTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-cv-muted md:text-base">{STATIC_COPY.shareBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <SecondaryButton onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                {copied ? 'Lien copié' : STATIC_COPY.shareCopy}
              </SecondaryButton>
              <AnchorButton href={`mailto:?subject=${encodeURIComponent('Code Vivant')}&body=${encodeURIComponent(shareUrl)}`}>
                <Mail className="h-4 w-4" />
                {STATIC_COPY.shareSend}
              </AnchorButton>
            </div>
          </Panel>

          <p className="px-2 text-center text-xs leading-6 text-cv-faint md:text-sm">
            Cette lecture est générée en temps réel. Elle n’a pas vocation à poser un diagnostic clinique. Elle éclaire un mécanisme intérieur pour vous aider à sortir du mode survie avec plus de clarté.
          </p>
        </div>
      </Container>
    </Shell>
  );
}

function InsightSection({ title, text, accent = false }: { title: string; text: string; accent?: boolean }) {
  return (
    <Panel className={accent ? 'border-cv-gold/26' : ''}>
      <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
      <div className="mt-5 space-y-4">
        {splitParagraphs(text).map((paragraph, index) => (
          <p key={index} className="text-sm leading-7 text-cv-muted md:text-base md:leading-8">
            {paragraph}
          </p>
        ))}
      </div>
    </Panel>
  );
}

function OfferCard({ title, price, text, cta, onClick, href, loading = false, primary = false, badge }: { title: string; price: string; text: string; cta: string; onClick?: () => void; href?: string; loading?: boolean; primary?: boolean; badge?: string }) {
  return (
    <Panel className={primary ? 'relative overflow-hidden' : 'relative'}>
      {badge ? <span className="absolute right-5 top-4 rounded-full border border-cv-gold/22 bg-cv-panel px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cv-gold">{badge}</span> : null}
      <h3 className="font-serif text-3xl leading-tight">{title}</h3>
      <p className="mt-3 text-5xl font-semibold text-cv-gold">{price}</p>
      <p className="mt-5 text-sm leading-8 text-cv-muted md:text-base">{text}</p>
      <div className="mt-8">
        {href ? (
          <AnchorButton href={href} target="_blank" rel="noreferrer" className="w-full justify-center md:w-auto">
            {cta}
            <ArrowRight className="h-4 w-4" />
          </AnchorButton>
        ) : (
          <PrimaryButton onClick={onClick} disabled={loading} className="w-full justify-center md:w-auto">
            {loading ? 'Ouverture du paiement…' : cta}
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        )}
      </div>
    </Panel>
  );
}
