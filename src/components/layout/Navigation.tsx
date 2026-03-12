export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-20 px-8 md:px-16">
        <a href="https://hargile.com" aria-label="Hargile">
          <img
            src="/brand-large-white.png"
            alt="Hargile"
            className="h-14 w-auto"
          />
        </a>
        <a
          href="mailto:contact@hargile.com"
          className="rounded-full bg-accent px-4 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-medium text-bg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
        >
          Travaillons ensemble
        </a>
      </div>
    </nav>
  );
}
