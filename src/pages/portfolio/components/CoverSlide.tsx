import React from 'react';
import type { PortfolioSlideData } from '../types';
import { Marquee } from './Marquee';

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
              <span className="kicker">Hargile Studio</span>
              <span style={{ height: '1px', background: 'var(--line)', flex: '1', maxWidth: '80px' }} />
              <span className="kicker blue">
                <span className="dot" />
                Disponible — Q3 2026
              </span>
            </div>
            <h1>
              <span className="thin">Des sites</span>{' '}
              <em>qui convertissent</em>
            </h1>
            <p className="lede">
              Nous construisons des expériences digitales sur-mesure pour des marques ambitieuses.
            </p>
            <div className="cover-actions">
              <button className="btn-ghost" onClick={onGoToProjects}>
                Explorer nos projets <span className="arrow">→</span>
              </button>
              <div className="stats">
                <div className="stat">
                  <div className="n"><em>{slides.length}</em></div>
                  <div className="l">Projets livrés</div>
                </div>
                <div className="stat">
                  <div className="n">4+</div>
                  <div className="l">Années d&apos;expérience</div>
                </div>
                <div className="stat">
                  <div className="n"><em>100%</em></div>
                  <div className="l">Clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — globe iframe */}
        <div className="cover-globe">
          <iframe
            src="/portfolio/globe-unbundled.html"
            title="Carte globale"
            scrolling="no"
            tabIndex={-1}
          />
        </div>

        {/* Bottom row — marquee spanning both columns */}
        <div className="cover-marquee">
          <Marquee items={slides.map(s => s.name.join(' '))} />
        </div>
      </div>
    );
  }
);
