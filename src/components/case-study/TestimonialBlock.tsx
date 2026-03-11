import type { CaseStudyTestimonial } from '../../data/types';

export interface TestimonialBlockProps {
  testimonial: CaseStudyTestimonial;
}

export function TestimonialBlock({ testimonial }: TestimonialBlockProps) {
  return (
    <blockquote className="border-l-4 border-accent pl-8 py-6">
      <p className="text-xl md:text-2xl italic text-text-primary leading-relaxed">
        {testimonial.quote}
      </p>
      <footer className="mt-4 font-mono text-sm text-text-secondary not-italic">
        -- {testimonial.author}, {testimonial.role}
      </footer>
    </blockquote>
  );
}
