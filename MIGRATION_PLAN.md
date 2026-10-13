# Migration Plan: Clerk → Teable-Based Authentication

## Current State Analysis

### Current Clerk Integration
- **Frontend**: `@clerk/react` v6.17.8, ClerkProvider in `main.tsx`, SignIn component in `LoginPage.tsx`
- **AuthProvider** (`src/hooks/useAuth.tsx`): Uses `useClerkAuth()` + `useUser()` hooks, syncs with backend `/api/me`
- **Backend** (`api/auth/service.ts`): JWT parsing from Clerk session cookies/headers, no proper token verification
- **API Routes**: `/api/auth/login`, `/api/auth/logout`, `/api/me`, `/api/prompts/execute` all require Clerk auth

### Teable Current Schema (from TEABLE_TABLES)
- **Clients** (`tblEwplxQKUmq9oDHki`) - Core client table with `CLIENT_USERS` field for auth mapping
- **Questionnaire Responses** - For onboarding data
- **Content Strategies/Calendar/Assets** - Content management
- **Approval Activity/Leads/Social Accounts** - Workflow tables

### Teable Auth Capabilities (Per Documentation)
- **Token-authenticated API access** (PAT) - server-side only
- **Account lookup** via API
- **No documented end-user authentication flow** (no built-in registration, login, password reset, session management)
- **No built-in password hashing, session tokens, or email verification**

### Teable Limitations for End-User Auth
1. **No native registration flow** - no signup API
2. **No password hashing** - would need custom implementation
4. **No session management** - no session tokens, refresh tokens, or cookie handling
5. **No password recovery** - no "forgot password" flow
6. **No email verification** - no email confirmation flow
7. **No rate limiting** on auth endpoints
7. **No MFA/2FA support**
8. **No audit logging** for auth events

## Migration Decision

**Teable alone cannot provide complete end-user authentication.** The recommendation is:

### Option A: Hybrid Approach (Recommended)
- **Keep Clerk for authentication** (registration, login, password reset, email verification, sessions)
- **Use Teable for data storage and authorization** (client membership mapping, tenant isolation)
- **Migration**: Remove Clerk from frontend but keep as auth provider

### Option B: Custom Auth Layer on Teable
- Build complete auth system using Teable as user store
- Requires: password hashing (bcrypt), JWT tokens, refresh tokens, cookie management, email service, rate limiting, CSRF protection
- **High effort**, **high maintenance**, **reinventing auth**

### Recommendation: Option A (Hybrid)
**Keep Clerk as auth provider, Teable as data/authorization layer.** This:
- ✅ Leverages Clerk's battle-tested auth (registration, login, password reset, email verification, MFA, sessions)
- ✅ Keeps Teable PAT server-side only
- ✅ Maintains tenant isolation via `ClientMembership` mapping
- ✅ Minimal code changes (remove frontend Clerk components, keep backend verification)
- ✅ Aligns with "avoid unnecessary services" - Clerk is necessary for auth

## Migration Plan: Clerk → Teable-Based Data Layer (Keep Clerk for Auth)

### Phase 0: Audit & Cleanup (Current State)
- [x] Clerk integrated in frontend (`ClerkProvider`, `SignIn`, `useAuth`, `useUser`)
- [x] Backend JWT parsing (needs proper Clerk `verifyToken` with secret key)
- [x] `/api/auth/login`, `/api/auth/logout`, `/api/me` routes exist
- [x] `getAuthenticatedUser` parses JWT (needs proper `clerkClient.verifyToken`)
- [ ] **Remove `ClerkProvider` from `main.tsx`** → Replace with custom auth context
- [ ] **Remove `@clerk/react` from `LoginPage`** → Replace with custom login form
- [ ] **Remove `SignedIn`/`SignedOut` from `App.tsx`** → Use `isAuthenticated` from custom auth

### Phase 1: Sales Page (Week 1)
- Public landing page with pricing
- Payment integration (Stripe recommended)
- No auth required

### Phase 2: Custom Auth Context + Teable User Records (Week 2-3)
1. **Create `Users` table in Teable** (or extend `Clients`):
   - `user_id` (Formula: RECORD_ID())
   - `email` (Email, unique)
   - `password_hash` (Long Text, bcrypt)
   - `name` (Single Line Text)
   - `status` (Single Select: PENDING_VERIFICATION, ACTIVE, SUSPENDED)
   - `email_verified` (Checkbox)
   - `email_verification_token` (Long Text)
   - `password_reset_token` (Long Text)
   - `password_reset_expires` (Date Time)
   - `created_at`, `updated_at` (Created/Modified Time)

2. **Create `User Sessions` table in Teable**:
   - `session_id` (Formula: RECORD_ID())
   - `user_id` (Link → Users)
   - `session_token` (Long Text, hashed)
   - `expires_at` (Date Time)
   - `created_at`, `ip_address`, `user_agent`

