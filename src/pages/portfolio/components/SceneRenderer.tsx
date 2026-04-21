import { useId } from 'react';
import type { SceneKind } from '../types';

// ---------- SceneWrapper ----------

function SceneWrapper({ uid, children }: { uid: string; children: React.ReactNode }) {
  return (
    <div className="mock">
      <div className="mock-browser">
        <div className="mb-head">
          <div className="dots"><span /><span /><span /></div>
          <div className="url">hargile.com</div>
        </div>
        <div className="mb-body">{children}</div>
      </div>
    </div>
  );
}

// ---------- Dashboard Scene ----------

function DashboardScene({ uid }: { uid: string }) {
  const gradId = `${uid}-af`;
  const patId = `${uid}-ag`;
  return (
    <SceneWrapper uid={uid}>
      <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#95B8F8" stopOpacity=".55" />
            <stop offset="100%" stopColor="#95B8F8" stopOpacity="0" />
          </linearGradient>
          <pattern id={patId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(149,184,248,0.08)" />
          </pattern>
        </defs>
        <rect width="760" height="460" fill={`url(#${patId})`} />
        <g fontFamily="Geist Mono" fontSize="9" fill="rgba(232,238,254,.55)" letterSpacing="1.5">
          <text x="24" y="32">OVERVIEW · TEMPS RÉEL</text>
          <text x="24" y="52" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="#E8EEFE">Événements</text>
        </g>
        <g transform="translate(24,90)">
          <rect width="220" height="80" rx="6" fill="rgba(149,184,248,.06)" stroke="rgba(149,184,248,.18)" />
          <text x="14" y="24" fontFamily="Geist Mono" fontSize="9" fill="rgba(232,238,254,.6)" letterSpacing="1.5">ACTIFS · 30j</text>
          <text x="14" y="58" fontFamily="Cormorant Garamond" fontSize="34" fill="#E8EEFE">1 248 320</text>
          <text x="14" y="74" fontFamily="Geist Mono" fontSize="9" fill="#95B8F8">↗ +12.4 %</text>
        </g>
        <g transform="translate(260,90)">
          <rect width="220" height="80" rx="6" fill="rgba(149,184,248,.06)" stroke="rgba(149,184,248,.18)" />
          <text x="14" y="24" fontFamily="Geist Mono" fontSize="9" fill="rgba(232,238,254,.6)" letterSpacing="1.5">LATENCE P95</text>
          <text x="14" y="58" fontFamily="Cormorant Garamond" fontSize="34" fill="#E8EEFE">42 ms</text>
          <text x="14" y="74" fontFamily="Geist Mono" fontSize="9" fill="#95B8F8">stable</text>
        </g>
        <g transform="translate(496,90)">
          <rect width="220" height="80" rx="6" fill="rgba(149,184,248,.06)" stroke="rgba(149,184,248,.18)" />
          <text x="14" y="24" fontFamily="Geist Mono" fontSize="9" fill="rgba(232,238,254,.6)" letterSpacing="1.5">SESSIONS EN COURS</text>
          <text x="14" y="58" fontFamily="Cormorant Garamond" fontSize="34" fill="#E8EEFE">3 421</text>
          <text x="14" y="74" fontFamily="Geist Mono" fontSize="9" fill="#95B8F8">+ 38 depuis 1 min</text>
        </g>
        <g transform="translate(24,200)">
          <rect width="692" height="220" rx="6" fill="rgba(149,184,248,.04)" stroke="rgba(149,184,248,.15)" />
          <text x="18" y="28" fontFamily="Geist Mono" fontSize="9" fill="rgba(232,238,254,.6)" letterSpacing="1.5">FLUX · 24H</text>
          <path d="M24 180 Q 80 150, 130 160 T 240 120 T 350 140 T 460 80 T 570 100 T 668 60" fill="none" stroke="#95B8F8" strokeWidth="1.6" />
          <path d={`M24 180 Q 80 150, 130 160 T 240 120 T 350 140 T 460 80 T 570 100 T 668 60 L 668 200 L 24 200 Z`} fill={`url(#${gradId})`} />
          <g fill="#95B8F8">
            <circle cx="240" cy="120" r="3" />
            <circle cx="460" cy="80" r="3" />
            <circle cx="668" cy="60" r="4" />
          </g>
        </g>
      </svg>
    </SceneWrapper>
  );
}

// ---------- Trading Scene ----------

function TradingScene({ uid }: { uid: string }) {
  const gradId = `${uid}-tf`;
  const patId = `${uid}-tg`;
  return (
    <SceneWrapper uid={uid}>
      <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id={patId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(149,184,248,0.06)" />
          </pattern>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#95B8F8" stopOpacity=".3" />
            <stop offset="100%" stopColor="#95B8F8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="760" height="460" fill={`url(#${patId})`} />
        <g fontFamily="Geist Mono" fontSize="10" fill="rgba(232,238,254,.6)" letterSpacing="1.5">
          <text x="24" y="30">EUR / USD · 1.0843 · +0.12%</text>
          <text x="260" y="30">GBP / JPY · 188.24 · −0.04%</text>
          <text x="520" y="30">XAU / USD · 2348.10 · +0.46%</text>
        </g>
        <g transform="translate(24,60)">
          <path d="M0 180 L 40 150 L 80 170 L 120 140 L 160 155 L 200 110 L 240 130 L 280 100 L 320 120 L 360 80 L 400 100 L 440 60 L 480 75 L 520 40 L 560 55 L 600 30 L 640 50 L 700 20 L 700 250 L 0 250 Z" fill={`url(#${gradId})`} />
          <path d="M0 180 L 40 150 L 80 170 L 120 140 L 160 155 L 200 110 L 240 130 L 280 100 L 320 120 L 360 80 L 400 100 L 440 60 L 480 75 L 520 40 L 560 55 L 600 30 L 640 50 L 700 20" fill="none" stroke="#95B8F8" strokeWidth="1.5" />
          <g fontFamily="Geist Mono" fontSize="8" fill="rgba(232,238,254,.4)">
            <text x="0" y="270">09:00</text>
            <text x="170" y="270">11:00</text>
            <text x="340" y="270">13:00</text>
            <text x="510" y="270">15:00</text>
            <text x="680" y="270">17:00</text>
          </g>
        </g>
        <g transform="translate(24,360)" fontFamily="Geist Mono" fontSize="10" fill="#E8EEFE">
          <rect width="692" height="24" fill="rgba(149,184,248,.06)" rx="3" />
          <text x="14" y="16">BUY EUR/USD · 2.4M · 1.0843 · EXEC 08ms</text>
          <text x="360" y="16" fill="#95B8F8">+€14 320</text>
          <rect y="32" width="692" height="24" fill="rgba(149,184,248,.03)" rx="3" />
          <text x="14" y="48">SELL XAU/USD · 800oz · 2347.9 · EXEC 11ms</text>
          <text x="360" y="48" fill="#E85C50">−€2 104</text>
        </g>
      </svg>
    </SceneWrapper>
  );
}

// ---------- Gallery Scene ----------

function GalleryScene({ uid: _uid }: { uid: string }) {
  return (
    <div className="mock">
      <div className="mock-browser" style={{ background: '#F2F1EC' }}>
        <div className="mb-head" style={{ background: '#F2F1EC', color: '#333', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
          <div className="dots">
            <span style={{ background: '#bbb' }} />
            <span style={{ background: '#bbb' }} />
            <span style={{ background: '#bbb' }} />
          </div>
          <div className="url" style={{ background: 'rgba(0,0,0,.05)', color: '#333' }}>lumen-studio.fr / expo / éclats</div>
          <span>↗ billetterie</span>
        </div>
        <div className="mb-body" style={{ background: '#F2F1EC' }}>
          <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
            <rect width="760" height="460" fill="#F2F1EC" />
            <g fontFamily="Geist Mono" fontSize="9" fill="#0A0A0C" letterSpacing="1.5">
              <text x="24" y="28">LUMEN · STUDIO · BORDEAUX</text>
              <line x1="24" y1="42" x2="736" y2="42" stroke="#0A0A0C" />
            </g>
            <text x="24" y="120" fontFamily="Cormorant Garamond" fontSize="72" fontWeight="300" fill="#0A0A0C">Éclats,</text>
            <text x="24" y="186" fontFamily="Cormorant Garamond" fontSize="72" fontStyle="italic" fill="#5B7BD6">une exposition</text>
            <text x="24" y="240" fontFamily="Cormorant Garamond" fontSize="72" fontWeight="300" fill="#0A0A0C">de lumière.</text>
            <text x="24" y="280" fontFamily="Geist Mono" fontSize="10" fill="#5A5850" letterSpacing="1.5">14 MARS — 20 JUIN 2026 · 4 ARTISTES · 22 ŒUVRES</text>
            <rect x="24" y="310" width="200" height="120" fill="#D9A57A" />
            <rect x="240" y="310" width="200" height="120" fill="#95B8F8" />
            <rect x="456" y="310" width="200" height="120" fill="#1A0F08" />
            <g transform="translate(24,310)" fontFamily="Geist Mono" fontSize="9" fill="#0A0A0C" letterSpacing="1.5">
              <rect x="460" y="0" width="176" height="34" fill="#0A0A0C" />
              <text x="475" y="22" fill="#F2F1EC">RÉSERVER · 14 € →</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------- Banking Scene ----------

function BankingScene({ uid }: { uid: string }) {
  const bgGradId = `${uid}-kbg`;
  const fillGradId = `${uid}-kf`;
  return (
    <div className="mock" style={{ padding: '20px 40px' }}>
      <div style={{ position: 'relative', width: '260px', height: '540px', borderRadius: '32px', background: '#0E1220', border: '8px solid #1A1E2C', boxShadow: '0 40px 120px rgba(0,0,0,.6)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '18px', background: '#000', borderRadius: '12px', zIndex: 3 }} />
        <svg viewBox="0 0 244 524" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id={bgGradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0E1220" />
              <stop offset="100%" stopColor="#060914" />
            </linearGradient>
            <linearGradient id={fillGradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#95B8F8" stopOpacity=".5" />
              <stop offset="100%" stopColor="#95B8F8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="244" height="524" fill={`url(#${bgGradId})`} />
          <g fontFamily="Geist Mono" fontSize="8" fill="rgba(232,238,254,.55)" letterSpacing="1.5">
            <text x="18" y="52">BONJOUR,</text>
            <text x="18" y="72" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="#E8EEFE">Léa.</text>
          </g>
          <g transform="translate(18,92)">
            <rect width="208" height="100" rx="10" fill="rgba(149,184,248,.08)" stroke="rgba(149,184,248,.22)" />
            <text x="14" y="22" fontFamily="Geist Mono" fontSize="8" fill="rgba(232,238,254,.5)" letterSpacing="1.5">TRÉSORERIE</text>
            <text x="14" y="56" fontFamily="Cormorant Garamond" fontSize="30" fill="#E8EEFE">€ 48 320</text>
            <text x="14" y="80" fontFamily="Geist Mono" fontSize="8" fill="#95B8F8">↗ + 12.4 % ce mois-ci</text>
          </g>
          <g transform="translate(18,204)">
            <rect width="208" height="80" rx="10" fill="rgba(149,184,248,.04)" stroke="rgba(149,184,248,.14)" />
            <text x="14" y="20" fontFamily="Geist Mono" fontSize="8" fill="rgba(232,238,254,.5)" letterSpacing="1.5">TVA PROVISIONNÉE</text>
            <text x="14" y="48" fontFamily="Cormorant Garamond" fontSize="22" fill="#E8EEFE">€ 8 640</text>
            <path d="M14 70 L 60 65 L 100 60 L 140 55 L 194 50" stroke="#95B8F8" strokeWidth="1.4" fill="none" />
          </g>
          <g transform="translate(18,296)" fontFamily="Geist Mono" fontSize="9" fill="#E8EEFE" letterSpacing=".5">
            <rect width="208" height="36" rx="8" fill="rgba(149,184,248,.04)" />
            <text x="14" y="16">Figaro — Médias</text>
            <text x="14" y="28" fill="rgba(232,238,254,.5)" fontSize="7">02 AVR · FACTURE</text>
            <text x="148" y="22" fill="#95B8F8">+ €3 400</text>
            <rect y="44" width="208" height="36" rx="8" fill="rgba(149,184,248,.04)" />
            <text x="14" y="60">URSSAF</text>
            <text x="14" y="72" fill="rgba(232,238,254,.5)" fontSize="7">10 AVR · PRÉLÈVEMENT</text>
            <text x="148" y="66" fill="#E85C50">− €2 180</text>
            <rect y="88" width="208" height="36" rx="8" fill="rgba(149,184,248,.04)" />
            <text x="14" y="104">Maison Sobre</text>
            <text x="14" y="116" fill="rgba(232,238,254,.5)" fontSize="7">15 AVR · FACTURE</text>
            <text x="148" y="110" fill="#95B8F8">+ €5 600</text>
          </g>
          <g transform="translate(0,470)">
            <rect width="244" height="54" fill="#0E1220" />
            <g fill="rgba(232,238,254,.5)">
              <circle cx="40" cy="24" r="4" />
              <circle cx="100" cy="24" r="4" />
              <circle cx="160" cy="24" r="4" fill="#95B8F8" />
              <circle cx="220" cy="24" r="4" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

// ---------- Editorial Scene ----------

function EditorialScene({ uid: _uid }: { uid: string }) {
  return (
    <div className="mock">
      <div className="mock-browser" style={{ background: '#F2F1EC' }}>
        <div className="mb-head" style={{ background: '#F2F1EC', color: '#333', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
          <div className="dots">
            <span style={{ background: '#bbb' }} />
            <span style={{ background: '#bbb' }} />
            <span style={{ background: '#bbb' }} />
          </div>
          <div className="url" style={{ background: 'rgba(0,0,0,.05)', color: '#333' }}>verso.media / la-patience-cet-art-perdu</div>
          <span>7:12 lecture</span>
        </div>
        <div className="mb-body" style={{ background: '#F2F1EC' }}>
          <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
            <rect width="760" height="460" fill="#F2F1EC" />
            <g fontFamily="Geist Mono" fontSize="9" fill="#0A0A0C" letterSpacing="1.5">
              <text x="40" y="32">VERSO · N°037 · AVR. 2026</text>
              <line x1="40" y1="46" x2="720" y2="46" stroke="#0A0A0C" />
            </g>
            <text x="40" y="130" fontFamily="Cormorant Garamond" fontSize="74" fontWeight="300" fill="#0A0A0C">La patience,</text>
            <text x="40" y="194" fontFamily="Cormorant Garamond" fontSize="74" fontStyle="italic" fill="#5B7BD6">cet art perdu.</text>
            <g fontFamily="Geist Mono" fontSize="9" fill="#5A5850" letterSpacing="1.5">
              <text x="40" y="224">PAR LÉA ROMAN · 12 MIN</text>
            </g>
            <g fontFamily="Cormorant Garamond" fill="#0A0A0C">
              <text x="40" y="270" fontSize="15">Les économies de l&apos;attention se sont construites sur la promesse que nous</text>
              <text x="40" y="290" fontSize="15">voudrions tout, tout de suite. Depuis, nous apprenons à désirer autrement.</text>
              <text x="40" y="310" fontSize="15">Chaque plateforme a transformé le scroll en métrique, puis en dogme.</text>
            </g>
            <rect x="40" y="340" width="680" height="90" fill="rgba(91,123,214,.12)" />
            <text x="56" y="392" fontFamily="Cormorant Garamond" fontSize="28" fontStyle="italic" fill="#0A0A0C">« Ralentir, c&apos;est déjà lire. »</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------- Shop Scene ----------

function ShopScene({ uid }: { uid: string }) {
  const bagGradId = `${uid}-bag`;
  return (
    <SceneWrapper uid={uid}>
      <svg viewBox="0 0 760 460" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={bagGradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#E8DFCE" />
            <stop offset="100%" stopColor="#BAAF99" />
          </linearGradient>
        </defs>
        <rect width="760" height="460" fill="#0B0E19" />
        <g fontFamily="Cormorant Garamond" fill="#E8EEFE">
          <text x="40" y="100" fontSize="14" fontFamily="Geist Mono" letterSpacing="2" fill="rgba(232,238,254,.55)">SINGLE ORIGIN · ETHIOPIA</text>
          <text x="40" y="170" fontSize="58" fontWeight="300">Helios</text>
          <text x="40" y="230" fontSize="58" fontStyle="italic" fill="#95B8F8">brew.</text>
          <text x="40" y="290" fontSize="20" fontStyle="italic" fill="rgba(232,238,254,.7)">Un café qui se boit lentement,</text>
          <text x="40" y="314" fontSize="20" fontStyle="italic" fill="rgba(232,238,254,.7)">comme on lit un bon livre.</text>
          <rect x="40" y="350" width="180" height="42" fill="#95B8F8" />
          <text x="130" y="377" textAnchor="middle" fontFamily="Geist Mono" fontSize="11" letterSpacing="2" fill="#06080F">S&apos;ABONNER — 18€/MOIS</text>
        </g>
        <g transform="translate(470,60)">
          <path d="M20 20 L 180 20 L 200 40 L 200 360 L 0 360 L 0 40 Z" fill={`url(#${bagGradId})`} />
          <rect x="50" y="10" width="100" height="20" fill="#1E1B15" />
          <g fontFamily="Cormorant Garamond" textAnchor="middle" fill="#3B2F1E">
            <text x="100" y="130" fontSize="20" letterSpacing="6">HELIOS</text>
            <line x1="30" y1="150" x2="170" y2="150" stroke="#3B2F1E" strokeWidth="0.5" />
            <text x="100" y="220" fontSize="44" fontStyle="italic" fill="#5B7BD6">brew</text>
            <text x="100" y="270" fontSize="10" letterSpacing="4" fontFamily="Geist Mono">ETHIOPIA · N°001</text>
            <text x="100" y="340" fontSize="9" letterSpacing="3" fontFamily="Geist Mono">340G / 11.9OZ</text>
          </g>
          <circle cx="100" cy="300" r="18" fill="none" stroke="#5B7BD6" />
          <text x="100" y="306" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="18" fontStyle="italic" fill="#5B7BD6">H</text>
        </g>
      </svg>
    </SceneWrapper>
  );
}

// ---------- SceneRenderer dispatcher ----------

export function SceneRenderer({ scene }: { scene: SceneKind }) {
  const uid = useId();
  switch (scene) {
    case 'dashboard': return <DashboardScene uid={uid} />;
    case 'trading':   return <TradingScene uid={uid} />;
    case 'gallery':   return <GalleryScene uid={uid} />;
    case 'banking':   return <BankingScene uid={uid} />;
    case 'editorial': return <EditorialScene uid={uid} />;
    case 'shop':      return <ShopScene uid={uid} />;
  }
}
