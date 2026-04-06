'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn('min-h-screen px-4 py-6 md:px-6 md:py-8', className)}>{children}</main>;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-5xl', className)}>{children}</div>;
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={cn('mb-5 flex items-center justify-between', compact ? 'md:mb-6' : 'md:mb-8')}>
      <div>
        <p className="font-serif text-sm tracking-[0.28em] text-cv-gold md:text-base">CODE VIVANT</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-cv-faint md:text-xs">par Philippe Malbrunot</p>
      </div>
    </header>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('gold-panel rounded-[28px] px-5 py-6 md:px-8 md:py-8', className)}>{children}</section>;
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.26em] text-cv-gold/85">{children}</p>;
}

export function BadgeRow({ items }: { items: string[] }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2.5 md:mt-8">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-cv-gold/15 bg-cv-panelAlt px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-cv-faint md:text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cv-gold/30 bg-cv-gold/10 px-5 py-3 text-sm font-medium text-cv-text transition hover:bg-cv-gold/15 disabled:cursor-not-allowed disabled:opacity-50 md:px-6',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cv-line bg-transparent px-5 py-3 text-sm font-medium text-cv-muted transition hover:border-cv-gold/22 hover:text-cv-text disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function AnchorButton({ children, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cv-line bg-transparent px-5 py-3 text-sm font-medium text-cv-muted transition hover:border-cv-gold/22 hover:text-cv-text',
        className,
      )}
    >
      {children}
    </a>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mb-6 h-1 overflow-hidden rounded-full bg-cv-goldSoft md:mb-8">
      <div className="h-full rounded-full bg-cv-gold transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl')}>
      {eyebrow ? <Label>{eyebrow}</Label> : null}
      <h2 className="mt-3 font-serif text-3xl leading-tight text-cv-text md:text-5xl">{title}</h2>
      {body ? <p className="mt-4 text-sm leading-7 text-cv-muted md:text-base md:leading-8">{body}</p> : null}
    </div>
  );
}

export function MiniNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-xs leading-6 text-cv-faint md:text-sm">{children}</p>;
}
