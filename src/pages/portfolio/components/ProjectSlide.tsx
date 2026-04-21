import React from 'react';
import type { PortfolioSlideData } from '../types';
import { SceneRenderer } from './SceneRenderer';

interface ProjectSlideProps {
  slide: PortfolioSlideData;
  index: number;
  className?: string;
}

export const ProjectSlide = React.forwardRef<HTMLElement, ProjectSlideProps>(
  function ProjectSlide({ slide, index: _index, className }, ref) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={['project portfolio-slide', className].filter(Boolean).join(' ')}>
        {/* Left column */}
        <div className="left stagger">
          <div className="project-num">
            Projet n° {slide.num} / {slide.kind}
          </div>
          <h2>
            <span>{slide.name[0]}</span>
            <br />
            <em>{slide.name[1]}</em>
          </h2>
          <div className="tagline">{slide.tagline}</div>
          <div className="sections">
            <div className="row">
              <h4>Problème</h4>
              <p>{slide.problem}</p>
            </div>
            <div className="row">
              <h4>Solution</h4>
              <p>{slide.solution}</p>
            </div>
            <div className="row">
              <h4>Résultat</h4>
              <p>{slide.result}</p>
            </div>
          </div>
          <div className="tags-row">
            {slide.tags.map((t, j) => (
              <span key={j} className={['tag', j === 0 ? 'blue' : ''].filter(Boolean).join(' ')}>
                {t}
              </span>
            ))}
          </div>
          <div className="actions">
            {slide.websiteUrl ? (
              <a href={slide.websiteUrl} className="btn-ghost" target="_blank" rel="noreferrer">
                Voir le site <span className="arrow">→</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Right column */}
        <div className="right">
          <div className="img-wrap">
            <SceneRenderer scene={slide.scene} />
          </div>
          <div className="metric-chips">
            {slide.metrics.map((m, i) => (
              <div key={i} className="chip">
                <div className="cn">
                  <em>{m.n}</em>{m.suf}
                </div>
                <div className="cl">{m.l}</div>
              </div>
            ))}
          </div>
          <div className="img-caption">
            <span>{slide.caption[0]}</span>
            <span>{slide.caption[1]}</span>
          </div>
        </div>
      </div>
    );
  }
);
