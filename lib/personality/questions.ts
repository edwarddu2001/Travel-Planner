import { PersonalityQuestion } from '@/types/personality';

/**
 * BFI-44 (Big Five Inventory - 44 items)
 * A validated personality assessment measuring the Big Five traits
 *
 * Scoring: 5-point Likert scale
 * 1 = Strongly Disagree
 * 2 = Disagree
 * 3 = Neutral
 * 4 = Agree
 * 5 = Strongly Agree
 *
 * Items marked with (R) are reverse-scored
 */

export const BFI_QUESTIONS: PersonalityQuestion[] = [
  // EXTRAVERSION (8 items)
  { id: 1, text: 'I see myself as someone who is talkative', trait: 'extraversion', reversed: false },
  { id: 6, text: 'I see myself as someone who is reserved', trait: 'extraversion', reversed: true },
  { id: 11, text: 'I see myself as someone who is full of energy', trait: 'extraversion', reversed: false },
  { id: 16, text: 'I see myself as someone who generates a lot of enthusiasm', trait: 'extraversion', reversed: false },
  { id: 21, text: 'I see myself as someone who tends to be quiet', trait: 'extraversion', reversed: true },
  { id: 26, text: 'I see myself as someone who has an assertive personality', trait: 'extraversion', reversed: false },
  { id: 31, text: 'I see myself as someone who is sometimes shy, inhibited', trait: 'extraversion', reversed: true },
  { id: 36, text: 'I see myself as someone who is outgoing, sociable', trait: 'extraversion', reversed: false },

  // AGREEABLENESS (9 items)
  { id: 2, text: 'I see myself as someone who tends to find fault with others', trait: 'agreeableness', reversed: true },
  { id: 7, text: 'I see myself as someone who is helpful and unselfish with others', trait: 'agreeableness', reversed: false },
  { id: 12, text: 'I see myself as someone who starts quarrels with others', trait: 'agreeableness', reversed: true },
  { id: 17, text: 'I see myself as someone who has a forgiving nature', trait: 'agreeableness', reversed: false },
  { id: 22, text: 'I see myself as someone who is generally trusting', trait: 'agreeableness', reversed: false },
  { id: 27, text: 'I see myself as someone who can be cold and aloof', trait: 'agreeableness', reversed: true },
  { id: 32, text: 'I see myself as someone who is considerate and kind to almost everyone', trait: 'agreeableness', reversed: false },
  { id: 37, text: 'I see myself as someone who is sometimes rude to others', trait: 'agreeableness', reversed: true },
  { id: 42, text: 'I see myself as someone who likes to cooperate with others', trait: 'agreeableness', reversed: false },

  // CONSCIENTIOUSNESS (9 items)
  { id: 3, text: 'I see myself as someone who does a thorough job', trait: 'conscientiousness', reversed: false },
  { id: 8, text: 'I see myself as someone who can be somewhat careless', trait: 'conscientiousness', reversed: true },
  { id: 13, text: 'I see myself as someone who is a reliable worker', trait: 'conscientiousness', reversed: false },
  { id: 18, text: 'I see myself as someone who tends to be disorganized', trait: 'conscientiousness', reversed: true },
  { id: 23, text: 'I see myself as someone who tends to be lazy', trait: 'conscientiousness', reversed: true },
  { id: 28, text: 'I see myself as someone who perseveres until the task is finished', trait: 'conscientiousness', reversed: false },
  { id: 33, text: 'I see myself as someone who does things efficiently', trait: 'conscientiousness', reversed: false },
  { id: 38, text: 'I see myself as someone who makes plans and follows through with them', trait: 'conscientiousness', reversed: false },
  { id: 43, text: 'I see myself as someone who is easily distracted', trait: 'conscientiousness', reversed: true },

  // NEUROTICISM (8 items)
  { id: 4, text: 'I see myself as someone who is depressed, blue', trait: 'neuroticism', reversed: false },
  { id: 9, text: 'I see myself as someone who is relaxed, handles stress well', trait: 'neuroticism', reversed: true },
  { id: 14, text: 'I see myself as someone who can be tense', trait: 'neuroticism', reversed: false },
  { id: 19, text: 'I see myself as someone who worries a lot', trait: 'neuroticism', reversed: false },
  { id: 24, text: 'I see myself as someone who is emotionally stable, not easily upset', trait: 'neuroticism', reversed: true },
  { id: 29, text: 'I see myself as someone who can be moody', trait: 'neuroticism', reversed: false },
  { id: 34, text: 'I see myself as someone who remains calm in tense situations', trait: 'neuroticism', reversed: true },
  { id: 39, text: 'I see myself as someone who gets nervous easily', trait: 'neuroticism', reversed: false },

  // OPENNESS (10 items)
  { id: 5, text: 'I see myself as someone who is original, comes up with new ideas', trait: 'openness', reversed: false },
  { id: 10, text: 'I see myself as someone who is curious about many different things', trait: 'openness', reversed: false },
  { id: 15, text: 'I see myself as someone who is ingenious, a deep thinker', trait: 'openness', reversed: false },
  { id: 20, text: 'I see myself as someone who has an active imagination', trait: 'openness', reversed: false },
  { id: 25, text: 'I see myself as someone who is inventive', trait: 'openness', reversed: false },
  { id: 30, text: 'I see myself as someone who values artistic, aesthetic experiences', trait: 'openness', reversed: false },
  { id: 35, text: 'I see myself as someone who prefers work that is routine', trait: 'openness', reversed: true },
  { id: 40, text: 'I see myself as someone who likes to reflect, play with ideas', trait: 'openness', reversed: false },
  { id: 41, text: 'I see myself as someone who has few artistic interests', trait: 'openness', reversed: true },
  { id: 44, text: 'I see myself as someone who is sophisticated in art, music, or literature', trait: 'openness', reversed: false },
];

// Likert scale options
export const LIKERT_SCALE = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

// Get questions by trait
export function getQuestionsByTrait(trait: string) {
  return BFI_QUESTIONS.filter(q => q.trait === trait);
}

// Get total number of questions
export const TOTAL_QUESTIONS = BFI_QUESTIONS.length;
