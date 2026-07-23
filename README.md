# Weather Intelligence Dashboard

A modern, responsive, precision-designed meteorological analysis web application. The platform provides real-time atmospheric measurements, dual-gradient condition banners, rules-based intelligence alerts, interactive 7-day temperature trends, and modular forecasts.

## Key Features

- **Automated Geocoding & Fetching**: Resolves city names into precise global latitude/longitude coordinates instantly using the Open-Meteo Geocoding API, then requests tailored weather forecasts.
- **Dynamic Context Styling**: Adapts card color schemes, typography, and accent rings automatically based on current weather codes (sunny, foggy, rainy, snowy, or thunderous conditions).
- **Rule-Based Smart Insights**: Evaluates immediate and weekly forecasts to generate intelligence recommendations (heat warnings, cold precautions, precipitation guidance, outdoor scheduling potential).
- **Temperature Trend Visualizations**: Displays fully interactive double-gradient charts (Max and Min temperatures, precipitation probabilities) powered by Recharts.
- **Zero Credentials/Keys Required**: Harnesses free public-domain weather infrastructure without needing secret tokens or credit card registration.

## Architecture & Modular File Map

- `/src/types.ts`: Structured, typed data interfaces mapping API endpoints safely.
- `/src/utils/weatherUtils.ts`: Decodes standard meteorological codes, formats human-friendly times, and evaluates logic conditions to output recommendations.
- `/src/components/SearchBar.tsx`: Contextual location search bar complete with quick-click preselected starter shortcuts.
- `/src/components/Recommendations.tsx`: Actionable recommendations card highlighting atmospheric alerts without intrusive borders.
- `/src/components/WeatherChart.tsx`: High-performance charts showing temperature gradients over a 7-day timeline.
- `/src/components/ForecastList.tsx`: Grid visualization mapping out day-by-day conditions.
- `/src/components/WeatherDashboard.tsx`: Dashboard coordinator binding details, cards, and metadata.
- `/src/App.tsx`: Main application conductor managing loading sequences, state updates, and error handling.

## Running the Application Locally

Follow these steps to set up and run the application on your computer:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

### 2. Install Dependencies
In the root directory, install the required node modules:
```bash
npm install
```

### 3. Start Development Server
Boot up the fast local development server:
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:3000` or `http://localhost:5173`).

### 4. Build for Production
To generate optimized production static assets ready for deployment:
```bash
npm run build
```
The compiled build output will be stored in the `/dist` directory.