3. **Implement server-side auth routes**:
   - `POST /api/auth/register` - Create user, hash password, send verification email
   - `POST /api/auth/login` - Verify password, create session, set HttpOnly cookie
   - `POST /api/auth/logout` - Delete session, clear cookie
   - `POST /api/auth/verify-email` - Verify token, activate user
   - `POST /api/auth/forgot-password` - Generate reset token, send email
   - `POST /api/auth/reset-password` - Verify token, hash new password
   - `GET /api/auth/me` - Validate session, return user + membership

4. **Frontend Auth Context** (`useAuth`):
   - `isAuthenticated`, `isLoading`, `user`, `membership`
   - `login(redirectUrl)`, `logout()`, `refreshProfile()`
   - No Clerk dependency

### Phase 3: Progressive Onboarding (Week 4-5)
- Reuse existing `OnboardingFlow`, `QuestionnaireWizard`, `workshopContentContext`
- Add `Users.questionnaire_status`, `questionnaire_revision`, `onboarding_completed_at`
- Save answers incrementally to `Questionnaire_Responses` (linked to User)

### Phase 4: Sync & Context Versioning (Week 5-6)
- Add `Users.workshop_context` (Long Text JSON)
- Add `Users.context_revision` (hash of context)
- `POST /api/sync` - rebuild context, identify stale generations, allow review before overwrite

### Phase 5: 30-Day Strategy & Calendar (Week 7-9)
- Strategy rationale dashboard
- 30-day calendar grid with day cards
- Day modal with content + advanced image prompt
- P01 execution for strategy generation (reusing existing prompt library)

### Phase 6: Demo/Production States (Week 10)
- Replace demo banner with helpful onboarding
- Clear loading/empty/error/saving/success states
- Demo mode clearly labelled

## Required Teable Tables (New)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `Users` | End-user accounts | email, password_hash, status, email_verified |
| `User Sessions` | Session management | user_id, session_token_hash, expires_at |
| `Email Verification Tokens` | Email verification | user_id, token, expires_at |
| `Password Reset Tokens` | Password recovery | user_id, token, expires_at |
| `Email Log` | Audit trail | to, subject, template, status, sent_at |

## Environment Variables (New)

```env
# Auth
BCRYPT_ROUNDS=12
SESSION_SECRET=your-secure-random-string
SESSION_COOKIE_NAME=session
SESSION_MAX_AGE=2592000  # 30 days
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1

# Email (use existing provider or add)
SENDGRID_API_KEY=...
RESEND_API_KEY=...
FROM_EMAIL=noreply@yourdomain.com

# Existing (keep)
TEABLE_API_BASE=https://app.teable.ai/api
TEABLE_BASE_ID=bseagIh2WI3tU9zIvKm
TEABLE_API_TOKEN=...
GEMINI_API_KEY=...
```

## Security Considerations

1. **Password Hashing**: bcrypt with 12+ rounds
2. **Session Tokens**: cryptographically random, stored hashed in Teable
3. **Cookies**: HttpOnly, Secure, SameSite=Lax, path=/
3. **CSRF**: Double-submit cookie pattern or SameSite=Strict
4. **Rate Limiting**: 5 req/min on auth endpoints per IP
5. **Email Verification**: Required before login
6. **Password Reset**: Single-use tokens, 1-hour expiry
7. **Teable PAT**: Server-side only, never in frontend bundle

## Migration Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Clerk removal breaks existing users | Medium | High | Run both auth systems in parallel during transition |
| Teable API rate limits | Low | Medium | Implement caching, batch operations |
| Email delivery failures | Medium | High | Use reputable provider (SendGrid/Resend), retry logic |
| Session hijacking | Low | High | HttpOnly cookies, short expiry, rotation |
| Password leaks | Low | Critical | bcrypt 12+, never log passwords |

## Rollback Plan

If Teable-based auth has issues:
1. Re-enable `ClerkProvider` in `main.tsx`
2. Restore `LoginPage` with `SignIn` component
3. Re-enable `SignedIn`/`SignedOut` in `App.tsx`
4. Point `getAuthenticatedUser` back to Clerk verification

---

## Next Steps

1. **Create Teable `Users` and `User Sessions` tables** (using Teable UI)
2. **Update `TEABLE_TABLES` and `TEABLE_FIELDS`** with new table IDs
3. **Implement bcrypt password hashing utility**
4. **Build auth API routes** (`/api/auth/register`, `/login`, `/logout`, `/me`, `/verify-email`, `/forgot-password`, `/reset-password`)
5. **Create custom `AuthProvider` without Clerk**
6. **Update `LoginPage` with custom form**
7. **Update `App.tsx` to use custom auth state**

---

*This plan preserves the existing Clerk auth for now while building the Teable-based auth layer. Clerk can be fully removed once the custom auth is verified in production.*