import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

export interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  meta?: string;
  className?: string;
}

/**
 * Editorial page opener shared by every inner public page: eyebrow, split
 * headline, and a single paragraph at a deliberately narrow measure.
 */
export function PageIntro({ eyebrow, title, description, meta, className }: PageIntroProps) {
  return (
    <Container className={cn('pt-16 pb-12 sm:pt-24 sm:pb-16', className)}>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="eyebrow">{eyebrow}</p>
        {meta && <span className="text-micro tabular-nums text-ink-faint">{meta}</span>}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
        <h1 className="font-serif text-h1 text-ink">{title}</h1>
        {description && (
          <p className="max-w-md text-lead text-ink-soft lg:pb-2">{description}</p>
        )}
      </div>
    </Container>
  );
}

/** Call-to-action band reused at the bottom of public pages. */
export function CtaBand({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <Container className={cn('mt-24', className)}>
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-muted/70 px-6 py-14 sm:px-14">
        <div
          className="absolute -right-16 -top-24 size-72 rounded-full bg-sage-wash/80 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <h2 className="font-serif text-h2 text-ink">{title}</h2>
            <p className="mt-4 text-body text-ink-soft">{description}</p>
          </div>
          <Link
            to={routes.signUp}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-medium text-canvas transition-colors hover:bg-ink-soft lg:self-auto"
          >
            {t('home.ctaButton')}
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Container>
  );
}
