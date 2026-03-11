import type { ReactNode } from 'react';

interface CaseStudySectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function CaseStudySection({ title, children, className }: CaseStudySectionProps) {
  return (
    <section
      data-anim="cs-section"
      className={`max-w-225 px-8 md:px-16 py-16 ${className ?? ''}`}
    >
      <h3 className="font-mono text-sm uppercase tracking-widest text-accent mb-6">
        {title}
      </h3>
      {children}
    </section>
  );
}
