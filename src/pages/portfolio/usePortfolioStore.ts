import { create } from 'zustand';

interface PortfolioStore {
  currentIndex: number;
  activeYear: string;
  setIndex: (n: number) => void;
  setActiveYear: (yr: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  currentIndex: 0,
  activeYear: '2026',
  setIndex: (n) => set({ currentIndex: n }),
  setActiveYear: (yr) => set({ activeYear: yr }),
}));
