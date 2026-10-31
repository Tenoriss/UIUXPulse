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
        {meta && (
          <span className="text-micro tabular-nums tracking-[0.04em] text-ink-faint">
            ({meta})
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
        <h1 className="font-serif text-display text-ink">{title}</h1>
        {description && (
          <p className="max-w-md text-lead text-ink-soft lg:pb-2">{description}</p>
        )}
      </div>
    </Container>
  );
}

/**
 * Closing band for public pages: hairline rule, large serif line, single
 * action. Matches the editorial rhythm of the home page instead of a boxed
 * marketing card.
 */
export function ClosingCta({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <Container className={cn('mt-24', className)}>
      <div className="border-t border-line pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="max-w-xl font-serif text-h1 text-ink">{title}</h2>
            {description && (
              <p className="mt-4 max-w-md text-body text-ink-soft">{description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 lg:justify-self-end lg:pb-2">
            <Link
              to={routes.signUp}
              className="group inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-medium text-canvas transition-colors hover:bg-ink-soft"
            >
              {t('home.ctaButton')}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to={routes.methodology}
              className="text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              {t('home.ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
