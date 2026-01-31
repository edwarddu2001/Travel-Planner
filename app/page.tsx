'use client';

import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { Card, CardContent } from '@/components/shared/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Trip Planner</h1>
            <nav className="flex gap-4">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                How It Works
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Your Perfect Trip,
            <br />
            <span className="text-blue-600">Powered by Personality</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get AI-generated travel itineraries tailored to your unique personality traits.
            Take our quick Big Five personality assessment and discover trips designed just for you.
          </p>
          <Link href="/personality-quiz">
            <Button size="lg" className="px-8 py-4 text-xl">
              Start Planning Your Trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Trip Planner?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="text-xl font-semibold mb-3">Personality-Driven</h4>
              <p className="text-gray-600">
                Our Big Five personality assessment ensures your itinerary matches your
                travel style, from adventure level to social preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-semibold mb-3">AI-Powered</h4>
              <p className="text-gray-600">
                Powered by Claude AI, we generate detailed, day-by-day itineraries with
                activities perfectly suited to your personality profile.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="text-xl font-semibold mb-3">Interactive Maps</h4>
              <p className="text-gray-600">
                Visualize your trip with interactive maps showing all activities, routes,
                and locations in one beautiful view.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: 'Take the Quiz',
              description: '44 quick questions to understand your personality traits',
            },
            {
              step: 2,
              title: 'Enter Trip Details',
              description: 'Destination, dates, budget, and interests',
            },
            {
              step: 3,
              title: 'AI Generates Itinerary',
              description: 'Our AI creates a personalized day-by-day plan',
            },
            {
              step: 4,
              title: 'Explore & Export',
              description: 'View on map, customize, and export as PDF',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                {item.step}
              </div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Plan Your Perfect Trip?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              It takes just 5 minutes to complete the personality quiz and get started.
            </p>
            <Link href="/personality-quiz">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 Trip Planner. Powered by Claude AI & Mapbox.
          </p>
        </div>
      </footer>
    </div>
  );
}
