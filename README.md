# Vantage

**Location Intelligence Platform**

> AI-powered multi-agent platform that transforms "I want to open a business" into a complete location intelligence report — with market analysis, revenue projections, competitor gaps, and demographic heatmaps — in 60 seconds.

**Built at Hack@Brown 2026** | Jan 31 – Feb 1 | By TEAM CMYK: Candy Xie, Karen Yang, Michael Rostom, Yolanda Hu

---

## The Problem

Site selection is the #1 factor in retail success, but:
- Enterprise tools cost **$10K–$50K+/year**
- Small business owners are priced out
- **70% of consumers** say location influences their decision to visit
- Wrong location = business death

**Market Size:** Location Intelligence is a **$19B market** growing 15% annually. Site selection alone is **$6B+**.

---

## The Solution

Vantage is a **multi-agent system** that generates a complete **Business Opportunity Package**:

- **Location Analysis** — Scored recommendations with confidence levels
- **Competitor Intelligence** — Live data from Google Places with gap analysis
- **Revenue Projections** — Conservative/Expected/Optimistic scenarios with Visa API merchant data integration
- **Demographic Heatmaps** — Population density, income, and age distribution overlays
- **Business Toolkit** — Checklist, permits, lease intelligence
- **Instant Demo Results** — Pre-cached queries for common scenarios (boba shop, coffee shop, bakery)
- **Enhanced Loading Experience** — Real-time progress messages showing agent activity

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                           │
│  "Boba shop in NYC, targeting students, $8.5K rent budget"  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FLASK HTTP BRIDGE                        │
│  • Checks demo query cache (instant results)                │
│  • Parallel processing (ThreadPoolExecutor)                  │
│  • Dispatches to specialist agents                          │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ AGENT 2:        │ │ AGENT 3:        │ │ AGENT 4:        │
│ LOCATION SCOUT  │ │ COMPETITOR      │ │ REVENUE         │
│                 │ │ INTEL           │ │ ANALYST         │
│ • NYC datasets  │ │ • Google Places │ │ • Revenue calc  │
│ • Score areas   │ │ • Ratings/reviews│ │ • Break-even    │
│ • Demographics  │ │ • Gap analysis  │ │ • Visa API      │
│ • Transit data  │ │ • Saturation    │ │ • Projections   │
│ • AWS S3 data  │ │                 │ │ • Confidence    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FLASK HTTP BRIDGE                        │
│  • Aggregates agent responses                               │
│  • Transforms data for frontend                             │
│  • Serves location results with metrics                     │
│  • Returns cached flag for demo queries                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              REACT FRONTEND + GOOGLE MAPS                   │
│  • Enhanced loading animation with progress messages         │
│  • Interactive map with heatmap overlays                    │
│  • Location scoring dashboard                               │
│  • PDF report generation                                    │
│  • Real-time comparison view                                │
│  • Instant results toast for cached queries                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              FULL BUSINESS OPPORTUNITY PACKAGE              │
└─────────────────────────────────────────────────────────────┘
```
---

## Tech Stack

| Layer | Technology | Implementation Notes |
|-------|------------|---------------------|
| **Agent Framework** | uagents (Python) | Configured for Agentverse deployment with environment variables |
| **Backend API** | Flask 
| **Data Processing** | Python (geopy, requests) | AWS S3 integration (boto3) with local file fallback |
| **Frontend** | React + TypeScript + Vite | Enhanced loading states, Framer Motion animations |
| **Styling** | Tailwind CSS + Framer Motion | Responsive design with dark mode support |
| **Maps** | Google Maps Platform + Deck.gl | Heatmap overlays with neighborhood boundaries |
| **Data Sources** | NYC Open Data, Census ACS, RentCast API, Visa Merchant Search API 
| **PDF Export** | html2pdf.js | Full report generation with proper formatting |
---

## Key Features

### Transparent Scoring
Every metric includes:
- **Confidence score** (HIGH/MEDIUM/LOW)
- **Data source citation** (Census ACS, Google Places, NYC Open Data, Visa API)
- **Assumptions disclosed**

### Interactive Map Visualization
- Population density heatmaps
- Median age distribution overlays
- Median income distribution overlays
- Location markers with scoring
- Collapsible sidebars for layer control
- Real-time heatmap updates based on analysis results

### Real-Time Analysis
Change parameters and re-run analysis:
- Adjust budget → New locations unlock
- Change target demographic → Different neighborhoods score higher
- Dynamic agent-based scoring
- Parallel processing for faster results

### Enhanced User Experience
- **Loading Animation**: Shows "Vantage is analyzing 262 neighborhoods..." with progressive agent messages
- **Instant Demo Results**: Pre-cached queries return in <100ms with special toast notification
- **Minimum Loading Time**: 10-second minimum ensures users see the analysis process
- **Progress Tracking**: Real-time progress bar with agent activity messages

### Comprehensive Reports
- PDF export with full location analysis
- Revenue projections (Conservative/Moderate/Optimistic)
- Competitor gap analysis
- Demographic breakdowns
---

## Output: Business Opportunity Package

```
╔═══════════════════════════════════════════════════════════════╗
║  VANTAGE OPPORTUNITY REPORT                                   ║
╠═══════════════════════════════════════════════════════════════╣
║  #1 RECOMMENDATION: EAST VILLAGE                              ║
║  Overall Score: 92/100 | Confidence: HIGH                     ║
║                                                               ║
║  SCORE BREAKDOWN                                              ║
║  ├─ Foot Traffic:     88/100  (HIGH confidence)               ║
║  ├─ Transit Access:   95/100  (HIGH confidence)               ║
║  ├─ Elite Density:    85/100  (MEDIUM confidence)             ║
║  ├─ Net Disposable:   78/100  (MEDIUM confidence)             ║
║  └─ Competition Gap:  79/100  (MEDIUM confidence)              ║
║                                                               ║
║  COMPETITOR INTELLIGENCE (Live Data)                          ║
║  Found 2 competitors — Gap: Limited seating, older storefronts ║
║                                                               ║
║  REVENUE PROJECTION                                           ║
║  Conservative: $28,500/mo | Moderate: $42,200/mo              ║
║  Optimistic: $58,800/mo | Break-even: 6 months               ║
║  Data Source: Industry-standard benchmarks                    ║
║                                                               ║
║  [Download PDF] [Compare Locations] [View Map]                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Maps API key

