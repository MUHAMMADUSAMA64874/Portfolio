# Muhammad Usama — Portfolio

Interactive portfolio for a Full-Stack & Automation Engineer. Everything the owner has
built lives here: live client sites, staging previews, local builds, a restored web
archive, and credentials.

## Non-negotiable rules

These came from the owner directly and should not be relaxed:

1. **Show all the work.** There is a large body of work and every piece of it belongs on
   the page — including staging builds, local-only projects, and sites that have since
   gone offline. Never trim the archive to make it look curated.
2. **Never label a dead link live.** Each project carries a `status` that reflects a real
   check: `live`, `staging`, `local`, `archive`, `github`, or `down`. Every status is
   shown with the date it was verified.
3. **One contact address.** `tahir12721@gmail.com`, everywhere, always.
4. **No security theatre.** The old password gate, session HUD, right-click/F12 blockers
   and copy guards were removed on 2026-10-28. Do not reintroduce them.

## Current inventory

- 93 entries total: 37 live client sites, 7 staging, 31 local builds, 1 archive, 15 offline, 2 credentials
- 9 featured case studies, the rest in the filterable archive
- Links verified 1 November 2026 (per-project `verified`, else `meta.lastAudit` in `js/data.js`)

## Structure

- `js/data.js` — single source of truth for projects, statuses, stats and copy
- `js/app.js` — home page rendering, archive filters/search, project modal, cursor, tilt, reveals, theme
- `js/mouse.js` — the boxing-mouse guide (sprites in `assets/mouse/`)
- `css/site.css` — design system for the home page and case-study pages (dark-first, lime + violet)
- `js/workflows-data.js` + `n8n-hub.html` — the automation hub (sanitised: no credentials, private hosts or captured run data)
- `profile.html` / `cv.html` — long-form profile and printable CV (`Muhammad-Usama-CV.pdf` is printed from `cv.html`)
- `equinix/`, `menucanvas/`, `caybookme/`, `dragon/` are local-only and git-ignored

## Adding a project

Append an object to `projects` in `js/data.js`:

```js
{
  id: 'unique-id',              // also the thumbnail key
  title: 'Project Name',
  category: 'WordPress & CMS',  // must be in `categories`
  status: 'live',               // must be in `statusMeta`
  role: 'What you did',
  summary: 'One or two plain sentences.',
  tech: ['WordPress', 'PHP'],
  image: 'assets/images/name.webp',
  link: 'https://example.com/',
  linkLabel: 'Visit live site'
}
```

Then add `assets/images/thumbs/<id>.webp` (800×520) — the archive resolves thumbnails by
the image filename if `thumb` is not set. Re-run the audit before shipping:

```bash
node scripts/audit-data.mjs   # duplicate ids, missing files, bad statuses
```

## Run locally

```bash
node start-server.mjs   # http://127.0.0.1:3300/
```

## Built with

HTML, CSS, plain JavaScript, Three.js and GSAP.
