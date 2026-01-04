import { create } from 'zustand';

export type Chapter = 1 | 2 | 3 | 4 | 5;
export type ColorMode = 'height' | 'price' | 'roi';

export interface Building {
  id: string;
  area_id: number | null;
  position: { lat: number; lng: number };
  height_meters: number;
  floors: number;
  data: {
    units: number;
    avg_price: number;
    price_per_sqft?: number;
    roi_5year?: number;
  };
}

interface StoryState {
  scrollProgress: number; // 0-1
  currentChapter: Chapter;
  colorMode: ColorMode;
  hoveredBuilding: Building | null;
  audioEnabled: boolean;
  isLoading: boolean;
  sceneData: any | null;

  // Actions
  setScrollProgress: (progress: number) => void;
  setCurrentChapter: (chapter: Chapter) => void;
  setColorMode: (mode: ColorMode) => void;
  setHoveredBuilding: (building: Building | null) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSceneData: (data: any) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  scrollProgress: 0,
  currentChapter: 1,
  colorMode: 'height',
  hoveredBuilding: null,
  audioEnabled: true,
  isLoading: true,
  sceneData: null,

  setScrollProgress: (progress) =>
    set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setColorMode: (mode) => set({ colorMode: mode }),
  setHoveredBuilding: (building) => set({ hoveredBuilding: building }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSceneData: (data) => set({ sceneData: data }),
}));

