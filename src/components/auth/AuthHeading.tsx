import type { ReactNode } from 'react';

export function AuthHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="font-serif text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      {description && <p className="mt-3 text-body text-ink-soft">{description}</p>}
    </div>
  );
}

export function AuthFooterLinks({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-[0.8125rem] text-ink-soft">
      {children}
    </div>
  );
}
