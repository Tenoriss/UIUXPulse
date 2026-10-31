import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCheck, ShieldAlert } from 'lucide-react';
import { Button, Card, EmptyState, LinkButton } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { EvaluationSummary } from '@/components/evaluations/EvaluationSummary';
import { PagesStep } from '@/components/evaluations/PagesStep';
import { ProgressPanel, PROGRESS_STEPS } from '@/components/evaluations/ProgressPanel';
import { ReviewStep } from '@/components/evaluations/ReviewStep';
import { SettingsStep } from '@/components/evaluations/SettingsStep';
import { WebsiteStep } from '@/components/evaluations/WebsiteStep';
import { WizardSteps, type WizardStep } from '@/components/evaluations/WizardSteps';
import { routes } from '@/config/site';
import { useEvaluationDraft } from '@/hooks/useEvaluationDraft';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/types';
import { useAuth } from '@/services/auth.context';
import { MAX_PAGES } from '@/services/evaluation.constants';
import { createEvaluation, type EvaluationSaveInput } from '@/services/evaluation.service';
import type { EvaluationErrorCode } from '@/services/evaluation.types';
import { listWebsites } from '@/services/website.service';
import type { EvaluationRecord } from '@/services/workspace.types';

/** Simulated save timing, per demonstration step. Nothing is fetched. */
const STEP_MS = 520;

type Phase = 'configure' | 'saving' | 'created';

/**
 * Service error code → dictionary key.
 *
 * The two codes the wizard cannot hit through its own validation (`forbidden`,
 * `unknown`) fold into the generic message rather than inventing a key.
 */
function errorKeyFor(code: EvaluationErrorCode): TranslationKey {
  return (
    code === 'unknown' || code === 'forbidden'
      ? 'evaluation.errors.unknown'
      : (`evaluation.errors.${code}` as TranslationKey)
  );
}

/**
 * Evaluation wizard.
 *
 * Four configuration steps, then a simulated save, then an honest result. The
 * record is written exactly once, at the end — an abandoned wizard leaves no
 * trace in the store, so the evaluation list and the dashboard totals only ever
 * count saved configurations.
 */
