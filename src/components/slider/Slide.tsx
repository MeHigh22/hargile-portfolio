import type { ProjectData } from '../../data/types';

interface SlideProps {
  project: ProjectData;
  index: number;
}

export function Slide({ project, index }: SlideProps) {
  return (
    <div
      data-index={index}
      className="slide absolute inset-0 h-screen w-full overflow-hidden"
    >
      {/* Background hero image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.heroImg})` }}
      >
        <div className="absolute inset-0 bg-bg/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24">
        <span className="font-mono text-sm tracking-widest text-text-secondary uppercase mb-4">
          {project.category} &mdash; {project.year}
        </span>
        <h2 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold text-text leading-none">
          {project.title1}
        </h2>
        <h2 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold text-accent leading-none mt-1">
          {project.title2}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-text-secondary leading-relaxed">
          {project.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-text-secondary">
          <span>
            <span className="text-text font-medium">Client</span> &mdash; {project.client}
          </span>
          <span>
            <span className="text-text font-medium">Services</span> &mdash; {project.services}
          </span>
          <span>
            <span className="text-text font-medium">Tech</span> &mdash; {project.tech}
          </span>
        </div>
      </div>
    </div>
  );
}
