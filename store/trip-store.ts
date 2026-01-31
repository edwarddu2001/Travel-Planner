import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PersonalityScore } from '@/types/personality';
import { TripParameters, Itinerary } from '@/types/trip';

// State interface
interface TripState {
  // Current workflow step
  currentStep: 'landing' | 'personality' | 'parameters' | 'itinerary';

  // Personality assessment
  personalityScores: PersonalityScore | null;

  // Trip parameters (partially filled during form)
  tripParameters: Partial<TripParameters>;

  // Current generated itinerary
  currentItinerary: Itinerary | null;

  // Saved itineraries (persisted)
  savedItineraries: Itinerary[];

  // Loading state for AI generation
  isGenerating: boolean;

  // Error state
  error: string | null;
}

// Actions interface
interface TripActions {
  // Navigation
  setCurrentStep: (step: TripState['currentStep']) => void;

  // Personality
  setPersonalityScores: (scores: PersonalityScore) => void;
  clearPersonalityScores: () => void;

  // Trip parameters
  setTripParameters: (params: Partial<TripParameters>) => void;
  updateTripParameter: <K extends keyof TripParameters>(
    key: K,
    value: TripParameters[K]
  ) => void;
  clearTripParameters: () => void;

  // Itinerary
  setCurrentItinerary: (itinerary: Itinerary) => void;
  clearCurrentItinerary: () => void;
  saveItinerary: (itinerary: Itinerary) => void;
  deleteItinerary: (id: string) => void;
  loadItinerary: (id: string) => void;

  // Generation state
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

type TripStore = TripState & TripActions;

// Initial state
const initialState: TripState = {
  currentStep: 'landing',
  personalityScores: null,
  tripParameters: {},
  currentItinerary: null,
  savedItineraries: [],
  isGenerating: false,
  error: null,
};

// Create store with persistence
export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      // Personality
      setPersonalityScores: (scores) =>
        set({ personalityScores: scores, currentStep: 'parameters' }),

      clearPersonalityScores: () => set({ personalityScores: null }),

      // Trip parameters
      setTripParameters: (params) =>
        set((state) => ({
          tripParameters: { ...state.tripParameters, ...params },
        })),

      updateTripParameter: (key, value) =>
        set((state) => ({
          tripParameters: {
            ...state.tripParameters,
            [key]: value,
          },
        })),

      clearTripParameters: () => set({ tripParameters: {} }),

      // Itinerary
      setCurrentItinerary: (itinerary) =>
        set({ currentItinerary: itinerary, currentStep: 'itinerary' }),

      clearCurrentItinerary: () => set({ currentItinerary: null }),

      saveItinerary: (itinerary) =>
        set((state) => {
          const existing = state.savedItineraries.find((i) => i.id === itinerary.id);
          if (existing) {
            return {
              savedItineraries: state.savedItineraries.map((i) =>
                i.id === itinerary.id ? itinerary : i
              ),
            };
          }
          return {
            savedItineraries: [...state.savedItineraries, itinerary],
          };
        }),

      deleteItinerary: (id) =>
        set((state) => ({
          savedItineraries: state.savedItineraries.filter((i) => i.id !== id),
          currentItinerary:
            state.currentItinerary?.id === id ? null : state.currentItinerary,
        })),

      loadItinerary: (id) => {
        const itinerary = get().savedItineraries.find((i) => i.id === id);
        if (itinerary) {
          set({
            currentItinerary: itinerary,
            personalityScores: itinerary.personalityScores,
            tripParameters: itinerary.tripParameters,
            currentStep: 'itinerary',
          });
        }
      },

      // Generation state
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setError: (error) => set({ error }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'trip-planner-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        personalityScores: state.personalityScores,
        savedItineraries: state.savedItineraries,
        currentItinerary: state.currentItinerary,
      }),
    }
  )
);

// Selectors for common derived state
export const selectHasPersonalityScores = (state: TripStore) =>
  state.personalityScores !== null;

export const selectHasTripParameters = (state: TripStore) =>
  state.tripParameters.destination !== undefined &&
  state.tripParameters.startDate !== undefined &&
  state.tripParameters.endDate !== undefined;

export const selectCanGenerateItinerary = (state: TripStore) =>
  selectHasPersonalityScores(state) &&
  selectHasTripParameters(state) &&
  !state.isGenerating;
