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

            {/* Purpose: why this product exists, stated plainly */}
            <div className="mt-10 border-t border-white/[0.06] pt-6">
              <p className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t('developer.purposeLabel')}
              </p>
              <p className="mt-3 max-w-md text-body text-ink-soft">
                {t('developer.purpose')}
              </p>
            </div>
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
                // `-my-2 py-2` keeps the visual rhythm while giving the control
                // a 36px hit area, so it clears the 24px minimum target size.
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="-my-2 inline-flex h-9 items-center gap-1.5 rounded-sm px-1 text-micro text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
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