### Backend Setup

```bash
# Navigate to project root
cd hackbrown

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (optional)
# Create backend/.env with:
# GOOGLE_PLACES_API_KEY=your_key
# VISA_API_USER_ID=your_user_id
# VISA_API_PASSWORD=your_password

# Data files are loaded from:
# - backend/agents/data/

# Run Flask server
python backend/http_server.py
```

The backend server will run on `http://localhost:8020` (or PORT from environment)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
# VITE_API_URL=http://localhost:8020

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

### Full Stack Development

1. Start the backend server in one terminal
2. Start the frontend dev server in another terminal
3. Open `http://localhost:5173` in your browser

**Demo Queries for Testing:**
- "boba tea shop" + "students" + $8,500 → Instant cached result
- "coffee shop" + "professionals" + $12,000 → Instant cached result
- "bakery" + "families" + $6,000 → Instant cached result
- Any other query → Real-time analysis with enhanced loading animation

---

## Project Structure

```
hackbrown-2/
├── backend/
│   ├── agents/
│   │   ├── 0-create-database.py    # Database initialization
│   │   ├── 1-orchestrator.py       # Main orchestrator agent
│   │   ├── 2-location_scout.py      # Location scoring agent
│   │   ├── 3-competitor_intel.py   # Competitor analysis agent
│   │   ├── 4-revenue_analyst.py     # Revenue projection agent
│   │   ├── visa_api_service.py     # Visa API integration
│   │   └── data/                    # Agent data files (fallback)
│   ├── data/                        # Data files (GeoJSON, JSON)
│   ├── data_service.py              # Data fetching service
│   ├── aws_data_service.py          # AWS S3 data service
│   └── http_server.py               # Flask API bridge
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # React components
│   │   │   ├── contexts/        # React contexts
│   │   │   └── App.tsx          # Main app component
│   │   ├── services/            # API service
│   │   └── utils/               # Utilities (PDF export)
│   ├── public/
│   │   └── data/                # Public data files
│   └── package.json
├── app.py                           # Flask entrypoint
├── requirements.txt
└── Procfile                         # Deployment config
```

---

## Data Sources

- **NYC Open Data** — Business licenses, pedestrian counts, subway stations
- **Google Places API** — Live competitor data (ratings, reviews, hours)
- **Census ACS** — Demographics, income distribution
- **RentCast API** — Rent price estimates
- **Visa Merchant Search API** — Merchant spending insights (sandbox)
- **NYC Neighborhood GeoJSON** — Neighborhood boundaries and shapes
---

## API Endpoints

### GET /submit
Submit a location analysis request.

**Query Parameters:**
- `type` (string): Business type (e.g., "Boba Tea Shop", "coffee shop", "bakery")
- `demo` (string): Target demographic (e.g., "students", "professionals", "families")
- `budget` (number): Monthly rent budget

**Response:**
```json
{
  "status": "completed",
  "progress": 100,
  "agent_statuses": [...],
  "locations": [
    {
      "id": 1,
      "name": "Location Name",
      "score": 87,
      "status": "HIGH",
      "metrics": [...],
      "competitors": [...],
      "revenue": [...],
      "rent_price": 8500,
      "address": "123 Main St",
      "demographics": {...},
      "magic_number": 87
    }
  ],
  "cached": false  // true if result came from demo cache
}
```