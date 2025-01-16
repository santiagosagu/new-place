import { create } from "zustand";

type RouteState = {
  isNavigating: boolean;
  inOnRoute: boolean;
  place: any;
  route: any[];
  traficData: any[];
  matchedData: any;
  instructions: any[];
  currentInstruction: any[];
  currentStep: number;
  instructionStep: string;
  setIsNavigating: (isNavigating: boolean) => void;
  setInOnRoute: (inOnRoute: boolean) => void;
  setPlace: (place: any) => void;
  setRoute: (route: any[]) => void;
  setTraficData: (traficData: any[]) => void;
  setMatchedData: (matchedData: any) => void;
  setInstructions: (instructions: any[]) => void;
  setCurrentInstruction: (currentInstruction: any[]) => void;
  setInstructionStep: (instructionStep: string) => void;
  setCurrentStep: (currentStep: number) => void;
};

export const usePlaceNavigateContext = create<RouteState>()((set) => ({
  isNavigating: false,
  inOnRoute: false,
  place: null,
  route: [],
  traficData: [],
  matchedData: [],
  instructions: [],
  currentStep: 0,
  instructionStep: "No disponible",
  currentInstruction: [],
  setIsNavigating: (isNavigating) => set({ isNavigating }),
  setInOnRoute: (inOnRoute) => set({ inOnRoute }),
  setMatchedData: (matchedData) => set({ matchedData }),
  setRoute: (route) => set({ route }),
  setTraficData: (traficData) => set({ traficData }),
  setPlace: (place) => set({ place }),
  setInstructions: (instructions) => set({ instructions }),
  setCurrentInstruction: (currentInstruction) => set({ currentInstruction }),
  setInstructionStep: (instructionStep) => set({ instructionStep }),
  setCurrentStep: (currentStep) => set({ currentStep }),
}));
