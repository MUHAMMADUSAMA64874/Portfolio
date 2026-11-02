# Muhammad Usama — Portfolio

Portfolio of a Full-Stack WordPress Developer & AI Automation Engineer.
Live: https://muhammadusama64874.github.io/Portfolio/

## Rules

1. **Show all the work.** Staging builds, local projects and sites that have gone offline stay listed.
2. **Never label a dead link live.** Every project has a `status` from a real check (`live`, `staging`,
   `local`, `archive`, `down`) and the date it was checked (`verified`, else `meta.lastAudit`).
3. **Label the real platform.** Categories and tech reflect what the live site actually runs
   (checked 2 November 2026 — WordPress, Shopify, Webflow, Squarespace, Next.js, custom).
4. **One contact address.** `tahir12721@gmail.com`, everywhere.
5. **Protect content without hurting recruiters.** `js/protect.js` blocks right-click, dragging and
   selection on screenshots, certificates and photos, and adds a source credit to long copies.
   Contact details and CV text stay selectable and the CV stays printable.
6. **No secrets in the repo.** `js/workflows-data.js` is sanitised (no credentials, hosts or run data).

## Inventory

- 90 projects: 35 live client sites, 7 staging, 30 local builds, 1 archive, 16 offline (+1 practice site)
- 8 certifications with official images and verification links
- Commander Safeguard Web Museum under `commander-safeguard/` (static export, 1,170 archived files)

## Structure

| Path | What it is |
| --- | --- |
| `index.html`, `js/app.js`, `css/site.css` | Home page: hero, work, automation, stack, archive, experience, certifications, about, contact |
| `js/data.js` | Single source of truth: projects, experience, stack, certifications, education |
| `js/mouse.js` | The boxing-mouse guide (sprites in `assets/mouse/`) |
| `js/chrome.js`, `css/chrome.css` | Shared nav, theme, cursor and mouse for sub-pages |
| `profile.html`, `cv.html`, `n8n-hub.html` | Long-form profile, printable CV (`Muhammad-Usama-CV.pdf`), n8n workflow hub |
| `commander-safeguard/` | Restored museum (Ruffle emulator in `commander-safeguard/ruffle/`, MIT/Apache licensed) |
| `js/protect.js`, `js/theme-init.js` | Content protection and pre-paint theme |
| `scripts/serve.mjs` | Local preview server that mirrors GitHub Pages (`/Portfolio/` base) |
| `scripts/audit-data.mjs` | Data audit: duplicate ids, missing files, bad statuses |

Local-only folders (`equinix/`, `menucanvas/`, `caybookme/`, `dragon/`, `.tmp/`) are git-ignored.

## Security

- Every page has a Content Security Policy, a strict referrer policy and no inline scripts.
- The site breaks out of foreign frames (clickjacking).
- `robots.txt` allows search engines and link previews and blocks AI-training crawlers.

## Run locally

```bash
node scripts/serve.mjs   # http://localhost:3300/Portfolio/
```

## Adding a project

Append an object to `projects` in `js/data.js` (`id`, `title`, `category`, `status`, `verified`,
`summary`, `tech`, `image`, `link`), add `assets/images/thumbs/<image-name>.webp` (800×520), then:

```bash
node scripts/audit-data.mjs
```
