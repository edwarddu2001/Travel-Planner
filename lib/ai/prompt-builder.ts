import { PersonalityScore } from '@/types/personality';
import { TripParameters } from '@/types/trip';
import { derivePersonalityInfluence, generatePersonalityExplanation } from '@/lib/personality/trait-mappings';
import { getTraitLabel } from '@/lib/personality/scoring';
import { format } from 'date-fns';

/**
 * Build comprehensive AI prompt for itinerary generation
 * Includes personality profile, derived preferences, and trip parameters
 */
export function buildItineraryPrompt(
  personalityScores: PersonalityScore,
  tripParameters: TripParameters
): string {
  const influence = derivePersonalityInfluence(personalityScores);
  const explanation = generatePersonalityExplanation(personalityScores, influence);

  const startDate = format(tripParameters.startDate, 'MMMM d, yyyy');
  const endDate = format(tripParameters.endDate, 'MMMM d, yyyy');
  const numDays = Math.ceil(
    (tripParameters.endDate.getTime() - tripParameters.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const prompt = `You are an expert travel planner creating a personalized trip itinerary.

# TRAVELER PERSONALITY PROFILE

## Big Five Scores (0-100 scale)
- Openness: ${personalityScores.openness}/100 (${getTraitLabel(personalityScores.openness)}) - ${getTraitDescription('openness', personalityScores.openness)}
- Conscientiousness: ${personalityScores.conscientiousness}/100 (${getTraitLabel(personalityScores.conscientiousness)}) - ${getTraitDescription('conscientiousness', personalityScores.conscientiousness)}
- Extraversion: ${personalityScores.extraversion}/100 (${getTraitLabel(personalityScores.extraversion)}) - ${getTraitDescription('extraversion', personalityScores.extraversion)}
- Agreeableness: ${personalityScores.agreeableness}/100 (${getTraitLabel(personalityScores.agreeableness)}) - ${getTraitDescription('agreeableness', personalityScores.agreeableness)}
- Neuroticism: ${personalityScores.neuroticism}/100 (${getTraitLabel(personalityScores.neuroticism)}) - ${getTraitDescription('neuroticism', personalityScores.neuroticism)}

## Derived Travel Preferences
${explanation}

- Activity Pacing: ${influence.activityPacing}
- Activity Variety: ${influence.activityVariety}
- Social Preference: ${influence.socialPreference}
- Planning Style: ${influence.planningStyle}
- Adventure Level: ${influence.adventureLevel}
- Cultural Immersion: ${influence.culturalImmersion}
- Preferred Activities: ${influence.preferredActivities.join(', ')}
${influence.avoidedActivities.length > 0 ? `- Activities to Minimize: ${influence.avoidedActivities.join(', ')}` : ''}

# TRIP PARAMETERS

- Destination: ${tripParameters.destination}
- Dates: ${startDate} to ${endDate} (${numDays} days)
- Budget: ${tripParameters.budget.currency} $${tripParameters.budget.amount} (${tripParameters.budget.flexibility} flexibility)
- Travel Style: ${tripParameters.travelStyle}
- Interests: ${tripParameters.interests.join(', ')}

# TASK

Create a detailed day-by-day itinerary that:
1. Matches this traveler's personality profile and preferences
2. Stays within the specified budget (total cost should be close to but not exceed the budget)
3. Includes activities from their stated interests
4. Respects their social preferences and pacing
5. Provides variety appropriate to their openness score
6. Includes specific activity times and durations

For each activity, provide:
- Name (specific place or experience)
- Description (2-3 sentences explaining what it is)
- Category (one of: adventure, cultural, culinary, nature, shopping, nightlife, relaxation, historical)
- Location (name, address, coordinates as lat/lng)
- Duration in minutes
- Cost (amount in ${tripParameters.budget.currency}, category: free/budget/moderate/expensive)
- Time of day (morning/afternoon/evening/night)
- Start time (HH:MM format, 24-hour)
- Brief explanation of how this activity matches the traveler's personality

Return your response as a valid JSON object with this exact structure:
{
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "summary": "Brief summary of the day",
      "activities": [
        {
          "id": "unique-id",
          "name": "Activity name",
          "description": "Description",
          "category": "cultural",
          "location": {
            "name": "Location name",
            "address": "Full address",
            "coordinates": { "lat": 40.7128, "lng": -74.0060 }
          },
          "duration": 120,
          "cost": {
            "amount": 25,
            "currency": "${tripParameters.budget.currency}",
            "category": "moderate"
          },
          "timeOfDay": "morning",
          "startTime": "09:00",
          "personalityMatch": "Matches high openness..."
        }
      ],
      "totalCost": 100
    }
  ],
  "totalCost": 500,
  "personalityInsights": "Overall explanation of how the itinerary matches this personality profile"
}

IMPORTANT: Return ONLY the JSON object, no additional text before or after.`;

  return prompt;
}

function getTraitDescription(trait: string, score: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    openness: {
      high: 'Seeks novel experiences, appreciates art and culture, enjoys diverse activities',
      moderate: 'Balances familiar with novel, open to some new experiences',
      low: 'Prefers routine and familiar activities, practical approach',
    },
    conscientiousness: {
      high: 'Organized, detail-oriented, follows schedules strictly',
      moderate: 'Balanced planning with flexibility',
      low: 'Spontaneous, flexible, goes with the flow',
    },
    extraversion: {
      high: 'Energized by social interaction, enjoys group activities',
      moderate: 'Balanced between social and solo time',
      low: 'Prefers quieter, intimate settings and solo activities',
    },
    agreeableness: {
      high: 'Cooperative, values harmony, enjoys local interactions',
      moderate: 'Balances cooperation with assertiveness',
      low: 'Direct, competitive, prioritizes own goals',
    },
    neuroticism: {
      high: 'Benefits from relaxed pace, predictable schedule, low-stress activities',
      moderate: 'Handles moderate stress, needs some buffer time',
      low: 'Emotionally stable, handles intensive schedules and adventure well',
    },
  };

  const level = score >= 55 ? 'high' : score >= 45 ? 'moderate' : 'low';
  return descriptions[trait]?.[level] || '';
}
