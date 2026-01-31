# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd trip-planner
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...your-token-here  # Optional
```

**Get your API key:**
- Anthropic: https://console.anthropic.com/settings/keys
- Mapbox (optional): https://account.mapbox.com/access-tokens/

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Using the App

### Step 1: Take the Personality Quiz
1. Click "Start Planning Your Trip" on the homepage
2. Answer all 44 personality questions (takes ~5 minutes)
3. View your Big Five personality profile with radar chart
4. Click "Continue to Trip Planning"

### Step 2: Enter Trip Details
1. **Destination**: Enter your desired destination (e.g., "Paris, France")
2. **Dates**: Select start and end dates
3. **Budget**: Use slider to set your budget ($100 - $10,000)
4. **Budget Flexibility**: Choose strict, moderate, or flexible
5. **Travel Style**: Solo, couple, family, or group
6. **Interests**: Select activity categories you enjoy
7. Click "Generate Itinerary"

### Step 3: View Your Personalized Itinerary
- Browse day-by-day timeline
- See activities matched to your personality
- Review budget breakdown
- Save or export your itinerary

## Test the App Without AI (Development)

If you don't have an API key yet, you can still test the UI:

1. Complete the personality quiz
2. Fill in trip parameters
3. The API call will fail gracefully with an error message

To test with mock data, you can temporarily modify the API endpoint to return sample data.

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <process-id> /F

# Or use different port
npm run dev -- -p 3001
```

### API Key Issues
- Ensure `ANTHROPIC_API_KEY` is in `.env.local` (not `.env.example`)
- Restart dev server after adding env variables
- Check API key is valid at https://console.anthropic.com

### Personality Quiz Not Showing Results
- Ensure all 44 questions are answered
- Check browser console for errors
- Verify responses are being stored

## Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings > Environment Variables > Add ANTHROPIC_API_KEY
```

### Build for Production
```bash
npm run build
npm start
```

## Project Status

✅ **Completed Features:**
- Personality quiz (BFI-44) with scoring
- Trait-to-preference mapping
- Trip parameters form
- AI-powered itinerary generation
- Interactive itinerary display
- Zustand state management with persistence
- Responsive UI with Tailwind CSS

⏳ **Planned Enhancements:**
- Mapbox integration for interactive maps
- PDF export functionality
- Shareable itinerary links
- User authentication
- Database persistence
- Manual activity editing

## Support

For issues or questions:
1. Check the main README.md for detailed documentation
2. Review error messages in browser console
3. Verify environment variables are set correctly
4. Ensure Node.js 18+ is installed

## Next Steps

1. **Add Real Geocoding**: Integrate Mapbox Geocoding API for destination autocomplete
2. **Implement Maps**: Add interactive maps to itinerary display
3. **PDF Export**: Use jsPDF to generate downloadable itineraries
4. **User Accounts**: Add authentication and save itineraries to database
5. **Refinements**: Add ability to regenerate, edit, or customize itineraries

Enjoy planning your perfect trip! 🌍✈️
