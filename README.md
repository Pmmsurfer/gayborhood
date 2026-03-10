# Gayborhood

A community notice board for gay and queer men, city by city. Starting with West Side LA.

Not a social network. Not a dating app. A bulletin board — think Craigslist meets Reddit, with the aesthetic of a xeroxed zine.

## Tech stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** (utility classes only)
- **Supabase** (database + realtime)
- **Resend** (weekly email digest — wired later)
- **Vercel** (deployment)

## Run locally

```bash
# Install
npm install

# Supabase: copy env and set your project URL + anon key
cp .env.local.example .env.local

# Run migrations (Supabase CLI, or run 001_initial.sql in SQL editor)
supabase db push   # or paste supabase/migrations/001_initial.sql

# Dev server
npm run dev
```

Then open http://localhost:3000 — you'll be redirected to `/la-westside`.

## Project structure

- `src/app/page.tsx` — redirects to `/la-westside`
- `src/app/[city]/page.tsx` — main board (This Week, Board, Missed Connections, etc.)
- `src/app/post/[id]/` — thread view (to be built)
- `src/app/submit/` — post form (to be built)
- `src/app/start/` — start a city (to be built)
- `src/components/` — StickyNav, CityDropdown, EventCard (inline RSVP), PostCard, etc.
- `src/lib/` — supabase client, db helpers, likes (localStorage)
- `src/actions/` — submitRsvp, submitSubscriber, incrementLike

## Design

- **Colors**: `--paper` #F2EBD9, `--ink` #111108, `--faded` #6B6252, `--rule` #C8BCA8, `--brick` #7A2515, links #00008B
- **Fonts**: Bebas Neue (heads, buttons), Courier Prime (body)
- **Layout**: Single column, max-width 680px, 18px padding. No shadows, no border-radius, no gradients.

## Reference mockups

The spec references `gayborhood.html` and `gayborhood_thread.html` as the source of truth for layout and spacing. If you add those files to the repo, use them to match the board and thread views exactly.

---

Legacy static site files in the repo root (`index.html`, `styles.css`, `script.js`) are from a different concept and are not used by the Next app.
