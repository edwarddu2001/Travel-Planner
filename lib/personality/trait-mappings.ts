import {
  PersonalityScore,
  PersonalityInfluence,
  ActivityPacing,
  ActivityVariety,
  SocialPreference,
  PlanningStyle,
  AdventureLevel,
  CulturalImmersion,
  ActivityCategory,
} from '@/types/personality';

/**
 * Derive travel preferences from Big Five personality scores
 * Maps personality traits to specific travel behaviors and preferences
 *
 * @param scores PersonalityScore object with Big Five scores
 * @returns PersonalityInfluence object with derived travel preferences
 */
export function derivePersonalityInfluence(scores: PersonalityScore): PersonalityInfluence {
  return {
    activityPacing: deriveActivityPacing(scores),
    activityVariety: deriveActivityVariety(scores),
    socialPreference: deriveSocialPreference(scores),
    planningStyle: derivePlanningStyle(scores),
    adventureLevel: deriveAdventureLevel(scores),
    culturalImmersion: deriveCulturalImmersion(scores),
    preferredActivities: derivePreferredActivities(scores),
    avoidedActivities: deriveAvoidedActivities(scores),
  };
}

/**
 * Activity Pacing
 * High Conscientiousness + Low Neuroticism = Packed schedule
 * Low Conscientiousness + High Neuroticism = Relaxed pace
 */
function deriveActivityPacing(scores: PersonalityScore): ActivityPacing {
  const pacingScore = scores.conscientiousness - scores.neuroticism;

  if (pacingScore > 20) return 'packed';
  if (pacingScore < -20) return 'relaxed';
  return 'moderate';
}

/**
 * Activity Variety
 * High Openness = Diverse activities
 * Low Openness = Focused/specialized activities
 */
function deriveActivityVariety(scores: PersonalityScore): ActivityVariety {
  if (scores.openness >= 60) return 'diverse';
  if (scores.openness <= 40) return 'focused';
  return 'balanced';
}

/**
 * Social Preference
 * Based primarily on Extraversion
 */
function deriveSocialPreference(scores: PersonalityScore): SocialPreference {
  if (scores.extraversion >= 70) return 'large-groups';
  if (scores.extraversion >= 50) return 'small-groups';
  if (scores.extraversion >= 30) return 'mixed';
  return 'solitary';
}

/**
 * Planning Style
 * High Conscientiousness = Detailed planning
 * Low Conscientiousness + High Openness = Spontaneous
 */
function derivePlanningStyle(scores: PersonalityScore): PlanningStyle {
  if (scores.conscientiousness >= 65) return 'detailed';
  if (scores.conscientiousness <= 35 && scores.openness >= 55) return 'spontaneous';
  return 'semi-planned';
}

/**
 * Adventure Level
 * High Openness + Low Neuroticism = Adventurous
 * Low Openness + High Neuroticism = Safe/cautious
 */
function deriveAdventureLevel(scores: PersonalityScore): AdventureLevel {
  const adventureScore = scores.openness - scores.neuroticism;

  if (adventureScore > 30) return 'adventurous';
  if (adventureScore < -30) return 'safe';
  return 'moderate-risk';
}

/**
 * Cultural Immersion
 * High Openness + High Agreeableness = Deep local immersion
 * Low Openness = Tourist-friendly experiences
 */
function deriveCulturalImmersion(scores: PersonalityScore): CulturalImmersion {
  const immersionScore = (scores.openness + scores.agreeableness) / 2;

  if (immersionScore >= 65) return 'deep-local';
  if (immersionScore <= 40) return 'tourist-friendly';
  return 'moderate';
}

/**
 * Preferred Activities
 * Based on personality trait combinations
 */
