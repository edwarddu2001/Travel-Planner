'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Progress } from '@/components/shared/Progress';
import { BFI_QUESTIONS, LIKERT_SCALE } from '@/lib/personality/questions';
import { calculatePersonalityScores, getTraitLabel, getTraitInterpretation } from '@/lib/personality/scoring';
import { useTripStore } from '@/store/trip-store';
import { QuestionResponse } from '@/types/personality';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function PersonalityQuizPage() {
  const router = useRouter();
  const { setPersonalityScores } = useTripStore();
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const progress = (responses.length / BFI_QUESTIONS.length) * 100;

  const handleResponse = (value: number) => {
    const questionId = BFI_QUESTIONS[currentQuestion].id;
    const newResponses = responses.filter(r => r.questionId !== questionId);
    newResponses.push({ questionId, value });
    setResponses(newResponses);

    if (currentQuestion < BFI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, show results
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const scores = calculatePersonalityScores(responses);
    setPersonalityScores(scores);
    router.push('/trip-params');
  };

  if (showResults) {
    const scores = calculatePersonalityScores(responses);

    const radarData = [
      { trait: 'Openness', value: scores.openness },
      { trait: 'Conscientiousness', value: scores.conscientiousness },
      { trait: 'Extraversion', value: scores.extraversion },
      { trait: 'Agreeableness', value: scores.agreeableness },
      { trait: 'Emotional Stability', value: 100 - scores.neuroticism },
    ];

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Personality Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="trait" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                {(Object.entries(scores) as [keyof typeof scores, number][]).map(([trait, score]) => (
                  <div key={trait} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold capitalize">{trait}</h4>
                      <span className="text-sm font-medium text-blue-600">
                        {score}/100 - {getTraitLabel(score)}
                      </span>
                    </div>
                    <Progress value={score} showLabel={false} />
                    <p className="text-sm text-gray-600 mt-2">
                      {getTraitInterpretation(trait, score)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={handleSubmit}>
                  Continue to Trip Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = BFI_QUESTIONS[currentQuestion];
  const currentResponse = responses.find(r => r.questionId === question.id);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle>Personality Assessment</CardTitle>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {BFI_QUESTIONS.length}
              </span>
            </div>
            <Progress value={progress} showLabel />
          </CardHeader>

          <CardContent>
            <div className="mb-8">
              <p className="text-lg text-gray-800 mb-6">{question.text}</p>

              <div className="space-y-2">
                {LIKERT_SCALE.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleResponse(option.value)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all
                      hover:border-blue-500 hover:bg-blue-50
                      ${currentResponse?.value === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                      }
                    `}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentResponse && (
                <Button
                  onClick={() => {
                    if (currentQuestion < BFI_QUESTIONS.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setShowResults(true);
                    }
                  }}
                >
                  {currentQuestion === BFI_QUESTIONS.length - 1 ? 'View Results' : 'Next'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
