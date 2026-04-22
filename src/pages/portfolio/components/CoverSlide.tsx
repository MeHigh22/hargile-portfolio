import React from 'react';
import type { PortfolioSlideData } from '../types';
import { Marquee } from './Marquee';
import { GlobeCanvas } from './GlobeCanvas';

interface CoverSlideProps {
  slides: PortfolioSlideData[];
  onGoToProjects: () => void;
  className?: string;
}

export const CoverSlide = React.forwardRef<HTMLDivElement, CoverSlideProps>(
  function CoverSlide({ slides, onGoToProjects, className }, ref) {
    return (
      <div ref={ref} className={['cover portfolio-slide', className].filter(Boolean).join(' ')}>
        {/* Left column */}
        <div className="cover-left stagger">
          <div className="cover-main">
            <div className="eyebrow">
              <span className="kicker">Portfolio 2019 — 2026</span>
              <span style={{ height: '1px', background: 'var(--line)', flex: '1', maxWidth: '80px' }} />
              <span className="kicker blue">Vol. VII</span>
            </div>
            <h1>
              <span className="thin">L&apos;innovation digitale</span><br />
              <em>au service </em><br />
              <span className="thin">de votre entreprise</span>
            </h1>
            <p className="lede">
              HARGILE est une agence digitale pensée pour concevoir et développer des solutions technologiques innovantes, adaptées à vos défis stratégiques et opérationnels.
            </p>
            <div className="cover-actions">
              <button className="btn-ghost" onClick={onGoToProjects}>
                Parcourir les projets <span className="arrow">→</span>
              </button>
              <div className="stats">
                <div className="stat">
                  <div className="n"><em>24</em></div>
                  <div className="l">Projets livrés</div>
                </div>
                <div className="stat">
                  <div className="n">11</div>
                  <div className="l">Clients récurrents</div>
                </div>
                <div className="stat">
                  <div className="n"><em>∞</em></div>
                  <div className="l">Lignes de code</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — globe */}
        <div className="cover-globe">
          <GlobeCanvas />
        </div>

        {/* Bottom row — marquee spanning both columns */}
        <div className="cover-marquee">
          <Marquee items={slides.map(s => s.name.join(' '))} />
        </div>
      </div>
    );
  }
);
