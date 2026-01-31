# Trip Itinerary Planner

An AI-powered web application that generates personalized trip itineraries based on Big Five personality traits and user preferences.

## Features

- **Personality Assessment**: 44-question Big Five Inventory (BFI-44) to understand your travel preferences
- **AI-Powered Generation**: Uses Claude 3.5 Sonnet to create detailed, day-by-day itineraries
- **Personalized Recommendations**: Activities matched to your personality profile
- **Interactive Timeline**: Visual day-by-day breakdown with activity details
- **Budget Management**: Stay within your specified budget with cost breakdowns
- **Export & Save**: Save itineraries and export to PDF

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **AI**: Anthropic Claude 3.5 Sonnet API
- **Maps**: Mapbox GL JS (planned)
- **Charts**: Recharts for personality visualization
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Mapbox token (optional, [Get one here](https://account.mapbox.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trip-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Add your API keys to `.env.local`:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
trip-planner/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Landing page
│   ├── personality-quiz/        # BFI-44 assessment
│   ├── trip-params/             # Trip parameters form
│   ├── itinerary/[id]/         # Generated itinerary view
│   └── api/                     # API routes
│       └── generate-itinerary/  # AI generation endpoint
├── components/
│   ├── shared/                  # Reusable UI components
│   ├── personality/             # Quiz components
│   ├── trip-params/             # Parameter forms
│   └── itinerary/               # Itinerary display
├── lib/
│   ├── personality/             # BFI-44 logic & scoring
│   ├── ai/                      # AI prompt builder
│   ├── maps/                    # Mapbox utilities
│   └── export/                  # PDF generation
├── store/                       # Zustand global state
├── types/                       # TypeScript definitions
└── README.md
```

## How It Works

### 1. Personality Assessment
Users complete a 44-question Big Five personality assessment measuring:
- **Openness**: Curiosity, creativity, preference for novelty
- **Conscientiousness**: Organization, goal-orientation, planning
- **Extraversion**: Sociability, energy, assertiveness
- **Agreeableness**: Cooperation, empathy, trust
- **Neuroticism**: Emotional stability, stress management

### 2. Personality-to-Preference Mapping
The app derives travel preferences from personality scores:
- **Activity Pacing**: Relaxed, moderate, or packed schedule
- **Adventure Level**: Safe, moderate-risk, or adventurous
- **Social Preference**: Solitary, small groups, or large groups
- **Planning Style**: Spontaneous, semi-planned, or detailed
- **Activity Variety**: Focused, balanced, or diverse

### 3. Trip Parameters
Users specify:
- Destination
- Travel dates
- Budget (with flexibility level)
- Travel style (solo, couple, family, group)
- Activity interests

### 4. AI Generation
Claude 3.5 Sonnet generates a personalized itinerary:
- Day-by-day activity schedule
- Specific times, durations, and costs
- Locations with addresses and coordinates
- Explanations of personality-activity matches
- Budget-conscious recommendations

### 5. Itinerary Display
Interactive view with:
- Timeline of activities
- Budget breakdown
- Day-by-day navigation
- Activity details and locations
- Save and export options

## Personality Trait Mappings

| Trait | High Score → Travel Preference |
|-------|-------------------------------|
| **Openness** | Diverse activities, cultural immersion, adventurous experiences |
| **Conscientiousness** | Detailed planning, packed schedule, strict budget adherence |
| **Extraversion** | Social activities, large groups, nightlife |
| **Agreeableness** | Cultural experiences, local interactions, cooperative activities |
| **Neuroticism (Low)** | Intensive schedule OK, adventure activities, handles stress well |

## API Endpoints

### POST `/api/generate-itinerary`
Generates a personalized itinerary using Claude AI.

**Request Body:**
```json
{
  "tripParameters": {
    "destination": "Paris, France",
    "destinationCoords": { "lat": 48.8566, "lng": 2.3522 },
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "budget": { "amount": 2000, "currency": "USD", "flexibility": "moderate" },
    "travelStyle": "couple",
    "interests": ["cultural", "culinary", "historical"]
  },
  "personalityScores": {
    "openness": 75,
    "conscientiousness": 60,
    "extraversion": 45,
    "agreeableness": 70,
    "neuroticism": 35
  }
}
```

**Response:**
```json
{
  "itinerary": {
    "id": "itinerary-123",
    "days": [...],
    "totalCost": 1850,
    "personalityInsights": "..."
  }
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### State Management

The app uses Zustand with localStorage persistence:
- Personality scores are saved after quiz completion
- Trip parameters are stored during form filling
- Generated itineraries can be saved for later viewing

### Adding New Activity Categories

1. Update `ActivityCategory` type in `types/personality.ts`
2. Add category to `ACTIVITY_CATEGORIES` in `app/trip-params/page.tsx`
3. Update `categoryEmojis` in itinerary display components
4. Add category logic to `trait-mappings.ts` if needed

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Environment Variables for Production

```env
ANTHROPIC_API_KEY=your_production_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_production_token
```

## Future Enhancements

- [ ] Full Mapbox integration with interactive maps
- [ ] PDF export functionality
- [ ] Shareable itinerary links
- [ ] User authentication and accounts
- [ ] Database persistence (Prisma + PostgreSQL)
- [ ] Manual activity editing
- [ ] Alternative itinerary suggestions
- [ ] Weather-aware scheduling
- [ ] Real-time booking integration

## License

MIT

## Acknowledgments

- **Anthropic Claude** for AI-powered itinerary generation
- **BFI-44** personality assessment framework
- **Next.js** team for the amazing framework
- **Mapbox** for mapping capabilities
