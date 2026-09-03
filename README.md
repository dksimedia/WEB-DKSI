
## Struktur Folder

```
duakawan-website/
├── index.html                  # Public website (frontend)
├── README.md                   # Dokumentasi ini
├── package.json                # Tailwind v4 dev deps
│
├── assets/                     # Logo & media statis
│   └── logo/
│       ├── dksi-logo.svg
│       └── dksi-logo-white.svg
│
├── css/                        # Frontend styles
│   └── style.css               # Design tokens + dark mode variables
│
├── js/                         # Frontend logic
│   └── script.js               # Theme, navbar, CMS bridge, renderers
│
└── cms/                        # Admin CMS (terpisah dari frontend)
    ├── admin.html              # Dashboard layout (sidebar + topbar + content)
    ├── admin.css               # Admin dashboard styling
    ├── admin.js                # Auth, navigation, editor logic
    └── cms-data.js             # Data layer (localStorage + defaults + sync)
```

---

## Quick Start

### Public Website
```text
1. Buka index.html di browser
2. Website menampilkan Company Profile DKSI
3. Untuk dark mode: klik icon bulan di navbar
```

### Admin Panel
```text
1. Buka cms/admin.html di browser
2. Login dengan: admin@dksi.co.id / dksi2026
3. Pilih menu (Homepage, Services, Portfolio, dll)
4. Edit → Save Draft → Publish
5. Buka index.html di tab baru → perubahan langsung terlihat
```

**Default Login:**
- Email: `admin@dksi.co.id`
- Password: `dksi2026`

> ⚠️ **Production:** Implementasikan backend authentication (JWT/OAuth) sebelum deploy ke server publik.

---

## Arsitektur CMS ↔ Frontend

```
┌─────────────────────────────────┐         ┌──────────────────────────┐
│         ADMIN PANEL             │         │      PUBLIC WEBSITE      │
│       (cms/admin.html)          │         │       (index.html)       │
│                                 │         │                          │
│  Edit Form                      │         │  DOM Render              │
│       ↓                         │         │       ↑                  │
│  Collect Fields                 │  save   │  CMS.applyCMS()          │
│       ↓                         │ ──────→ │       ↑                  │
│  window.CMS.save()              │         │  window.CMS.get()       │
│       ↓                         │         │       ↑                  │
│  localStorage["dksi_cms_v2"]    │ ←────── │  localStorage bridge    │
│       ↓                         │         │       ↑                  │
│  CustomEvent("cms:update")      │         │  CMS event listener     │
│  BroadcastChannel("dksi_cms")   │         │  BroadcastChannel        │
└─────────────────────────────────┘         └──────────────────────────┘
                ↓
    Real-time sync ke frontend
    (cross-tab via BroadcastChannel)
```

---

## API CMS

`window.CMS` tersedia di kedua halaman (admin & frontend).

| Method | Description |
|--------|-------------|
| `CMS.get()` | Get current full data tree |
| `CMS.set(patch)` | Merge patch into data & save |
| `CMS.setPath("homepage.headline", value)` | Set single nested value |
| `CMS.save(data)` | Save full data (triggers sync) |
| `CMS.reset()` | Restore Company Profile defaults |
| `CMS.exportData()` | (admin) Download JSON |
| `CMS.importData(file)` | (admin) Upload JSON |
| `CMS.addActivity(action, target)` | Log activity |
| `CMS.getActivity()` | Get activity log |
| `CMS.getMedia()` | Get media library |
| `CMS.addMedia({url, name, alt})` | Add media file |
| `CMS.contactsAdd(entry)` | Save contact form submission |
| `CMS.contactsList()` | Get contact submissions |
| `CMS.revisionsPush(snapshot)` | Save version snapshot |
| `CMS.revisionsList()` | Get revision history |

---

## Data Schema

CMS menyimpan data di `localStorage["dksi_cms_v2"]` dengan struktur:

```js
{
  homepage: { eyebrow, headline, headlineAccent, headlineSuffix, description, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, heroImage, heroBadges: [] },
  trustBar: [ { label, value } ],
  about: { label, headline, paragraphs: [], sectorEducation, sectorGovernment, sectorEnterprise, ctaPrimary, ctaLink },
  company: { name, shortName, tagline, subTagline, established, address, city, email, phone, website, stats },
  process: { label, headline, steps: [{ num, title, desc, detail }] },
  services: [ { tag, title, sub, desc, points: [] } ],
  solInfra: [ { icon, title, desc } ],
  solEdu: [ { icon, title, desc } ],
  solAi: [ { icon, title, desc } ],
  buildSmarter: { label, headline, headlineAccent, description, cards: [] },
  why: [ { icon, title, desc } ],
  compliance: [ { icon, title, subtitle, desc, points: [] } ],
  trusted: [ { name, subtitle } ],
  portfolio: { items: { [key]: { title, client, loc, desc, img, cat, featured, status } }, filterOrder: [] },
  finalCta: { label, headline, description, primaryText, primaryLink, secondaryText, secondaryLink },
  contact: { title, phone, address, formLabels, submitText, successMsg },
  seo: { title, description, keywords, ogImage },
  social: { linkedin, instagram, twitter, email },
  meta: { publishedCount, draftsCount, version, lastPublished }
}
```

