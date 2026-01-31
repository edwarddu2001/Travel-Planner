import { PersonalityScore, ActivityCategory } from './personality';

// Coordinates for locations
export interface Coordinates {
  lat: number;
  lng: number;
}

// Trip parameters input by user
export interface TripParameters {
  destination: string;
  destinationCoords: Coordinates;
  startDate: Date;
  endDate: Date;
  budget: {
    amount: number;
    currency: string;
    flexibility: 'strict' | 'moderate' | 'flexible';
  };
  travelStyle: 'solo' | 'couple' | 'family' | 'group';
  interests: ActivityCategory[];
}

// Location details for an activity
export interface Location {
  name: string;
  address: string;
  coordinates: Coordinates;
}

// Cost information for an activity
export interface Cost {
  amount: number;
  currency: string;
  category: 'free' | 'budget' | 'moderate' | 'expensive';
}

// Time of day for activities
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Individual activity in the itinerary
export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  location: Location;
  duration: number; // in minutes
  cost: Cost;
  timeOfDay: TimeOfDay;
  startTime?: string; // HH:MM format
  personalityMatch?: string; // Explanation of how this matches personality
}

// Activities grouped by day
export interface DayItinerary {
  day: number;
  date: Date;
  activities: Activity[];
  totalCost: number;
  summary: string;
}

// Complete trip itinerary
export interface Itinerary {
  id: string;
  tripParameters: TripParameters;
  personalityScores: PersonalityScore;
  days: DayItinerary[];
  totalCost: number;
  personalityInsights?: string; // AI-generated explanation
  createdAt: Date;
}

// Request/response types for API
export interface GenerateItineraryRequest {
  tripParameters: TripParameters;
  personalityScores: PersonalityScore;
}

export interface GenerateItineraryResponse {
  itinerary: Itinerary;
  error?: string;
}
