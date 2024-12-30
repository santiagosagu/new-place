import { create } from "zustand";

type RouteState = {
  isNavigating: boolean;
  place: any;
  route: any[];
  instructions: any[];
  currentStep: number;
  instructionStep: string;
  setIsNavigating: (isNavigating: boolean) => void;
  setPlace: (place: any) => void;
  setRoute: (route: any[]) => void;
  setInstructions: (instructions: any[]) => void;
  setInstructionStep: (instructionStep: string) => void;
  setCurrentStep: (currentStep: number) => void;
};

export const usePlaceNavigateContext = create<RouteState>()((set) => ({
  isNavigating: false,
  place: null,
  route: [],
  instructions: [],
  currentStep: 0,
  instructionStep: "No disponible",
  setIsNavigating: (isNavigating) => set({ isNavigating }),
  setRoute: (route) => set({ route }),
  setPlace: (place) => set({ place }),
  setInstructions: (instructions) => set({ instructions }),
  setInstructionStep: (instructionStep) => set({ instructionStep }),
  setCurrentStep: (currentStep) => set({ currentStep }),
}));
