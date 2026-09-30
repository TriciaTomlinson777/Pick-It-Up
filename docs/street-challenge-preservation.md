# Street Challenge preservation — September 30, 2026

Source: `cleanup-competition-pilot` at `f210fe5cdde1576c92ab7ec8eaf00e058511b3b1`.
Base: `main` at `d270f2e4bc7e32c3343accc54fe2ddec07cdfb71`.
Full unchanged backup: `archive/street-challenge-pilot-2026-09-30`.
Review branch: `preserve/street-challenge-foundation-2026-09-30`.

## Carried forward

The final changes from six substantive pilot commits were carried forward onto current main:

| Original commit | Contribution |
| --- | --- |
| da7b160 | Email authentication, profiles, callback, Supabase clients, session proxy, SQL and setup instructions |
| b9d71d8 | Profile avatars and upload endpoint |
| d633412 | Navigation and volunteer wording |
| f53b59a | Eight character avatar images |
| 8643d54 | Avatar-save verification, participant home and sign-out |
| 2c4491e | Join-page placeholder |

The preserved pages are `app/street-challenge/page.jsx`, `home/page.jsx`, `profile/page.jsx`, and `join/page.jsx`. Supporting components are `StreetChallengeSignInForm.jsx`, `StreetChallengeProfileForm.jsx`, and `ParticipantSignOutLink.jsx`. Authentication uses `app/auth/callback/route.js`, `lib/supabase/participant-{browser,config,server}.js`, and `proxy.js`. Avatar uploads use `app/api/street-challenge/profile/avatar/route.js`; profile setup uses `scripts/sql/participant_profiles.sql`.

The eight images in `public/` are `Blonde Girl.png`, `Blue Boy.png`, `Blue Hat.png`, `Captain Can (1).png`, `Dog.png`, `Mess Monster.png`, `Mia.png`, and `Purple lady.png`.

Desktop and mobile Header links retain “Join the Movement” → `/street-challenge` and “Make a Difference” → `/volunteer`; the volunteer page heading is “Make a Difference”. Supabase dependencies are pinned, the lockfile is regenerated, and existing Sharp optional dependencies are retained.

## Left out of the integration, retained in the archive

- `5f1fa1`: empty Vercel preview-trigger commit; no file changes.
- `f210fe5`: blog-image rendering fix already present as `9f83d2b` on main, with identical final file content.

The review branch retains main's shop updates, nonprofit messaging, admin photo removal/restoration, and Track It upload validation, recovery, diagnostics and stable image URLs. These files were not replaced with older pilot versions. No branches, participant records, or stored photographs were deleted.

## Fixes added before review

- The SQL revokes both old table-level and column-level permissions. Participants can read only their own profile and update only their display name; avatar columns are server-controlled.
- The avatar endpoint verifies the session, ignores client-supplied owner/path/approval fields, writes only the signed-in user's row through the existing server credential, and rejects foreign origins.
- Each upload gets a unique owner-prefixed storage path. Original pilot paths remain recognized for their owner.
- Home/profile pages sign uploaded pictures only if their paths belong to the signed-in participant and their moderation status is approved.
- Rejected uploads leave the prior avatar unchanged; concurrent photo replacements return a conflict rather than blindly overwriting.
- All previous and failed uploads remain in private storage. Future cleanup is separate work requiring review.

## Validation

- `npm ci --ignore-scripts`: passed.
- `npm run build`: passed, including TypeScript and all four Street Challenge routes.
- `node --experimental-vm-modules --test tests/participant-avatar.test.mjs`: eight regression tests passed using mocked auth, storage/moderation and REST boundaries.
- Disposable PostgreSQL-compatible PGlite database: applied the original pilot SQL, then the updated SQL twice. Verified existing profiles/names survive, avatar-column updates are denied to participants, own-name editing works, cross-user reads/writes are denied, service-role avatar updates work, and the signup trigger still creates profiles. This did not touch the live Supabase project.
- Browser automation could not start its daemon in this execution environment. Mobile appearance and interaction are not verified.

## Before merge or deployment

1. Rerun the updated `scripts/sql/participant_profiles.sql` against the intended test project and verify the public client and server credentials address the same project. Repeat the permission checks there.
2. Review existing pilot upload records because avatar paths and approval statuses were previously participant-writable.
3. Test email code/link delivery, sign-out, display-name persistence, presets, repeated uploads and moderation against the configured test services; check desktop/mobile navigation and cropping.
4. Apply the reviewed permissions update to the production project in coordination with deployment. Until then, this is a draft integration, not a live security fix.

This preserves the account foundation. The join page remains a placeholder; enrollment, scoring, leaderboards, deadlines and anti-cheat are not implemented by this branch.
