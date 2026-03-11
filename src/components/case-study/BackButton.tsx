interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-[110] backdrop-blur-md bg-bg/40 rounded-full px-4 py-2 text-text text-sm font-mono tracking-wider hover:bg-bg/60 transition-colors border border-text/10"
      aria-label="Retour au portfolio"
    >
      ← Retour
    </button>
  );
}
