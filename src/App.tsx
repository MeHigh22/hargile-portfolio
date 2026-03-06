import { AppShell } from './components/layout/AppShell';
import { Navigation } from './components/layout/Navigation';
import { Slider } from './components/slider/Slider';

function App() {
  return (
    <AppShell>
      <Navigation />
      <Slider />
    </AppShell>
  );
}

export default App;
