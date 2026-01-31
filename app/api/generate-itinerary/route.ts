import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildItineraryPrompt } from '@/lib/ai/prompt-builder';
import { PersonalityScore } from '@/types/personality';
import { TripParameters, Itinerary } from '@/types/trip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripParameters, personalityScores }: {
      tripParameters: TripParameters;
      personalityScores: PersonalityScore;
    } = body;

    // Validate required fields
    if (!tripParameters || !personalityScores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build prompt
    const prompt = buildItineraryPrompt(personalityScores, tripParameters);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse JSON from response
    let aiResponse;
    try {
      // Try to extract JSON if there's extra text
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        aiResponse = JSON.parse(content.text);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content.text);
      throw new Error('Invalid JSON response from AI');
    }

    // Convert dates from strings to Date objects
    const days = aiResponse.days.map((day: any) => ({
      ...day,
      date: new Date(day.date),
      activities: day.activities.map((activity: any) => ({
        ...activity,
        id: activity.id || `activity-${Math.random().toString(36).substr(2, 9)}`,
      })),
    }));

    // Construct complete itinerary
    const itinerary: Itinerary = {
      id: `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tripParameters: {
        ...tripParameters,
        startDate: new Date(tripParameters.startDate),
        endDate: new Date(tripParameters.endDate),
      },
      personalityScores,
      days,
      totalCost: aiResponse.totalCost,
      personalityInsights: aiResponse.personalityInsights,
      createdAt: new Date(),
    };

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate itinerary',
      },
      { status: 500 }
    );
  }
}
