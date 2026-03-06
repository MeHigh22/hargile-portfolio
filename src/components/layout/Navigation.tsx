import { Container } from './Container';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <Container className="flex justify-between items-center h-16">
        <span className="font-display font-bold text-lg tracking-wide text-text">
          HARGILE
        </span>
      </Container>
    </nav>
  );
}
