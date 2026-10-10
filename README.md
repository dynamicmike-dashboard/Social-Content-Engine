<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Social Content Engine

A white-label SaaS platform for marketing agencies to create, manage, and approve strategic social media content for their clients.

## Vision

The Social Content Engine evolves from a single-business content tool into a **white-label SaaS platform for marketing agencies, consultants and other service providers**.

Agencies use the platform under their own brand, configure their own AI provider credentials, add and manage their own clients, and determine what they charge their clients.

The platform owner operates the underlying SaaS infrastructure. Each agency operates its own branded service within that platform.

## Current State (Phase 1-2)

- **Dashboard** - Strategy health, time saved estimates, content stats
- **Calendar View** - Monthly grid with posts, platform-specific content
- **Content Detail Modal** - Platform-specific hooks, captions, CTAs, hashtags
- **Approvals Queue** - Filterable list with inline approve/reject/regenerate, Approve All
- **Strategy Overview** - Adjustable distribution (8/6/5/5/6), generate button
- **Business Profile** - 3-level questionnaire (7/16/44 questions)
- **Auth System** - Demo mode + placeholder for real auth
- **Teable Integration** - Service layer with typed field IDs

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Project Structure

```
src/
├── components/       # React components (Dashboard, Calendar, Approvals, etc.)
├── data/             # Data services, mock data, questionnaire data
├── hooks/            # Custom React hooks (useAuth, usePWAInstall)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (strategy, timeSaved, cn)
├── hooks/useAuth.tsx # Auth context with demo/client mode
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

## Documentation

- [Implementation Assessment](IMPLEMENTATION_ASSESSMENT.md) - Current state, gaps, and roadmap
- [Teable Schema Additions](TEABLE_SCHEMA_ADDITIONS.md) - Required database schema changes
- [White-Label Roadmap](IMPLEMENTATION_ASSESSMENT.md#10-future-roadmap-white-label-agency-platform) - Long-term vision

## Environment Variables

See `.env.example` for required variables:
- `TEABLE_API_KEY` - Teable API key
- `GEMINI_API_KEY` - Google Gemini API key
- `TEABLE_BASE_ID` - Teable base ID
- `TEABLE_API_TOKEN` - Teable API token

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Vercel API routes (serverless functions)
- **Database**: Teable with predefined schema (8 tables, 144 fields)
- **Build**: TypeScript strict mode, ESLint, Vite PWA plugin

## White-Label Vision

See [Future Roadmap: White-Label Agency Platform](IMPLEMENTATION_ASSESSMENT.md#10-future-roadmap-white-label-agency-platform) for the complete long-term vision including:
- Multi-tenant architecture
- Agency-managed clients
- Agency-provided LLM credentials
- White-label branding
- Agency pricing control
- Tenant isolation requirements
