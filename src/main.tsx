import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { PortfolioPage } from './pages/portfolio/PortfolioPage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/portfolio/*" element={<PortfolioPage />} />
    </Routes>
  </BrowserRouter>
);
