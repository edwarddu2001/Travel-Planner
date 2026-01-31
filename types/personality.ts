// Big Five Personality Traits
export type BigFiveTrait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';

// Personality score for each trait (0-100 scale)
export interface PersonalityScore {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// Individual question in the BFI-44 assessment
export interface PersonalityQuestion {
  id: number;
  text: string;
  trait: BigFiveTrait;
  reversed: boolean; // Whether scoring should be reversed
}

// User's response to a personality question
export interface QuestionResponse {
  questionId: number;
  value: number; // 1-5 Likert scale
}

// Derived travel preferences from personality
export type ActivityPacing = 'relaxed' | 'moderate' | 'packed';
export type ActivityVariety = 'focused' | 'balanced' | 'diverse';
export type SocialPreference = 'solitary' | 'small-groups' | 'large-groups' | 'mixed';
export type PlanningStyle = 'spontaneous' | 'semi-planned' | 'detailed';
export type AdventureLevel = 'safe' | 'moderate-risk' | 'adventurous';
export type CulturalImmersion = 'tourist-friendly' | 'moderate' | 'deep-local';

export interface PersonalityInfluence {
  activityPacing: ActivityPacing;
  activityVariety: ActivityVariety;
  socialPreference: SocialPreference;
  planningStyle: PlanningStyle;
  adventureLevel: AdventureLevel;
  culturalImmersion: CulturalImmersion;
  preferredActivities: ActivityCategory[];
  avoidedActivities: ActivityCategory[];
}

export type ActivityCategory =
  | 'adventure'
  | 'cultural'
  | 'culinary'
  | 'nature'
  | 'shopping'
  | 'nightlife'
  | 'relaxation'
  | 'historical';
