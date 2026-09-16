# DKSI Architecture & Data Flow

## Repo
- Local: C:\Users\media\duakawan-website
- Remote: https://github.com/dksimedia/WEB-DKSI.git (branch main)
- Port: 3000

## Foldering
```
frontend/
  index.html
  css/ style.css, responsive.css, input.css, tailwind.min.css
  js/ script.js, modules/
  cms/ cms-data.js      <- single source of truth CMS (jangan duplikat ke backend/)
  assets/logo/          <- main.png, secondary-light/dark.png, dksi-logo.svg
  assets/clients/       <- 12-20 logo klien (max 400px longest side)
backend/
  server.js             <- Express + compression + STATIC_OPTS cache
  admin/ admin.html, admin.css, admin.js, cms-data.js (sync dengan frontend/cms/)
  contacts.json         <- file-based inquiry storage
  package.json          <- express 4.19.2 + compression 1.8.2
docs/                   <- file ini
```

## CMS Data
- frontend/cms/cms-data.js = single source of truth (backend/admin/cms-data.js sync)
- Struktur: branding{mainLogo, secondaryLight, secondaryDark}, hero{}, services[], solutions{infra,edu,ai}, portfolio{}, trusted[]{name, subtitle, logo}, company{}
- JS: window.DKSI_DATA + fallbackData di script.js (jaga sync)

## Backend Logic
- server.js: express.json, compression(), static maxAge 7d immutable (css/js/png/svg), html must-revalidate, etag/lastModified true
- API: POST /api/contact (honeypot anti-spam), GET /api/admin/contacts, GET /api/health
- Static: /admin -> backend/admin, / -> frontend, GET / redirect -> /admin/admin.html

## Admin Panel
- URL: http://localhost:3000/admin/admin.html
- Creds dev: admin@dksi.co.id / dksi2026
- Fitur: label Bahasa Indonesia, onboarding modal, icon/media picker, live preview, grouping menu non-IT friendly

## Theme/Logo Switch
- updateLogos via _brandingCache, auto-switch dark/light tanpa refresh (jangan hard reload)

