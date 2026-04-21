import React from 'react';

interface OutroSlideProps {
  className?: string;
}

export const OutroSlide = React.forwardRef<HTMLElement, OutroSlideProps>(
  function OutroSlide({ className }, ref) {
    return (
      <section ref={ref as React.Ref<HTMLElement>} className={['outro portfolio-slide', className].filter(Boolean).join(' ')}>
        <div>
          <span className="kicker blue">Prochain chapitre</span>
          <h2 style={{ marginTop: '20px' }}>
            <span className="outline">Votre</span>
            <br />
            produit,
            <br />
            <em>notre</em> code.
          </h2>
        </div>
        <div className="right-col stagger">
          <dl className="contact">
            <dt>Studio</dt>
            <dd>
              <a
                href="https://www.google.com/maps/place/HARGILE+innovative+solutions/@50.8274228,4.3401395,17z"
                target="_blank"
                rel="noreferrer"
              >
                Rue Sterckx 5, bt. 28<br />
                1060 Saint-Gilles, Belgique
              </a>
            </dd>
            <dt>Contact</dt>
            <dd>
              <a href="mailto:contact@hargile.com">contact@hargile.com</a>
              <br />
              <a href="mailto:mihaihargile@proton.me" style={{ opacity: 0.7 }}>mihaihargile@proton.me</a>
            </dd>
            <dt>Téléphone</dt>
            <dd>
              <a href="tel:+3247704500">+32 477 04 50 80</a>
            </dd>
            <dt>Dispo</dt>
            <dd>Q3 2026</dd>
          </dl>

          <div className="socials">
            <a href="https://www.instagram.com/hargile_is/" target="_blank" rel="noreferrer" title="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              {' '}Instagram
            </a>
            <a href="https://www.linkedin.com/company/hargile/" target="_blank" rel="noreferrer" title="LinkedIn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {' '}LinkedIn
            </a>
          </div>

          <a
            href="mailto:contact@hargile.com?subject=Nouveau%20projet%20Hargile&body=Bonjour%2C%0A%0AJe%20souhaite%20d%C3%A9marrer%20un%20projet%20avec%20Hargile."
            className="btn-ghost"
          >
            Commencer un projet <span className="arrow">→</span>
          </a>
        </div>
      </section>
    );
  }
);