function derivePreferredActivities(scores: PersonalityScore): ActivityCategory[] {
  const preferred: ActivityCategory[] = [];

  // High Openness -> Cultural, Adventure, Historical
  if (scores.openness >= 55) {
    preferred.push('cultural', 'historical');
    if (scores.neuroticism <= 50) {
      preferred.push('adventure');
    }
  }

  // High Extraversion -> Nightlife, Social activities
  if (scores.extraversion >= 60) {
    preferred.push('nightlife');
  }

  // High Agreeableness -> Cultural, Culinary
  if (scores.agreeableness >= 55) {
    preferred.push('culinary');
  }

  // Low Neuroticism -> Adventure, Nature
  if (scores.neuroticism <= 40) {
    preferred.push('nature');
    if (!preferred.includes('adventure')) {
      preferred.push('adventure');
    }
  }

  // High Neuroticism -> Relaxation
  if (scores.neuroticism >= 60) {
    preferred.push('relaxation');
  }

  // Low Openness -> Shopping, familiar activities
  if (scores.openness <= 40) {
    preferred.push('shopping');
  }

  return [...new Set(preferred)]; // Remove duplicates
}

/**
 * Avoided Activities
 * Activities that may not suit this personality
 */
function deriveAvoidedActivities(scores: PersonalityScore): ActivityCategory[] {
  const avoided: ActivityCategory[] = [];

  // High Neuroticism -> Avoid intense adventure
  if (scores.neuroticism >= 65 && scores.openness <= 45) {
    avoided.push('adventure');
  }

  // Low Extraversion -> Minimize nightlife
  if (scores.extraversion <= 35) {
    avoided.push('nightlife');
  }

  // Low Openness -> Less cultural immersion
  if (scores.openness <= 35) {
    avoided.push('cultural');
  }

  return [...new Set(avoided)];
}

/**
 * Generate a human-readable explanation of personality influence
 */
export function generatePersonalityExplanation(
  scores: PersonalityScore,
  influence: PersonalityInfluence
): string {
  const explanations: string[] = [];

  // Openness
  if (scores.openness >= 60) {
    explanations.push('Your high openness suggests you\'ll enjoy diverse, novel experiences and cultural immersion.');
  } else if (scores.openness <= 40) {
    explanations.push('You prefer familiar, structured activities with clear expectations.');
  }

  // Conscientiousness
  if (scores.conscientiousness >= 60) {
    explanations.push('Your conscientiousness means you appreciate detailed planning and packed itineraries.');
  } else if (scores.conscientiousness <= 40) {
    explanations.push('You prefer flexibility and spontaneity in your travel plans.');
  }

  // Extraversion
  if (scores.extraversion >= 60) {
    explanations.push('As an extravert, you\'ll thrive in social settings and group activities.');
  } else if (scores.extraversion <= 40) {
    explanations.push('You\'ll enjoy quieter, more intimate experiences with smaller groups or solo activities.');
  }

  // Agreeableness
  if (scores.agreeableness >= 60) {
    explanations.push('Your agreeableness draws you to cooperative experiences and local interactions.');
  }

  // Neuroticism
  if (scores.neuroticism >= 60) {
    explanations.push('You\'ll benefit from a relaxed pace with buffer time and low-stress activities.');
  } else if (scores.neuroticism <= 40) {
    explanations.push('Your emotional stability allows for intensive schedules and adventurous activities.');
  }

  return explanations.join(' ');
}

/**
 * Get activity recommendations based on personality
 */
export function getActivityRecommendations(scores: PersonalityScore): {
  highly_recommended: ActivityCategory[];
  recommended: ActivityCategory[];
  neutral: ActivityCategory[];
  not_recommended: ActivityCategory[];
} {
  const preferred = derivePreferredActivities(scores);
  const avoided = deriveAvoidedActivities(scores);

  const allCategories: ActivityCategory[] = [
    'adventure',
    'cultural',
    'culinary',
    'nature',
    'shopping',
    'nightlife',
    'relaxation',
    'historical',
  ];

  const highly_recommended = preferred.slice(0, 3);
  const recommended = preferred.slice(3);
  const not_recommended = avoided;
  const neutral = allCategories.filter(
    cat => !preferred.includes(cat) && !avoided.includes(cat)
  );

  return {
    highly_recommended,
    recommended,
    neutral,
    not_recommended,
  };
}
