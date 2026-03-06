import type { ProjectData } from '../../data/types';

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="bg-bg-card rounded-[--radius-lg] border border-border overflow-hidden hover:border-border-hover transition-colors">
      <img
        src={project.heroImg}
        alt={`${project.title1} ${project.title2}`}
        loading="lazy"
        className="w-full aspect-video object-cover"
      />
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-display font-bold text-xl text-text">
            {project.title1} {project.title2}
          </h2>
          <span className="text-text-secondary text-sm">{project.year}</span>
        </div>
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
          {project.category}
        </p>
        <p className="text-text-secondary text-sm mb-4">
          {project.subtitle}
        </p>
        <div className="flex items-center justify-between text-text-muted font-mono text-xs">
          <span>{project.client}</span>
          <span>{project.tech}</span>
        </div>
      </div>
    </article>
  );
}
