import { useMemo, useState } from 'react';
import { Info, PenLine, StickyNote, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Input,
  Modal,
} from '@/components/ui';
import type { CriterionKey } from '@/content/criteria';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { listCriteria } from '@/services/admin.service';
import {
  CRITERION_NOTE_LIMITS,
  clearCriterionNote,
  readCriterionNotes,
  saveCriterionNote,
} from '@/services/admin.criteria';
import type { AdminCriterionRow } from '@/services/admin.types';

/**
 * Criteria management.
 *
 * The six definitions are read from `content/criteria.ts` and shown here in
 * both languages. They are **not edited from this page**: that file is the
 * published source the public criteria page and the evaluator both read, and
 * letting a form rewrite it would mean one screen could silently change the
 * product's published definitions.
 *
 * What *is* editable is a note, stored under `uiuxpulse.admin.criteriaNotes`
 * and shown beside the definition, labelled as an admin note. Nothing here
 * weights, ranks, or scores a category — there is no scoring engine to change.
 */
export function AdminCriteriaPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState<AdminCriterionRow | null>(null);
  const [removing, setRemoving] = useState<AdminCriterionRow | null>(null);

  // Re-read after every save or removal, so no row can hold stale copy.
  const rows = useMemo(() => listCriteria(), [revision]);
  const notes = useMemo(() => readCriterionNotes(), [revision]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.criteria.title')}
        description={t('admin.criteria.lead')}
        actions={<Badge tone="neutral">{rows.length}</Badge>}
      />

      <div className="flex items-start gap-2 rounded-md border border-line bg-surface-muted/50 px-3 py-2.5 text-[0.75rem] leading-relaxed text-ink-muted">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>{t('admin.criteria.sourceNote')}</span>
      </div>

      <ul className="flex flex-col gap-4">
        {rows.map((row) => {
          const note = notes[row.id as CriterionKey];
          return (
            <li key={row.id}>
              <Card padding="lg">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{row.name.en}</CardTitle>
                    <Badge tone="neutral">{row.name.id}</Badge>
                    <Badge tone={row.available ? 'sage' : 'neutral'} dot>
                      {row.available ? t('admin.criteria.available') : t('admin.overview.notAvailable')}
                    </Badge>
                    {row.annotated && (
                      <Badge tone="ochre">
                        <StickyNote className="size-3" aria-hidden="true" />
                        {t('admin.criteria.annotated')}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{row.summary.en}</CardDescription>
                </CardHeader>

                <dl className="mt-5 grid gap-4 border-t border-line pt-4 md:grid-cols-2">
                  <div className="min-w-0">
                    <dt className="eyebrow">{t('admin.criteria.descriptionEn')}</dt>
                    <dd className="mt-1.5 text-micro leading-relaxed text-ink-soft">
                      {note?.en ?? row.description.en}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="eyebrow">{t('admin.criteria.descriptionId')}</dt>
                    <dd className="mt-1.5 text-micro leading-relaxed text-ink-soft">
                      {note?.id ?? row.description.id}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <Button
                    size="sm"
                    tone="neutral"
                    leadingIcon={<PenLine className="size-3.5" aria-hidden="true" />}
                    onClick={() => setEditing(row)}
                  >
                    {t('admin.criteria.edit')}
                  </Button>
                  {note && (
                    <Button
                      size="sm"
                      tone="ghost"
                      leadingIcon={<Trash2 className="size-3.5" aria-hidden="true" />}
                      onClick={() => setRemoving(row)}
                    >
                      {t('admin.criteria.remove')}
                    </Button>
                  )}
                  {note?.updatedAt && (
                    <span className="text-[0.6875rem] text-ink-faint">
                      {t('admin.criteria.annotated')} · {note.updatedAt.slice(0, 10)}
                    </span>
                  )}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="text-micro leading-relaxed text-ink-muted">{t('admin.criteria.noScoring')}</p>

      <NoteDialog
        row={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          setRevision((value) => value + 1);
        }}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title={t('admin.criteria.removeTitle')}
        description={t('admin.criteria.removeBody')}
        confirmLabel={t('admin.criteria.removeConfirm')}
        cancelLabel={t('admin.criteria.cancel')}
        onConfirm={() => {
          if (removing) clearCriterionNote(removing.id as CriterionKey);
          setRemoving(null);
          setRevision((value) => value + 1);
          toast({
            title: t('admin.criteria.removed'),
            description: t('admin.criteria.removedBody'),
            variant: 'info',
          });
        }}
      />
    </div>
  );
}

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

/**
 * Note editor: one field per language, a live preview, and inline validation.
 *
 * State resets on open because the dialog is mounted with `key={openKey}` each
 * time a category is chosen — a form that kept the previous category's text
 * could save the wrong note under the wrong key.
 */
function NoteDialog({
  row,
  onClose,
  onSaved,
}: {
  row: AdminCriterionRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Modal
      open={Boolean(row)}
      onClose={onClose}
      title={row ? `${row.name.en} · ${row.name.id}` : undefined}
      description={row ? row.summary.en : undefined}
      size="lg"
    >
      {row && <NoteForm key={row.id} row={row} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}

function NoteForm({
  row,
  onClose,
  onSaved,
}: {
  row: AdminCriterionRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const existing = readCriterionNotes()[row.id as CriterionKey];

  const [en, setEn] = useState(existing?.en ?? '');
  const [id, setId] = useState(existing?.id ?? '');
  const [errors, setErrors] = useState<{ en?: string; id?: string }>({});
  const [saving, setSaving] = useState(false);

  const hint = t('admin.criteria.noteHint', {
    min: String(CRITERION_NOTE_LIMITS.min),
    max: String(CRITERION_NOTE_LIMITS.max),
  });

  const submit = () => {
    setSaving(true);
    const outcome = saveCriterionNote(row.id as CriterionKey, { en, id });

    if (!outcome.ok) {
      const message =
        outcome.code === 'descriptionRequired'
          ? t('admin.criteria.errorRequired')
          : outcome.code === 'descriptionTooShort'
            ? t('admin.criteria.errorTooShort', { min: String(CRITERION_NOTE_LIMITS.min) })
            : outcome.code === 'descriptionTooLong'
              ? t('admin.criteria.errorTooLong', { max: String(CRITERION_NOTE_LIMITS.max) })
              : t('admin.criteria.errorNotFound');

      // Length failures apply to whichever field is actually out of range, so
      // the message lands on the field the reader has to fix.
      const shortEn = clean(en).length < CRITERION_NOTE_LIMITS.min;
      const shortId = clean(id).length < CRITERION_NOTE_LIMITS.min;
      const longEn = clean(en).length > CRITERION_NOTE_LIMITS.max;
      const longId = clean(id).length > CRITERION_NOTE_LIMITS.max;

      setErrors({
        en: !clean(en) || shortEn || longEn ? message : undefined,
        id: !clean(id) || shortId || longId ? message : undefined,
      });
      setSaving(false);
      return;
    }

    setSaving(false);
    toast({
      title: t('admin.criteria.saved'),
      description: t('admin.criteria.savedBody'),
      variant: 'success',
    });
    onSaved();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-micro leading-relaxed text-ink-muted">{t('admin.criteria.editLead')}</p>

      <Input
        label={t('admin.criteria.noteEn')}
        value={en}
        onChange={(event) => setEn(event.target.value)}
        hint={hint}
        error={errors.en}
        required
      />

      <Input
        label={t('admin.criteria.noteId')}
        value={id}
        onChange={(event) => setId(event.target.value)}
        error={errors.id}
        required
      />

      <div className="grid gap-3 rounded-md border border-line bg-surface-muted/40 p-3 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="eyebrow">{t('admin.criteria.previewEn')}</p>
          <p className="mt-1.5 break-words text-micro leading-relaxed text-ink-soft">
            {clean(en) || row.description.en}
          </p>
        </div>
        <div className="min-w-0">
          <p className="eyebrow">{t('admin.criteria.previewId')}</p>
          <p className="mt-1.5 break-words text-micro leading-relaxed text-ink-soft">
            {clean(id) || row.description.id}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
        <Button tone="ghost" onClick={onClose}>
          {t('admin.criteria.cancel')}
        </Button>
        <Button tone="dark" onClick={submit} loading={saving}>
          {saving ? t('admin.criteria.saving') : t('admin.criteria.save')}
        </Button>
      </div>
    </div>
  );
}
