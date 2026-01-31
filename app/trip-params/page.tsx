'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Loading } from '@/components/shared/Loading';
import { useTripStore } from '@/store/trip-store';
import { ActivityCategory } from '@/types/personality';
import { TripParameters } from '@/types/trip';

const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string; emoji: string }[] = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'cultural', label: 'Cultural', emoji: '🎭' },
  { value: 'culinary', label: 'Culinary', emoji: '🍴' },
  { value: 'nature', label: 'Nature', emoji: '🌲' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🎉' },
  { value: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { value: 'historical', label: 'Historical', emoji: '🏛️' },
];

export default function TripParamsPage() {
  const router = useRouter();
  const { personalityScores, setTripParameters, setCurrentItinerary, setIsGenerating, isGenerating } = useTripStore();

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(1000);
  const [currency, setCurrency] = useState('USD');
  const [budgetFlexibility, setBudgetFlexibility] = useState<'strict' | 'moderate' | 'flexible'>('moderate');
  const [travelStyle, setTravelStyle] = useState<'solo' | 'couple' | 'family' | 'group'>('solo');
  const [selectedInterests, setSelectedInterests] = useState<ActivityCategory[]>([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest: ActivityCategory) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destination || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    // Simple geocoding placeholder - in production, use Mapbox Geocoding API
    const destinationCoords = { lat: 40.7128, lng: -74.0060 }; // Default NYC

    const tripParams: TripParameters = {
      destination,
      destinationCoords,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: {
        amount: budget,
        currency,
        flexibility: budgetFlexibility,
      },
      travelStyle,
      interests: selectedInterests,
    };

    setTripParameters(tripParams);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripParameters: tripParams,
          personalityScores,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setCurrentItinerary(data.itinerary);
      router.push(`/itinerary/${data.itinerary.id}`);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <Loading fullScreen text="Generating your personalized itinerary..." />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <p className="text-gray-600 mt-2">Tell us about your trip</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination */}
              <Input
                label="Destination *"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                required
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date *"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget: ${budget} {currency}
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Budget Flexibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Flexibility
                </label>
                <div className="flex gap-2">
                  {(['strict', 'moderate', 'flexible'] as const).map((flex) => (
                    <button
                      key={flex}
                      type="button"
                      onClick={() => setBudgetFlexibility(flex)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 capitalize transition-all ${
                        budgetFlexibility === flex
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {flex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['solo', 'couple', 'family', 'group'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`py-2 px-4 rounded-lg border-2 capitalize transition-all ${
                        travelStyle === style
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests * (select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ACTIVITY_CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => toggleInterest(category.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedInterests.includes(category.value)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{category.emoji}</div>
                      <div className="text-xs font-medium">{category.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/personality-quiz')}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Generate Itinerary
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
