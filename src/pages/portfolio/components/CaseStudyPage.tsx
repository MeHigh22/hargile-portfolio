import { useSearchParams, Link } from 'react-router-dom';
import { projects } from '../../../data/projects';

export function CaseStudyPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('p');
  const project = projects.find(p => p.id === slug);

  if (!project) {
    return (
      <div
        data-portfolio
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--bg)',
          color: 'var(--ink)',
          fontFamily: 'var(--mono)',
          zIndex: 200,
        }}
      >
        <p>Projet introuvable : {slug}</p>
        <Link to="/portfolio" style={{ color: 'var(--blue)' }}>← Retour au portfolio</Link>
      </div>
    );
  }

  const cs = project.caseStudy;

  return (
    <div
      data-portfolio
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        background: 'var(--bg)',
        color: 'var(--ink)',
        fontFamily: 'var(--sans)',
        zIndex: 200,
      }}
    >
      {/* Back navigation */}
      <Link
        to="/portfolio"
        style={{
          position: 'fixed',
          top: '28px',
          left: '36px',
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'var(--blue)',
          textDecoration: 'none',
          zIndex: 100,
        }}
      >
        ← Portfolio
      </Link>

      <article style={{ maxWidth: '760px', margin: '0 auto', padding: '120px 36px 80px' }}>
        {/* Hero */}
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            letterSpacing: '.24em',
            textTransform: 'uppercase',
            color: 'var(--blue)',
            marginBottom: '16px',
          }}
        >
          {project.category} · {project.industry}
        </p>
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 300,
            fontSize: 'clamp(48px,7vw,96px)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          {project.title1}<br /><em style={{ color: 'var(--blue)' }}>{project.title2}</em>
        </h1>
        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.55,
            color: 'var(--ink-dim)',
            marginBottom: '48px',
            maxWidth: '560px',
          }}
        >
          {project.subtitle}
        </p>

        {project.heroImg && (
          <img
            src={project.heroImg}
            alt={`${project.title1} ${project.title2}`}
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '64px',
              objectFit: 'cover',
              maxHeight: '480px',
            }}
          />
        )}

        {/* Projects with caseStudy data */}
        {cs && (
          <>
            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                Défi
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{cs.challenge}</p>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                Solution
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{cs.solution}</p>
            </section>

            {/* Metrics */}
            {cs.metrics.length > 0 && (
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
                {cs.metrics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      minWidth: '140px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: '32px',
                        fontWeight: 300,
                        color: 'var(--blue)',
                        lineHeight: 1,
                      }}
                    >
                      {m.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '10px',
                        letterSpacing: '.18em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-dim)',
                        marginTop: '8px',
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonial */}
            {cs.testimonial && (
              <blockquote
                style={{
                  borderLeft: '2px solid var(--blue)',
                  paddingLeft: '24px',
                  marginBottom: '48px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--display)',
                    fontStyle: 'italic',
                    fontSize: '22px',
                    lineHeight: 1.5,
                    color: 'var(--ink)',
                    marginBottom: '12px',
                  }}
                >
                  &ldquo;{cs.testimonial.quote}&rdquo;
                </p>
                <cite
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '11px',
                    color: 'var(--ink-dim)',
                    fontStyle: 'normal',
                  }}
                >
                  — {cs.testimonial.author}, {cs.testimonial.role}
                </cite>
              </blockquote>
            )}
          </>
        )}

        {/* Projects without caseStudy — show narrative */}
        {!cs && (
          <>
            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                Défi
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)' }}>{project.narrative.problem}</p>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                Solution
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)' }}>{project.narrative.solution}</p>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                Résultat
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)' }}>{project.narrative.outcome}</p>
            </section>
          </>
        )}

        {/* Website CTA */}
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 22px',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '999px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              textDecoration: 'none',
            }}
          >
            Voir le site →
          </a>
        )}
      </article>
    </div>
  );
}
