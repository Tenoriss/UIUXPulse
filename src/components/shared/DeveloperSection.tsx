import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { SectionLabel } from './Editorial';
import { brandIcons } from '@/components/brand/SocialIcons';
import { developers } from '@/config/developers';
import { useI18n } from '@/i18n';

/**
 * Developer credit section — the last band before the footer.
 *
 * Shows who built the product, how to reach them (with the real brand marks),
 * the stack, and the working principle. Kept deliberately quiet: no avatar
 * stock photos, no testimonial styling, just type and two clay profile cards.
 */
export function DeveloperSection({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <section aria-labelledby="developer-heading" className={cn('mt-24', className)}>
      <Container>
        <SectionLabel label={t('developer.eyebrow')} index="04" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ------------------------------------------------------- Narrative */}
          <div>
            <h2
              id="developer-heading"
              className="max-w-lg font-serif text-h1 text-ink"
            >
              {t('developer.title')}
            </h2>

            <p className="mt-6 max-w-md text-body text-ink-soft">{t('developer.lead')}</p>

            <dl className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  {t('developer.stackLabel')}
                </dt>
                <dd className="text-[0.8125rem] text-ink-soft sm:text-right">
                  {t('developer.stack')}
                </dd>
              </div>

              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  {t('developer.principleLabel')}
                </dt>
                <dd className="max-w-sm text-[0.8125rem] text-ink-soft sm:text-right">
                  {t('developer.principle')}
                </dd>
              </div>
            </dl>
          </div>

          {/* ------------------------------------------------------- Profiles */}
          <div className="flex flex-col gap-4">
            {developers.map((profile) => {
              const Icon = brandIcons[profile.id];

              return (
                <a
                  key={profile.id}
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="clay-surface group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-surface p-4 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-editorial)] hover:-translate-y-0.5 sm:p-5"
                >
                  <span className="clay-inset flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-surface-sunken text-ink">
                    <Icon className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      {t(profile.platformKey)}
                    </span>
                    <span className="mt-1 block truncate font-serif text-[1.25rem] leading-tight text-ink">
                      {profile.handle}
                    </span>
                    <span className="mt-0.5 block truncate text-micro text-ink-muted">
                      {t(profile.noteKey)}
                    </span>
                  </span>

                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage-deep"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{t('developer.visit')}</span>
                </a>
              );
            })}

            <div className="mt-2 flex items-center justify-between gap-4 px-1">
              <p className="text-micro text-ink-muted">{t('developer.madeWith')}</p>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-micro text-ink-muted transition-colors hover:text-ink"
              >
                {t('developer.backToTop')}
                <ArrowUp className="size-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
