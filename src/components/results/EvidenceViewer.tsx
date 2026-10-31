import { ImageOff, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import type { FindingEvidence } from '@/services/evaluation-results.types';
import type { EvaluationViewportId } from '@/services/workspace.types';

const viewportIcons: Record<EvaluationViewportId, LucideIcon> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export interface EvidenceViewerProps {
  evidence: FindingEvidence;
  page: string;
  viewport?: EvaluationViewportId;
  description?: string;
  className?: string;
}

/**
 * Evidence viewer.
 *
 * The only variant any current data produces is `none`, which renders an honest
 * placeholder stating that captures arrive with the analysis engine. The
 * `screenshot` variant is wired up — bounded width, lazy loading, real alt text
 * — so an engine can supply captures without touching this component.
 *
 * It never falls back to stock imagery: a screenshot region that is not a
 * capture of the evaluated page would be fabricated evidence.
 */
export function EvidenceViewer({
  evidence,
  page,
  viewport,
  description,
  className,
}: EvidenceViewerProps) {
  const { t } = useI18n();
  const Icon = viewport ? viewportIcons[viewport] : Monitor;
  const viewportLabel = viewport
    ? t(`evaluation.viewports.${viewport}`)
    : t('results.audit.finding.allViewports');

  return (
    <figure
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface-muted/40',
        className,
      )}
    >
      {evidence.kind === 'screenshot' ? (
        <img
          src={evidence.src}
          alt={evidence.alt}
          width={evidence.width}
          height={evidence.height}
          loading="lazy"
          className="block h-auto w-full border-b border-line object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-surface-muted/50 px-4 text-center">
          <ImageOff className="size-5 text-ink-faint" strokeWidth={1.4} aria-hidden="true" />
          <p className="max-w-[22rem] text-micro text-ink-muted">
            {t('results.evidence.emptyTitle')}
          </p>
        </div>
      )}

      <figcaption className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon className="size-3 shrink-0" aria-hidden="true" />
            {viewportLabel}
          </span>
          <span className="min-w-0 max-w-full truncate font-mono text-[0.6875rem] text-ink-faint">
            {page}
          </span>
        </div>

        {description && <p className="text-micro text-ink-soft">{description}</p>}

        {evidence.kind === 'none' && (
          <p className="text-micro text-ink-faint">{t('results.evidence.emptyBody')}</p>
        )}
      </figcaption>
    </figure>
  );
}
