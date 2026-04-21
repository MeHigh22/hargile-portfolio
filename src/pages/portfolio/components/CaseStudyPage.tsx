import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../PortfolioPage.css';
import './CaseStudyPage.css';
import { getCaseStudy, getAllSlugs } from '../caseStudyData';
import { SceneRenderer } from './SceneRenderer';
import type { SceneKind } from '../types';

export function CaseStudyPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('p') ?? 'atlas';
  const rootRef = useRef<HTMLDivElement>(null);

  const allSlugs = getAllSlugs();
  const idx = allSlugs.indexOf(slug);
  const p = getCaseStudy(slug);
  const nextSlug = allSlugs[(idx + 1) % allSlugs.length] ?? allSlugs[0];
  const nextP = getCaseStudy(nextSlug);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    root.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  // Scroll to top on slug change
  useEffect(() => {
    rootRef.current?.scrollTo(0, 0);
  }, [slug]);

  return (
    <div data-case-study data-portfolio data-theme="cobalt" ref={rootRef}>

      {/* Topbar */}
      <div className="cs-topbar">
        <Link to="/portfolio" className="cs-logo">
          <img src="/brand-large-white.png" alt="Hargile" />
        </Link>
        <nav>
          <Link to="/portfolio">← Portfolio</Link>
          <a href="mailto:charles.dl@hargile.com" className="cta">Démarrer un projet →</a>
        </nav>
      </div>

      {/* Breadcrumbs */}
      <div className="crumbs reveal">
        <Link to="/portfolio">Portfolio</Link>
        <span className="sep">/</span>
        <a href="#">{p.kind}</a>
        <span className="sep">/</span>
        <span className="cur">{p.name.join(' ')}</span>
      </div>

      {/* Hero */}
      <section className="hero reveal">
        <div>
          <div className="num">Projet n° {p.num} · {p.year}</div>
          <h1>{p.name[0]}<br /><em>{p.name[1]}</em></h1>
          <p className="tagline">{p.tagline}</p>
        </div>
        <div className="meta">
          <div><div className="k">Client</div><div className="v">{p.client}</div></div>
          <div><div className="k">Année</div><div className="v">{p.year}</div></div>
          <div><div className="k">Durée</div><div className="v">{p.duration}</div></div>
          <div><div className="k">Équipe</div><div className="v">{p.team}</div></div>
        </div>
      </section>

      {/* Feature frame */}
      <section className="feature reveal">
        <div className="frame">
          <div className="scene">
            <SceneRenderer scene={p.scene as SceneKind} />
          </div>
          <div className="caption">
            <span>Fig. 001 — {p.name.join(' ')}</span>
            <span>Aperçu produit</span>
          </div>
        </div>
      </section>

      {/* Metrics band */}
      <section className="metrics-band reveal">
        <h3>— Résultats mesurés</h3>
        <div className="grid">
          {p.metrics.map((m, i) => (
            <div className="cell" key={i}>
              <div className="n"><em>{m.n}</em>{m.suf}</div>
              <div>
                <div className="l">{m.l}</div>
                <div className="s">{m.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section className="narrative">
        <aside className="reveal">— Étude</aside>
        <div className="body">
          <div className="chap reveal">
            <h2>Le <em>contexte</em>.</h2>
            <p className="lede">{p.tagline}</p>
            <p>
              <span className="drop">{p.problem[0]}</span>
              {p.problem.slice(1)}
            </p>
          </div>
          <div className="chap reveal">
            <h2>L'<em>approche</em>.</h2>
            <p>{p.approach}</p>
          </div>
          <div className="pull reveal">{p.pull}</div>
          <div className="chap reveal">
            <h2>Le <em>résultat</em>.</h2>
            <p>{p.outcome}</p>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="stack-sec reveal">
        <h3>— Stack technique</h3>
        <div className="stack-grid">
          {p.stack.map(([t, n], i) => (
            <div className="stack-item" key={i}>
              <div className="t">{t}</div>
              <div className="n">{n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery reveal">
        <div className="frame">
          <div className="scene"><SceneRenderer scene={p.gallery[0] as SceneKind} /></div>
          <div className="cap">Vue 01 — interface</div>
        </div>
        <div className="frame">
          <div className="scene"><SceneRenderer scene={p.gallery[1] as SceneKind} /></div>
          <div className="cap">Vue 02 — détail</div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline reveal">
        <h3>— Chronologie</h3>
        {p.timeline.map(([week, what, out], i) => (
          <div className="tl-row" key={i}>
            <div className="week">{week}</div>
            <div className="what">{what}</div>
            <div className="out">{out}</div>
          </div>
        ))}
      </section>

      {/* Testimonial */}
      <section className="testimonial reveal">
        <blockquote>« <em>{p.quote[0]}</em> »</blockquote>
        <div className="sig">— {p.quote[1]}</div>
      </section>

      {/* Next project */}
      <section className="cs-next reveal">
        <div>
          <div className="k">Projet suivant · {nextP.num}</div>
          <h2>{nextP.name[0]} <em>{nextP.name[1]}</em></h2>
        </div>
        <Link to={`/portfolio/case-study?p=${nextP.slug}`} className="btn">Lire l'étude →</Link>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div>Hargile · Rue Sterckx 5, bt. 28 · 1060 Saint-Gilles, Belgique</div>
        <div><a href="mailto:charles.dl@hargile.com">charles.dl@hargile.com</a></div>
        <div>© 2026 — Tous droits réservés</div>
      </footer>

    </div>
  );
}