export function EvaluationWizardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const websites = useMemo(() => listWebsites(user?.id), [user?.id]);
  // A deep link from a website page (`?website=site_x`) preselects that site.
  const initialWebsiteId = params.get('website') ?? '';
  const { draft, setWebsite, setPages, toggleCategory, setCategories, toggleViewport } =
    useEvaluationDraft(initialWebsiteId);

  const [step, setStep] = useState<WizardStep>('website');
  const [phase, setPhase] = useState<Phase>('configure');
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<{
    website?: string | null;
    pages?: string | null;
    categories?: string | null;
    viewports?: string | null;
    form?: string | null;
  }>({});
  const [created, setCreated] = useState<EvaluationRecord | null>(null);
  const timers = useRef<number[]>([]);

  const website = websites.find((item) => item.id === draft.websiteId) ?? null;

  // Clear any in-flight progress timers if the page unmounts mid-save.
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  /** Drop the preselected site if it is not actually one of this account's. */
  useEffect(() => {
    if (draft.websiteId && !website) {
      setErrors((current) => ({ ...current, website: t('evaluation.website.missing') }));
    }
  }, [draft.websiteId, website, t]);

  const goTo = useCallback((next: WizardStep) => {
    setStep(next);
    setErrors({});
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }, []);

  const validateStep = (target: WizardStep): boolean => {
    if (target === 'website') {
      if (!draft.websiteId || !website) {
        setErrors({ website: t('evaluation.website.required') });
        return false;
      }
    }
    if (target === 'pages' && draft.pages.length === 0) {
      setErrors({ pages: t('evaluation.pages.required') });
      return false;
    }
    if (target === 'settings') {
      const next: typeof errors = {};
      if (draft.categories.length === 0) next.categories = t('evaluation.categories.required');
      if (draft.viewports.length === 0) next.viewports = t('evaluation.viewports.required');
      if (next.categories || next.viewports) {
        setErrors(next);
        return false;
      }
    }
    return true;
  };

  const onNext = () => {
    if (!validateStep(step)) return;
    if (step === 'website') return goTo('pages');
    if (step === 'pages') return goTo('settings');
    if (step === 'settings') return goTo('review');
  };

  const onBack = () => {
    if (step === 'pages') return goTo('website');
    if (step === 'settings') return goTo('pages');
    if (step === 'review') return goTo('settings');
  };

  /**
   * Save. The progress rail is decoration over a single write: `createEvaluation`
   * is awaited once, and the steps advance on timers purely so the state change
   * is legible. If the write fails, the rail stops and the error is shown.
   */
  const onSubmit = async () => {
    if (!validateStep('website') || !validateStep('pages') || !validateStep('settings')) {
      setErrors((current) => ({ ...current, form: t('evaluation.errors.unknown') }));
      return;
    }

    setPhase('saving');
    setProgress(0);
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    PROGRESS_STEPS.forEach((_, index) => {
      timers.current.push(
        window.setTimeout(() => setProgress(index + 1), STEP_MS * (index + 1)),
      );
    });

    const payload: EvaluationSaveInput = {
      websiteId: draft.websiteId,
      pages: draft.pages,
      categories: draft.categories,
      viewports: draft.viewports,
    };

    const [result] = await Promise.all([
      createEvaluation(user?.id, payload),
      new Promise<void>((resolve) => {
        timers.current.push(window.setTimeout(resolve, STEP_MS * (PROGRESS_STEPS.length + 1)));
      }),
    ]);

    if (!result.ok) {
      timers.current.forEach((id) => window.clearTimeout(id));
      setPhase('configure');
      setErrors({ form: t(errorKeyFor(result.code), { max: String(MAX_PAGES) }) });
      return;
    }

    setProgress(PROGRESS_STEPS.length);
    setCreated(result.data);
    setPhase('created');
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  // ------------------------------------------------------------ Created
  if (phase === 'created' && created) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4 border-b border-line pb-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-sage/45 bg-sage-wash text-sage-ink">
            <CheckCheck className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow mb-2">{t('evaluation.flowLabel')}</p>
            <h1 className="font-serif text-h2 text-ink">{t('evaluation.created.title')}</h1>
            <p className="mt-2 max-w-xl text-body text-ink-soft">{t('evaluation.created.lead')}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md border border-line bg-surface-muted/40 px-4 py-3">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
          <p className="text-micro text-ink-muted">{t('evaluation.created.body')}</p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-h4 text-ink">{t('evaluation.created.summaryLabel')}</h2>
          <EvaluationSummary record={created} />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton to={`${routes.evaluations}/${created.id}`} tone="dark">
            {t('evaluation.created.viewEvaluation')}
          </LinkButton>
          <LinkButton to={routes.evaluations} tone="neutral">
            {t('evaluation.created.viewEvaluations')}
          </LinkButton>
          <LinkButton to={routes.dashboard} tone="ghost">
            {t('evaluation.created.backToDashboard')}
          </LinkButton>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- Saving
  if (phase === 'saving') {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow={t('evaluation.eyebrow')}
          title={t('evaluation.flowLabel')}
          description={t('evaluation.wizardLead')}
        />
        <Card padding="lg" className="max-w-2xl">
          <ProgressPanel current={progress} />
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------------- Configure
  return (
    <div className="flex flex-col gap-8">
      <Link
        to={routes.evaluations}
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('evaluation.detail.back')}
      </Link>

      <PageHeader
        eyebrow={t('evaluation.eyebrow')}
        title={t('evaluation.flowLabel')}
        description={t('evaluation.wizardLead')}
      />

      <WizardSteps current={step} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
        <Card padding="lg" className="min-w-0">
          {step === 'website' && (
            <WebsiteStep
              websites={websites}
              selectedId={draft.websiteId}
              onSelect={(id) => {
                setWebsite(id);
                setErrors({});
              }}
              error={errors.website}
            />
          )}

          {step === 'pages' &&
            (website ? (
              <PagesStep
                website={website}
                pages={draft.pages}
                onChange={(pages) => {
                  setPages(pages);
                  setErrors((current) => ({ ...current, pages: null }));
                }}
                error={errors.pages}
              />
            ) : (
              <EmptyState
                title={t('evaluation.website.missing')}
                description={t('evaluation.website.missingBody')}
                action={
                  <Button size="sm" tone="neutral" onClick={() => goTo('website')}>
                    {t('evaluation.actions.back')}
                  </Button>
                }
              />
            ))}

          {step === 'settings' && (
            <SettingsStep
              categories={draft.categories}
              viewports={draft.viewports}
              onToggleCategory={toggleCategory}
              onSetCategories={setCategories}
              onToggleViewport={toggleViewport}
              categoryError={errors.categories}
              viewportError={errors.viewports}
            />
          )}

          {step === 'review' && (
            <ReviewStep
              website={website}
              pages={draft.pages}
              categories={draft.categories}
              viewports={draft.viewports}
              onEditStep={goTo}
            />
          )}
        </Card>

        {/* ------------------------------------------------------ Aside */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card variant="muted" padding="md">
            <p className="eyebrow mb-3">{t('evaluation.flowLabel')}</p>
            <dl className="flex flex-col gap-2.5 text-[0.8125rem]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('evaluation.steps.website')}</dt>
                <dd className="min-w-0 truncate text-right text-ink-soft">
                  {website?.name ?? '—'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('evaluation.steps.pages')}</dt>
                <dd className="tabular-nums text-ink-soft">
                  {draft.pages.length}/{MAX_PAGES}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('evaluation.categories.title')}</dt>
                <dd className="tabular-nums text-ink-soft">{draft.categories.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('evaluation.viewports.title')}</dt>
                <dd className="tabular-nums text-ink-soft">{draft.viewports.length}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-line pt-3 text-micro text-ink-muted">
              {t('evaluation.demoNotice')}
            </p>
          </Card>
        </aside>
      </div>

      {errors.form && (
        <p role="alert" className="rounded-md border border-clay/40 bg-clay-soft px-4 py-3 text-[0.8125rem] text-clay-ink">
          {errors.form}
        </p>
      )}

      {/* ------------------------------------------------------ Navigation */}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {step !== 'website' && (
            <Button
              type="button"
              tone="ghost"
              onClick={onBack}
              leadingIcon={<ArrowLeft className="size-3.5" aria-hidden="true" />}
            >
              {t('evaluation.actions.back')}
            </Button>
          )}
          <Button
            type="button"
            tone="ghost"
            onClick={() => navigate(routes.evaluations)}
          >
            {t('evaluation.actions.cancel')}
          </Button>
        </div>

        {step === 'review' ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-micro text-ink-muted sm:max-w-xs sm:text-right">
              {t('evaluation.review.notice')}
            </p>
            <Button type="button" tone="dark" onClick={onSubmit}>
              {t('evaluation.actions.submit')}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            tone="dark"
            onClick={onNext}
            trailingIcon={<ArrowRight className="size-3.5" aria-hidden="true" />}
          >
            {step === 'settings' ? t('evaluation.actions.review') : t('evaluation.actions.next')}
          </Button>
        )}
      </div>
    </div>
  );
}
