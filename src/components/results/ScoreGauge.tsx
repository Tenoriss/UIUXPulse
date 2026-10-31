import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';

export interface ScoreGaugeProps {
  /** 0–100. `null` renders the honest "not scored" state. */
  score: number | null;
  label?: string;
  /** Renders the DEMO chip beside the band label. */
  isDemo?: boolean;
  describe?: string;
}

/**
 * Score band.
 *
 * Three bands, not five: fewer thresholds are easier to justify out loud, and
 * the copy for each is a plain statement rather than a judgement of the team.
 */
function bandOf(score: number): 'strong' | 'fair' | 'weak' {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'fair';
  return 'weak';
}

/**
 * Overall score.
 *
 * Built from a single SVG ring so it scales cleanly from 390px to 1440px
 * without a fixed pixel width, plus a text readout that carries the number for
 * anyone who cannot read the arc. When `score` is null nothing is drawn — the
 * component never invents a zero.
 */
export function ScoreGauge({ score, label, isDemo = false, describe }: ScoreGaugeProps) {
  const { t } = useI18n();
  const heading = label ?? t('results.score.label');

  if (score === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="eyebrow">{heading}</p>
        <p className="font-serif text-h2 text-ink-faint">{t('results.score.pending')}</p>
        <p className="max-w-xs text-micro text-ink-muted">{t('results.score.pendingBody')}</p>
      </div>
    );
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const band = bandOf(clamped);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const filled = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className="relative size-[8.5rem] shrink-0">
        <svg
          viewBox="0 0 128 128"
          className="size-full -rotate-90"
          role="img"
          aria-label={t('results.categories.scoreLabel', { name: heading })}
        >
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="9"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--color-sage-deep)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[2.25rem] leading-none tabular-nums text-ink">
            {clamped}
          </span>
          <span className="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">
            {t('results.score.outOf')}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{heading}</p>
          {isDemo && (
            <span className="rounded-pill border border-ochre/40 bg-ochre-soft px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.12em] text-ochre-ink">
              {t('results.demoLabel')}
            </span>
          )}
        </div>

        <p
          className={cn(
            'mt-1.5 font-serif text-h3',
            band === 'strong' ? 'text-sage-ink' : band === 'fair' ? 'text-ink' : 'text-clay-ink',
          )}
        >
          {t(`results.score.band.${band}`)}
        </p>

        <p className="mt-2 max-w-sm text-micro text-ink-muted">
          {describe ?? t('results.score.explain')}
        </p>
      </div>
    </div>
  );
}
