import { create } from 'zustand';

export type Scene = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Year = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

interface TimeMachineState {
  scrollProgress: number; // 0-1
  currentScene: Scene;
  selectedYear: Year;
  investmentAmount: number;
  selectedArea: number | null;
  showResults: boolean;
  investmentStartYear: Year | null;

  // Actions
  setScrollProgress: (progress: number) => void;
  setCurrentScene: (scene: Scene) => void;
  setSelectedYear: (year: Year) => void;
  setInvestmentAmount: (amount: number) => void;
  setSelectedArea: (areaId: number | null) => void;
  setShowResults: (show: boolean) => void;
  setInvestmentStartYear: (year: Year | null) => void;
}

export const useTimeMachineStore = create<TimeMachineState>((set) => ({
  scrollProgress: 0,
  currentScene: 1,
  selectedYear: 2020,
  investmentAmount: 1000000,
  selectedArea: null,
  showResults: false,
  investmentStartYear: null,

  setScrollProgress: (progress) =>
    set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
  setShowResults: (show) => set({ showResults: show }),
  setInvestmentStartYear: (year) => set({ investmentStartYear: year }),
}));

