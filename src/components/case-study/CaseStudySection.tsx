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
      className={`max-w-[800px] mx-auto px-6 md:px-0 py-16 ${className ?? ''}`}
    >
      <h3 className="font-mono text-sm uppercase tracking-widest text-accent mb-6">
        {title}
      </h3>
      {children}
    </section>
  );
}
