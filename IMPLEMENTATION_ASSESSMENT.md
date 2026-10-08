# Social Content Engine - Implementation Assessment

## Current State Analysis

### Architecture
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Vercel API routes (serverless functions)
- **Database**: Teable with predefined schema (8 tables, 144 fields)
- **State Management**: React Context (Auth) + Local Component State
- **Build**: TypeScript strict mode, ESLint, Vite PWA plugin

### Current Functionality
1. **Dashboard** - Shows stats, strategy distribution, this week's content
2. **Calendar View** - Monthly grid with posts, click to open detail
3. **Content Detail Modal** - Platform tabs (FB, IG, LI, TW), inline editing, approval actions
4. **Approvals Queue** - Filterable list with inline approve/reject/regenerate
5. **Strategy Overview** - Adjustable distribution (8/6/5/5/6), generate button
6. **Business Profile** - 6-section questionnaire (28 questions total)
7. **Auth System** - Demo mode + placeholder for real auth
8. **Teable Integration** - Service layer with typed field IDs

### Data Model (Types)
- **ContentPost** - Full post with platform-specific content via `platformContent`
- **PlatformContent** - Per-platform hook, caption, CTA, hashtags, visual concept
- **Strategy** - 5 strategies with colors, percentages, objectives
- **CTAType** - KEYWORD, DIRECT_LINK, CONVERSATION, ENGAGEMENT
- **ContentStatus** - 8 statuses with valid transitions

### Demo Mode
- 30 mock posts with varied strategies/statuses
- Platform content generated but **mostly identical across platforms**
- Mock questionnaire, client profile, generation jobs
- Demo mode toggle in AuthContext

### API Routes (Vercel)
- `/api/me` - Auth + client membership
- `/api/client/profile` - GET/PATCH
- `/api/questionnaire` - GET, PATCH, POST /submit
- `/api/calendar` - Month-filtered posts
- `/api/content/:id` - GET, PATCH
- `/api/content/:id/approve|reject|regenerate` - Status transitions
- `/api/generation-jobs/:id` - Job progress

---

## Critical Gaps vs Requirements

### 1. Demo vs Client Mode Separation ❌
- **Current**: Demo mode shows mock data everywhere; client mode falls back to demo fixtures
- **Required**: Clear separation; client mode shows **empty states** when no data; demo never mutates real data

### 2. Platform-Specific Content ❌
- **Current**: Platform tabs exist but show **nearly identical content** (only CTA varies by strategy)
- **Required**: Truly distinct content per platform (hook, caption, format, dimensions, hashtags)

### 3. Hook System ❌
- **Current**: Primary hook + 3 string alternatives (no reasons, no approach types)
- **Required**: Primary + 3 alternatives with **approach type**, **reason**, **selection**, **per-platform**

### 4. CTA System ⚠️
- **Current**: KEYWORD, DIRECT_LINK, CONVERSATION, ENGAGEMENT types defined but **minimal UI**
- **Required**: Full CTA configuration per platform with reasons, validation

### 5. Approve All ❌
- **Current**: Individual approve/reject only
- **Required**: "Approve All" with count confirmation, eligibility check, audit trail

### 6. Strategy Calculations ⚠️
- **Current**: Simple count/percentage, rounding can exceed 100%
- **Required**: Proper rounding (largest remainder), handle zero denominator

### 7. Strategy Health ❌
- **Current**: Not implemented
- **Required**: 7 checks with actionable summary

### 8. Time Saved Calculation ❌
- **Current**: Not implemented
- **Required**: Configurable assumptions, MXN support, labeled as estimate

### 8. Sales Intro ❌
- **Current**: Not implemented
- **Required**: Animated landing with specific copy, Skip/Replay, reduced motion

### 9. Copy/Export ❌
- **Current**: Only "Copy Caption" button
- **Required**: Copy full post, hashtags, CTA; export monthly content

### 10. TikTok Platform ⚠️
- **Current**: Type defined but **not in SOCIAL_CHANNELS array**, no tab
- **Required**: Full integration with proper color scheme

### 11. Multi-Tenancy ⚠️
- **Current**: Auth service exists but **not enforced** in all API routes
- **Required**: Every API request validates client ownership

### 12. Client Empty States ❌
- **Current**: Shows demo data in client mode
- **Required**: "Your first month is getting started..." messaging

---

## Implementation Priority

### Phase 1: Core Separation & Data Integrity (Week 1)
1. Demo/Client mode separation with empty states
2. Multi-tenancy enforcement in all API routes
3. Fix strategy percentage calculations
4. TikTok platform integration

### Phase 2: Content & Approval Workflows (Week 1-2)
5. Platform-specific content generation
6. Hook system with alternatives + reasons
7. CTA system enhancement
8. Approve All functionality
8. Strategy Health calculation

### Phase 3: Premium Features (Week 2)
9. Time Saved calculation with MXN
10. Sales Intro animated landing
11. Copy/Export functionality
11. Strategy Health UI
12. Demo/Client mode polish

---

## Technical Debt & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Teable API token not configured | Blocks live mode | Use demo mode for workshop; document env vars |
| Auth provider not integrated | No real client login | Demo mode works without auth; document integration points |
| Strategy percentages rounding | Can show 101% | Implement largest remainder method |
| Platform content duplication | Undermines core value | Generate truly distinct content per platform |
| Missing "Approve All" | Workflow incomplete | Implement with idempotent bulk API |

---

## Files to Modify (Priority Order)

### Types & Data
- `src/types/index.ts` - Enhanced types for hooks, CTA, platform content
- `src/data/dataService.ts` - Platform-specific mock data, empty states
- `src/utils/strategy.ts` - Percentage calculations, health checks
- `src/utils/timeSaved.ts` - New file for time saved calculations

### Components
- `src/components/ContentDetailModal.tsx` - Hook selector, CTA config, platform content
- `src/components/WhyThisPostPanel.tsx` - Why This Hook/CTA tabs
- `src/components/Approvals.tsx` - Approve All button, bulk actions
- `src/components/CalendarView.tsx` - TikTok in legend, empty states
- `src/components/Dashboard.tsx` - Strategy health, time saved, empty states
- `src/components/Approvals.tsx` - Approve All button
- `src/components/SalesIntro.tsx` - **New** animated landing
- `src/components/HookSelector.tsx` - **New** reusable hook picker
- `src/components/CTAConfig.tsx` - **New** CTA configuration
- `src/components/ExportActions.tsx` - **New** copy/export dropdown

### Auth & Routing
- `src/hooks/useAuth.tsx` - Demo/client mode sync, empty state triggers
- `src/App.tsx` - Sales intro route, mode detection
- `src/components/Layout.tsx` - Demo banner, client context

### API Routes
- `api/routes/content/[contentId]/route.ts` - Platform-specific updates
- `api/routes/approvals/bulk/route.ts` - **New** Approve All endpoint
- `api/routes/calendar/route.ts` - Client-scoped filtering
- All routes - Tenant ownership validation

### Config
- `vite.config.ts` - PWA manifest updates
- `.env.example` - Document all required vars