import { AppShell } from './components/layout/AppShell';
import { Navigation } from './components/layout/Navigation';
import { Container } from './components/layout/Container';
import { ProjectCard } from './components/projects/ProjectCard';
import { projects } from './data/projects';

function App() {
  return (
    <AppShell>
      <Navigation />
      <Container className="pt-24 md:pt-32">
        <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-text mb-10">
          Portfolio
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </AppShell>
  );
}

export default App;
