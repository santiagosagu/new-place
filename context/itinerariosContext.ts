import { create } from "zustand";

type ItinerariosState = {
  itinerarios: any[];
  isLoading: boolean;
  setItinerarios: (itinerarios: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useItinerariosContext = create<ItinerariosState>()((set) => ({
  itinerarios: [],
  isLoading: false,
  setItinerarios: (itinerarios) => set({ itinerarios }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
