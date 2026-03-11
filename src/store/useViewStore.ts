import { create } from 'zustand';
import { useSliderStore } from './useSliderStore';

type ViewMode = 'slider' | 'case';

interface ViewState {
  mode: ViewMode;
  activeProjectId: string | null;
  openCase: (projectId: string) => void;
  closeCase: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  mode: 'slider',
  activeProjectId: null,
  openCase: (projectId: string) => {
    // Block case study open while slider is animating to prevent mid-transition palette bleed
    if (useSliderStore.getState().isAnimating) return;
    set({ mode: 'case', activeProjectId: projectId });
  },
  closeCase: () => {
    set({ mode: 'slider', activeProjectId: null });
  },
}));
