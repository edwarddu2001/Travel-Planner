'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/shared/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Loading } from '@/components/shared/Loading';
import { useTripStore } from '@/store/trip-store';
import { Activity, DayItinerary } from '@/types/trip';

export default function ItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const { currentItinerary, savedItineraries, loadItinerary, saveItinerary } = useTripStore();
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!currentItinerary) {
      const itineraryId = params.id as string;
      const saved = savedItineraries.find((i) => i.id === itineraryId);
      if (saved) {
        loadItinerary(itineraryId);
      } else {
        router.push('/');
      }
    }
  }, [currentItinerary, params.id, savedItineraries, loadItinerary, router]);

  if (!currentItinerary) {
    return <Loading fullScreen text="Loading itinerary..." />;
  }

  const handleSave = () => {
    saveItinerary(currentItinerary);
    alert('Itinerary saved!');
  };

  const handleExportPDF = () => {
    // Placeholder for PDF export
    alert('PDF export feature coming soon!');
  };

  const currentDay = currentItinerary.days[selectedDay];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentItinerary.tripParameters.destination}
              </h1>
              <p className="text-gray-600">
                {format(currentItinerary.tripParameters.startDate, 'MMMM d, yyyy')} -{' '}
                {format(currentItinerary.tripParameters.endDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSave}>
                Save Itinerary
              </Button>
              <Button onClick={handleExportPDF}>
                Export PDF
              </Button>
            </div>
          </div>

          {/* Personality Insights */}
          {currentItinerary.personalityInsights && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Personalized for you: </span>
                  {currentItinerary.personalityInsights}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Days</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentItinerary.days.map((day, index) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedDay === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Day {day.day}</div>
                    <div className="text-sm text-gray-600">
                      {format(day.date, 'MMM d')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {day.activities.length} activities
                    </div>
                    <div className="text-sm font-medium text-blue-600 mt-1">
                      ${day.totalCost}
                    </div>
                  </button>
                ))}

                <div className="pt-4 border-t mt-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total Budget:</span>
                    <span className="text-blue-600">
                      ${currentItinerary.totalCost}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Day {currentDay.day} - {format(currentDay.date, 'EEEE, MMMM d')}
                </CardTitle>
                <p className="text-gray-600 mt-1">{currentDay.summary}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentDay.activities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      isLast={index === currentDay.activities.length - 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  const categoryEmojis: Record<string, string> = {
    adventure: '🏔️',
    cultural: '🎭',
    culinary: '🍴',
    nature: '🌲',
    shopping: '🛍️',
    nightlife: '🎉',
    relaxation: '🧘',
    historical: '🏛️',
  };

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
          {activity.startTime || ''}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-300 my-2" />}
      </div>

      {/* Activity Content */}
      <div className="flex-1 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{categoryEmojis[activity.category]}</span>
                <h4 className="font-semibold text-lg">{activity.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-blue-600">
                ${activity.cost.amount}
              </div>
              <div className="text-xs text-gray-500">{activity.cost.category}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
            <div>📍 {activity.location.name}</div>
            <div>⏱️ {activity.duration} min</div>
            <div>🏷️ {activity.category}</div>
          </div>

          {activity.personalityMatch && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Why this activity: </span>
                {activity.personalityMatch}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
