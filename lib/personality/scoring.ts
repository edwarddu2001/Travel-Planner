import { PersonalityScore, QuestionResponse, BigFiveTrait } from '@/types/personality';
import { BFI_QUESTIONS, getQuestionsByTrait } from './questions';

/**
 * Calculate Big Five personality scores from questionnaire responses
 * Uses BFI-44 scoring methodology with reverse scoring
 *
 * @param responses Array of user responses to personality questions
 * @returns PersonalityScore object with scores normalized to 0-100 scale
 */
export function calculatePersonalityScores(responses: QuestionResponse[]): PersonalityScore {
  const traits: BigFiveTrait[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

  const scores: Partial<PersonalityScore> = {};

  for (const trait of traits) {
    const traitQuestions = getQuestionsByTrait(trait);
    const traitResponses = responses.filter(r =>
      traitQuestions.some(q => q.id === r.questionId)
    );

    let sum = 0;
    let count = 0;

    for (const response of traitResponses) {
      const question = BFI_QUESTIONS.find(q => q.id === response.questionId);
      if (!question) continue;

      // Apply reverse scoring if needed
      const score = question.reversed ? (6 - response.value) : response.value;
      sum += score;
      count++;
    }

    // Calculate average (1-5 scale)
    const average = count > 0 ? sum / count : 3;

    // Normalize to 0-100 scale
    // Formula: ((average - 1) / 4) * 100
    const normalized = ((average - 1) / 4) * 100;

    scores[trait] = Math.round(normalized);
  }

  return scores as PersonalityScore;
}

/**
 * Get descriptive label for a trait score
 *
 * @param score Score value (0-100)
 * @returns Descriptive label
 */
export function getTraitLabel(score: number): string {
  if (score >= 70) return 'Very High';
  if (score >= 55) return 'High';
  if (score >= 45) return 'Moderate';
  if (score >= 30) return 'Low';
  return 'Very Low';
}

/**
 * Get interpretation text for each trait
 */
export function getTraitInterpretation(trait: BigFiveTrait, score: number): string {
  const interpretations: Record<BigFiveTrait, Record<string, string>> = {
    openness: {
      high: 'You are imaginative, curious, and open to new experiences. You appreciate art, adventure, and variety.',
      moderate: 'You balance familiarity with novelty, enjoying some new experiences while valuing tradition.',
      low: 'You prefer routine and familiar experiences. You are practical and traditional in your approach.',
    },
    conscientiousness: {
      high: 'You are organized, reliable, and goal-oriented. You plan carefully and follow through on commitments.',
      moderate: 'You balance structure with flexibility, maintaining organization while adapting when needed.',
      low: 'You are spontaneous and flexible. You prefer to go with the flow rather than strict planning.',
    },
    extraversion: {
      high: 'You are outgoing, energetic, and enjoy social interactions. You thrive in group settings.',
      moderate: 'You enjoy socializing but also value alone time. You adapt to both group and solo activities.',
      low: 'You are reserved and prefer smaller, intimate gatherings or solitary activities.',
    },
    agreeableness: {
      high: 'You are compassionate, cooperative, and value harmony. You prioritize others\' needs and feelings.',
      moderate: 'You balance self-interest with consideration for others, being cooperative yet assertive.',
      low: 'You are competitive and direct. You prioritize your own goals and speak your mind.',
    },
    neuroticism: {
      high: 'You are sensitive and may experience stress more intensely. You benefit from calm, predictable environments.',
      moderate: 'You handle stress reasonably well with occasional anxiety. You adapt to most situations.',
      low: 'You are emotionally stable and resilient. You remain calm under pressure and handle stress well.',
    },
  };

  const level = score >= 55 ? 'high' : score >= 45 ? 'moderate' : 'low';
  return interpretations[trait][level];
}

/**
 * Validate that all questions have been answered
 */
export function validateResponses(responses: QuestionResponse[]): { valid: boolean; missing: number[] } {
  const answeredIds = new Set(responses.map(r => r.questionId));
  const missing = BFI_QUESTIONS
    .map(q => q.id)
    .filter(id => !answeredIds.has(id));

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if a response value is valid (1-5)
 */
export function isValidResponse(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
