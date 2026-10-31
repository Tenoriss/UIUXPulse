import { AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import type { ReportDocument, ReportSection } from '@/services/report.types';

/**
 * The report as a document.
 *
 * Deliberately styled as paper, not as app UI: a light sheet on the dark canvas,
 * serif headings, hairline rules. It mirrors the PDF's section order and
 * typographic hierarchy so the preview is an honest promise about the export,
 * and it is the only place in the product that uses a light surface.
 *
 * Long URLs and long findings are the two failure cases; both wrap rather than
 * truncate, because a report that hides a URL is a report that misreports.
 */
export function ReportDocumentView({ report }: { report: ReportDocument }) {
  const { t } = useI18n();
  const { meta, sections, disclaimer } = report;

  return (
    <article
      className={cn(
        'mx-auto w-full max-w-[52rem] overflow-hidden rounded-lg border shadow-clay',
        meta.isDemo ? 'border-clay/40 bg-[#fbf7f4]' : 'border-line bg-[#fcfbf7]',
      )}
    >
      {/* --------------------------------------------------------- Cover */}
      <header
        className={cn(
          'relative flex flex-col gap-6 px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10',
          meta.isDemo ? 'bg-[#f5ece7]' : 'bg-[#f4f2ea]',
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#6f7f66]">
              UIUXPulse
            </p>
            <p className="mt-1 text-[0.6875rem] text-[#7a776e]">
              Editorial-grade UI/UX evaluation
            </p>
          </div>

          {meta.isDemo && (
            <span className="rounded-pill bg-[#8a4b3a] px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white">
              {t('results.demoLabel')}
            </span>
          )}
        </div>

        <div>
          <h1 className="font-serif text-[1.75rem] leading-[1.15] text-[#1a1a18] sm:text-[2.25rem]">
            {meta.title}
          </h1>
          <div className="mt-5 h-px w-16 bg-[#6f7f66]" />
        </div>

        <div className="min-w-0">
          <p className="font-serif text-[1.375rem] leading-tight text-[#1a1a18] sm:text-[1.625rem]">
            {meta.websiteName}
          </p>
          <p className="mt-1 break-all font-sans text-[0.8125rem] leading-relaxed text-[#4a4a44]">
            {meta.websiteUrl}
          </p>
        </div>

        <dl className="grid gap-4 border-t border-[#d8d5cb] pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-[#7a776e]">
              {t('report.type.label')}
            </dt>
            <dd
              className={cn(
                'mt-1 text-[0.8125rem] font-semibold',
                meta.isDemo ? 'text-[#8a4b3a]' : 'text-[#1a1a18]',
              )}
            >
              {meta.typeLabel}
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-[#7a776e]">
              {t('report.field.generatedAt')}
            </dt>
            <dd className="mt-1 text-[0.8125rem] font-semibold text-[#1a1a18]">
              {meta.generatedAt.slice(0, 10)}
            </dd>
          </div>
        </dl>

        {meta.isDemo && (
          <p className="rounded-md border border-[#c98a76]/50 bg-white/60 px-3 py-2 text-[0.75rem] text-[#8a4b3a]">
            {t('report.preview.demoRibbon')}
          </p>
        )}
      </header>

      {/* ------------------------------------------------------ Sections */}
      <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10">
        {sections.map((section, index) => (
          <section key={section.id} aria-labelledby={`report-${section.id}`}>
            <div className="mb-3 flex items-baseline gap-3">
              <span className="tabular-nums text-[0.6875rem] text-[#a39f93]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2
                id={`report-${section.id}`}
                className="font-serif text-[1.125rem] text-[#1a1a18] sm:text-[1.25rem]"
              >
                {section.heading}
              </h2>
            </div>
            <div className="h-px w-full bg-[#6f7f66]/40" />
            <div className="mt-4">
              <SectionBody section={section} />
            </div>
          </section>
        ))}

        {/* -------------------------------------------------- Disclaimer */}
        <section aria-labelledby="report-disclaimer">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="tabular-nums text-[0.6875rem] text-[#a39f93]">
              {String(sections.length + 1).padStart(2, '0')}
            </span>
            <h2 id="report-disclaimer" className="font-serif text-[1.125rem] text-[#1a1a18]">
              {t('report.section.notice')}
            </h2>
          </div>
          <div
            className={cn(
              'rounded-md border-l-[3px] px-4 py-3 text-[0.8125rem] leading-relaxed',
              meta.isDemo
                ? 'border-[#8a4b3a] bg-[#f5ece7] text-[#3a3632]'
                : 'border-[#6f7f66] bg-[#eef1ea] text-[#3a3632]',
            )}
          >
            {disclaimer}
          </div>
        </section>
      </div>
    </article>
  );
}

function SectionBody({ section }: { section: ReportSection }) {
  switch (section.kind) {
    case 'facts':
      return (
        <dl className="flex flex-col divide-y divide-[#e6e3d9]">
          {section.items.map((item, index) => (
            <div
              key={`${section.id}-${index}`}
              className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="w-full shrink-0 text-[0.6875rem] uppercase tracking-[0.1em] text-[#7a776e] sm:w-48">
                {item.label}
              </dt>
              <dd className="min-w-0 break-all text-[0.8125rem] text-[#1a1a18] sm:flex-1">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'groups':
      return (
        <div className="flex flex-col gap-5">
          {section.groups.map((group) => (
            <div key={group.label}>
              <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-[#7a776e]">
                {group.label}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {group.items.map((item, index) => (
                  <li
                    key={`${group.label}-${index}`}
                    className="flex min-w-0 gap-2 text-[0.8125rem] leading-relaxed text-[#1a1a18]"
                  >
                    <span className="text-[#6f7f66]" aria-hidden="true">
                      —
                    </span>
                    <span className="break-all">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'callout':
      return (
        <p className="rounded-md border-l-[3px] border-[#6f7f66] bg-[#eef1ea] px-4 py-3 text-[0.8125rem] leading-relaxed text-[#3a3632]">
          {section.body}
        </p>
      );

    case 'score':
      return (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-full border-[6px] border-[#6f7f66]">
              <span className="font-serif text-[1.75rem] leading-none text-[#1a1a18]">
                {section.score}
              </span>
              <span className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.1em] text-[#7a776e]">
                / 100
              </span>
            </div>
            <p className="min-w-0 max-w-md text-[0.8125rem] leading-relaxed text-[#4a4a44]">
              {section.explanation}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-[#e6e3d9] bg-[#e6e3d9] sm:grid-cols-4">
            {section.priorities.map((item) => (
              <div key={item.label} className="bg-[#fcfbf7] px-3 py-2.5">
                <p className="text-[0.625rem] uppercase tracking-[0.1em] text-[#7a776e]">
                  {item.label}
                </p>
                <p className="mt-1 font-serif text-[1.125rem] leading-none tabular-nums text-[#1a1a18]">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'table':
      return (
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-y border-[#e6e3d9] bg-[#f4f2ea]">
              {section.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    'px-3 py-2 text-[0.625rem] uppercase tracking-[0.1em] text-[#7a776e]',
                    index === 0 ? 'font-medium' : 'w-16 text-right font-medium',
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6e3d9]">
            {section.rows.map((row, rowIndex) => (
              <tr key={`${section.id}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={cn(
                      'px-3 py-2 align-top text-[0.8125rem]',
                      cellIndex === 0
                        ? 'break-words text-[#1a1a18]'
                        : 'text-right font-serif tabular-nums text-[#1a1a18]',
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'findings':
      return (
        <ol className="flex flex-col divide-y divide-[#e6e3d9]">
          {section.items.map((item, index) => (
            <li key={`finding-${index}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <span className="shrink-0 tabular-nums text-[0.6875rem] text-[#a39f93]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[0.9375rem] leading-snug text-[#1a1a18]">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.6875rem] text-[#6f7f66]">
                  {item.category} · {item.priority} · {item.assessment}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[#4a4a44]">
                  {item.description}
                </p>
                <p className="mt-1.5 break-all font-mono text-[0.6875rem] text-[#8a8679]">
                  {item.page} — {item.viewport}
                </p>
                <p className="mt-2 text-[0.8125rem] italic leading-relaxed text-[#4a4a44]">
                  {item.whyItMatters}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case 'recommendations':
      return (
        <ol className="flex flex-col divide-y divide-[#e6e3d9]">
          {section.items.map((item, index) => (
            <li key={`rec-${index}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <span className="shrink-0 tabular-nums text-[0.6875rem] text-[#a39f93]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[0.9375rem] leading-snug text-[#1a1a18]">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.6875rem] text-[#6f7f66]">
                  {item.priority} · {item.category}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[#4a4a44]">
                  {item.explanation}
                </p>
                <p className="mt-2 text-[0.75rem] italic text-[#6f7f66]">
                  {item.relatedFinding}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[#4a4a44]">
                  <span className="font-medium text-[#1a1a18]">
                    {`Improved: `}
                  </span>
                  {item.improvement}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#4a4a44]">
                  <span className="font-medium text-[#1a1a18]">{`Benefit: `}</span>
                  {item.benefit}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

/** Inline placeholder used when a report cannot be produced. */
export function ReportUnavailable({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface/70 px-6 py-12 text-center">
      <AlertTriangle className="size-5 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
      <h2 className="font-serif text-h3 text-ink">{title}</h2>
      <p className="max-w-sm text-body text-ink-soft">{body}</p>
      <FileText className="size-4 text-ink-faint" aria-hidden="true" />
    </div>
  );
}
