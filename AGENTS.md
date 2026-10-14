# AGENTS.md — Social Content Engine

This file contains standing instructions for agents working on this project.

---

## Git Commit and Push Policy

At the end of each development phase or meaningful milestone:

1. **Run verification:** tests, TypeScript checks, production build and any relevant security checks.
2. **Review the changes:** inspect `git diff`, check for unintended changes, and ensure no secrets, API keys, passwords, tokens, or environment files have been committed.
3. **Fix failures:** do not commit or push code that fails required checks. Report any unresolved issue clearly.
4. **Commit when ready:** create a descriptive Git commit identifying the completed phase or milestone.
5. **Push to GitHub:** push the verified commit to the appropriate feature branch or existing working branch. Do not push directly to `main` unless explicitly authorised or that is the established workflow.
6. **Report the outcome:** provide the commit hash, branch, checks performed and their results. Clearly state whether the push succeeded.
7. **Never claim success prematurely:** if a push fails, explain why and leave the local changes intact.

Do not create unnecessary commits for every minor edit. Group related work into coherent, verified milestones.

**Current priority:** complete the authentication deployment-readiness checks before proceeding with live Gemini execution (Part B). Once the code changes are verified and ready, commit and push them to GitHub.

Do not deploy to Vercel, modify production settings, or perform destructive Git operations without explicit authorisation.

One important distinction: pushing to GitHub is not the same as deploying to Vercel. Depending on your Vercel Git integration, a push may trigger a Preview or Production deployment, so OpenCode should report what happened rather than assume.

---

## Project-Specific Instructions

### Red Team Sparring Partner
Load `SKILL_RED_TEAM_SPARRING.md` when reviewing architectural decisions, code patches, or strategic plans. Apply the four lenses: Cynical Architect, Product Pragmatist, Context Detective, and generate 5 sharp questions.

### Current Project State
- **Phase 1 (Sales Page):** ✅ Complete
- **Phase 2 (Teable Auth):** ✅ Complete — Clerk removed, Teable-based auth implemented
- **Phase 3 (Progressive Onboarding):** 🔄 Next
- **Phase 4 (Sync & Context Versioning):** ⏳ Pending
- **Phase 5 (30-Day Strategy/Calendar):** ⏳ Pending
- **Phase 6 (Demo/Production States):** ⏳ Pending

### Authentication Architecture
- **Clerk:** REMOVED — replaced with Teable-based auth
- **Auth Provider:** Custom `AuthProvider` using `/api/auth/me`
- **API Routes:** `/api/auth/register`, `/login`, `/logout`, `/me`, `/verify-email`, `/forgot-password`, `/reset-password`, `/signup`
- **Password Hashing:** bcrypt (12 rounds) in `src/lib/auth/password.ts`
- **Session:** HttpOnly, Secure, SameSite=Lax cookies, 30-day expiry
- **Teable Tables Needed:** `Users`, `User Sessions`

### Deployment Constraints
- **Never** deploy to Vercel without explicit authorisation
- **Never** commit secrets, API keys, passwords, or tokens
- **Never** push code that fails tests/TypeScript/build
- Push to GitHub ≠ deploy to Vercel (report what happens)

### Verification Checklist (before commit/push)
- [ ] `npx vitest run` → 78/78 tests passing
- [ ] `npx tsc --noEmit --skipLibCheck` → 0 errors
- [ ] `npm run build` → success
- [ ] `git diff` reviewed — no secrets, no unintended changes
- [ ] Commit message describes the phase/milestone

---

## Active Files to Reference

| File | Purpose |
|------|---------|
| `MIGRATION_PLAN.md` | Clerk → Teable auth migration plan |
| `SKILL_RED_TEAM_SPARRING.md` | Red team review framework |
| `P5_CHECKPOINT_REPORT.md` | Security audit findings |
| `IMPLEMENTATION_ASSESSMENT.md` | Current state analysis |
| `TEABLE_SCHEMA_ADDITIONS.md` | Required Teable schema changes |
| `PROMPT_LIBRARY_PLAN.md` | Phase 2 prompt library roadmap |

---

*This file is the single source of truth for agent instructions on this project. Update it when policies or project state change.*