---

## Admin Panel — Sections

### Main
- **Dashboard** — overview stats, quick actions, recent activity
- **Media Library** — central image library (upload, copy URL)
- **Revisions** — history snapshots, restore version

### Website Content
- **Homepage** — Hero, Trust Bar (live preview panel)
- **About DKSI** — Profile + sectors
- **Process** — 6-step timeline (CRUD)
- **Services** — 5 service cards (CRUD)
- **Solutions** — Infra/Edu/AI grids (CRUD)
- **Portfolio** — Projects table + edit
- **Trusted By** — Client logos (CRUD)
- **Why DKSI** — 4 reason cards (CRUD)
- **Certification** — ISO + TKDN cards (CRUD)
- **Contact** — Contact info + form labels
- **CTA Settings** — Final CTA banner

### Company
- **Company Profile** — Global company data
- **Leadership** — Personnel management

### Marketing
- **SEO** — Title, meta, OG, slug, search preview
- **Social Media** — LinkedIn, IG, X

### System
- **Activity Log** — All actions history
- **Inquiries** — Contact form submissions
- **Settings** — Export/Import/Reset

---

## CMS Features (Implemented)

| Feature | Status |
|---------|--------|
| Authentication (local) | ✅ Login/Logout |
| Dashboard with stats | ✅ Real-time from DB |
| Quick Actions | ✅ |
| Recent Activity | ✅ |
| Save Draft | ✅ (in-memory) |
| Publish workflow | ✅ Confirmation dialog |
| Live Preview (Hero) | ✅ Split layout |
| Media Library | ✅ Upload + URL copy |
| Revisions + Restore | ✅ Snapshot per save |
| Activity Log | ✅ Auto-tracked |
| Contact Inbox | ✅ From contact form |
| SEO editor | ✅ With Google preview |
| Export / Import JSON | ✅ |
| Reset to default | ✅ |
| Confirm dialogs | ✅ |
| Toast notifications | ✅ |
| Responsive | ✅ Mobile drawer |
| Cross-tab sync | ✅ BroadcastChannel |
| Drag & drop reorder | ⏳ (structure ready) |
| Rich text editor | ⏳ (basic textarea) |
| User roles (RBAC) | ⏳ (single admin) |
| Email notifications | ⏳ (frontend only) |
| Server-side persistence | ⏳ (localStorage only) |

---

## Frontend Sections (Auto-driven by CMS)

| # | Section ID | Source |
|---|-----------|--------|
| 01 | NAVBAR | Static + `company.tagline` |
| 02 | HERO | `homepage` |
| 03 | STATS STRIP | `trustBar` |
| 04 | ABOUT | `about` + `company` |
| 05 | PROCESS | `process.steps` |
| 06 | SERVICES | `services` |
| 07 | BUILD SMARTER | `buildSmarter` |
| 08 | SOLUTIONS INFRA | `solInfra` |
| 09 | SOLUTIONS EDUCATION | `solEdu` |
| 10 | SOLUTIONS AI/IoT | `solAi` |
| 11 | WHY DKSI | `why` |
| 12 | CERTIFICATION | `compliance` |
| 13 | TRUSTED BY | `trusted` |
| 14 | PORTFOLIO | `portfolio.items` |
| 15 | FINAL CTA | `finalCta` |
| 16 | CONTACT | `contact` + `company` |
| 17 | FOOTER | `company` + `social` |

---

## Default Seed (Company Profile 2026)

Pada saat pertama kali load, `cms-data.js` otomatis meng-inject:
- ✅ Hero headline, CTA, badges
- ✅ About + 3 sectors
- ✅ 6-step process
- ✅ 5 service cards
- ✅ 6 infra solutions + 4 edu solutions + 6 AI solutions
- ✅ 4 why cards
- ✅ ISO + TKDN compliance
- ✅ 6 client logos (KEMENDIKBUD, KEMENAKER, dll)
- ✅ 6 portfolio projects
- ✅ Full company profile (address, email, phone, social)
- ✅ SEO metadata

**Website langsung dapat berjalan setelah deployment tanpa input manual.**

---

## Security Notes (Production Checklist)

- [ ] Implement backend authentication (replace localStorage auth)
- [ ] Add CSRF protection for admin endpoints
- [ ] Implement server-side validation
- [ ] Use HTTPS only
- [ ] Add rate limiting for login
- [ ] Image upload validation (MIME, size)
- [ ] XSS protection for rich text content
- [ ] SQL injection protection (if using SQL backend)
- [ ] Add `Content-Security-Policy` headers
- [ ] Implement user roles (Super Admin / Editor / Author)
- [ ] Backup database regularly
- [ ] Add audit log IP/device

---

## Browser Test

| Browser | Status |
|---------|--------|
| Chrome / Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Mobile (iOS/Android) | ✅ Responsive, drawer sidebar |

---

## Development Notes

- **Storage:** `localStorage` (single-domain) + `BroadcastChannel` (cross-tab sync)
- **No build step required** — pure vanilla, tinggal double-click
- **No backend required** — works offline, fully client-side
- **Cross-tab real-time** — buka `index.html` & `cms/admin.html` di 2 tab, edit di admin → langsung terupdate di frontend

---

