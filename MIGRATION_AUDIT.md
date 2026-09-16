# MIGRATION AUDIT — DKSI Website → Next.js 16 + Laravel

> **Tanggal:** 2026-09-16 | **Source:** `C:/Users/media/duakawan-website` → `C:/Users/media/duakawan-website-nextjs-laravel/frontend`
> **Stack Baru:** Next 16.3.5, React 19.2.8, Tailwind 4, TypeScript 5

---

## 1) Sections & Konten CMS (22 Keys DEFAULTS)

### 1.1 Peta Section HTML → CMS Key → Next.js Component Target

| # | ID HTML | Nama Section | CMS Key(s) | Catatan Migrasi |
|---|---------|--------------|------------|-----------------|
| 01 | `#navbar` | Navbar Sticky Top | `branding`, `company` | Logo switch light/dark, nav 7 link, themeToggle, mobileNav. Scroll class `scrolled` |
| 02 | `#home` | Hero Interactive Particle & Tech Mesh | `homepage` (8 fields + heroBadges[6] + heroImage) | Canvas 80 particles, mouse follow, gradient `from-[var(--brand)] to-cyan`, CTA 2 link |
| 03 | `#trustBar` | Stats Strip | `trustBar[5]` | Grid 2→5 cols, Established/Quality/Approach/Expertise/Compliance |
| 04 | `#about` | About + Sector Switcher | `about`, `sectors` {education,government,enterprise}, `company.stats` | 3-tab switcher, card gradient #0A2D7A→#041635, ISO+TKDN |
| 05 | `#process` | Process 6-Step | `process` {label, headline, steps[6]} | Progress bar lg only, stepButtons + stepDetail interactive |
| 06 | `#services` | Services Grid | `services[5]` | tag 01-05, icon remixicon, points[3], target, benefit, visible |
| 07 | *(anon)* | Build Smarter | `buildSmarter` {label, headline, headlineAccent, desc, cards[3]} | 3 feature cards High-Performance/AI-Ready/Secure |
| 08 | `#solutions` | Solutions Wrapper | `solCategories[3]` | Wrapper + dotted radial bg, header OUR SOLUTIONS |
| 08a | `#sol-infra` | IT Infrastructure & Network Security | `solInfra[2]` | 6 mini-cards + hero image server rack |
| 08b | `#sol-edu` | Smart Education & Digital Learning | `solEdu[1]` | 3 detail cards Smartclassroom/Microteaching/Lab Bahasa |
| 08c | `#sol-ai` | AI, IoT & Smart Innovation | `solAi[1]` | 3 cards Smart Campus/Office/Command Center |
| 09 | `#portfolio` | Portfolio | `portfolio` {items:6, filterOrder} | Filter all/edu/infra/smart, cat mapping |
| 10 | *(anon)* | Final CTA Banner | `finalCta` {label, headline, desc, primaryText/Link, secondaryText/Link} | Gradient royal #0f3a9a→#082057, grid lines bg |
| 11 | `#why` | Why DKSI | `why[4]` | 4 cols, icon award/team/customer-service/shield |
| 12 | `#compliance` | Quality & Commitment | `compliance[2]` | 2 cols ISO 9001 + TKDN, points[3] each |
| 13 | `#trusted` | Trusted By Carousel | `trusted[12]` | Infinite loop duplicate div, logo-track, 120x60 |
| 14 | `#contact` | Contact Form & Info | `contact` {title, phone, address, formLabels[6], submitText, successMsg} + `company` | 3 info cards + form 7 fields + honeypot, categories select |
| 15 | `footer` | Footer | `company`, `social[6]`, `branding` | 4 cols, bg #030712, 5 social btns |
| 16 | `#consultModal` `#solutionModal` | Modals | — | consultForm + mContent dynamic |

**Navbar order FIXED (DESIGN_SYSTEM.md):** Home → About → Services → Solutions (wrapper sol-infra/edu/ai) → Portfolio → Why DKSI → Contact. ScrollSpy alias `sol-*` → `#solutions`.

### 1.2 Detail 22 Keys DEFAULTS (`frontend/cms/cms-data.js` + `backend/src/data/cms.seed.json` — identikal)

```js
// 1 homepage: eyebrow, headline, headlineAccent, headlineSuffix, description, primaryCtaText/Link, secondaryCtaText/Link, heroImage URL, heroBadges[6]
// 2 trustBar: [{label,value}×5]
// 3 about: label, headline, paragraphs[2], sectorEducation/Government/Enterprise, ctaPrimary/Secondary
// 4 sectors: education{desc,sols[4]}, government{desc,sols[4]}, enterprise{desc,sols[4]}
// 5 branding: mainLogo, secondaryLight, secondaryDark, favicon (assets/logo/*)
// 6 company: name, shortName, tagline, subTagline, established, address, city, email, phone, website, stats{cert1,cert2,establishedLabel}
// 7 process: label, headline, steps[6]{num,title,desc,detail}
// 8 services[5]: tag, icon(remixicon), title, sub, desc, points[3], target, benefit, visible
// 9 solInfra[2]: id, icon, title, shortDesc, desc, img, features[4], benefits[3], status
// 10 solEdu[1]: id, icon, title, shortDesc, desc, img, features[4], benefits[3], status
// 11 solAi[1]: id, icon, title, shortDesc, desc, img, features[4], benefits[3], status
// 12 solCategories[3]: id(solInfra/solEdu/solAi), name, desc, icon, color(royal/cyan/navy)
// 13 buildSmarter: label, headline, headlineAccent, description, cards[3]{icon,title,desc}
// 14 why[4]: icon, title, desc
// 15 compliance[2]: icon, title, subtitle, desc, points[3]
// 16 trusted[12]: name, subtitle, logo (assets/clients/*)
// 17 portfolio: items{av,office,micro,infra,net,rental}{title,client,loc,shortDesc,desc,img,cat,featured,status}, filterOrder[4]
// 18 finalCta: label, headline, description, primaryText/Link, secondaryText/Link
// 19 contact: title, phone, address, formLabels{name,inst,email,phone,category,message}, submitText, successMsg
// 20 seo: title, description, keywords, ogImage
// 21 social: linkedin, instagram, twitter, facebook, youtube, email (mailto)
// 22 meta: publishedCount, draftsCount, version, lastPublished ISO
```

**Total fields:** ~115 leaf values. Backend seed JSON mirror frontend DEFAULTS (hybrid sync via `GET /api/cms` + `/api/cms/draft` + localStorage `dksi_cms_v2` / `dksi_cms_v2_published` + BroadcastChannel `dksi_cms`).

**Konten kritis migrasi:** heroImage fallback logic (onerror → 1497366216548), form honeypot anti-spam, `contactsAdd` / `contactsList` localStorage, `revisionsPush` (30), `getMedia`/`addMedia` (200).

---

## 2) Design Tokens

### 2.1 Color (`frontend/css/style.css` :root + .dark)

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | #ffffff | #070707 |
| `--bg-soft` | #f8faf9 | #0c0c0c |
| `--bg-card` | #ffffff | #121212 |
| `--text` | #1a1a1a | #e0e0e0 |
| `--text-soft` | #4a4a4a | #999999 |
| `--text-muted` | #737373 | #4a4a4a |
| `--border` | #e5e5e5 | #1f1f1f |
| `--brand` | #1a365d (slate-blue) | #4a75c2 |
| `--brand-soft` | color-mix(oklch, brand 12%, white) | color-mix(oklch, brand 18%, black) |
| `--brand-glow` | color-mix(oklch, brand 35%, transparent) | color-mix(oklch, brand 40%, transparent) |
| `--bg-hero` | #f8faf9 | #070707 |
| `--bg-hero-top` | rgba(255,255,255,0.6) | rgba(7,7,7,0.7) |
| `--bg-hero-mid` | rgba(255,255,255,0.8) | rgba(7,7,7,0.9) |

**Meta theme-color:** light `#1a365d`, dark `#070707`, `color-scheme: light dark`, interpolasi `oklch` + `color-mix(in oklab)` + `interpolate-size: allow-keywords`, `scrollbar-color: var(--brand) var(--bg-soft)`.

**Gradient khusus:** hero card `linear-gradient(135deg in oklch, #0A2D7A, #051842)`, final CTA `from-royal via #0f3a9a to #082057`, cyan accent `bg-cyan` (Tailwind royal/cyan).

### 2.2 Typography (`DESIGN_SYSTEM.md` + style.css)

- **Heading:** `Orbitron` 400/500/600/700/800/900 — `var(--font-head)`, `font-weight:600` h1-h3
- **Body:** `Manrope` 400/500/600/700/800 — `var(--font-body)`, `line-height:1.6`
- **Accent:** `Playfair Display` (testimonial/quote, belum dipakai di hero)
- **Mono:** `IBM Plex Mono` — `var(--font-mono)`, `.label` 10-11px, `tracking .12em-.15em`, `uppercase`, `font-black`
- **Google Fonts:** preconnect `fonts.googleapis.com`, `@import Orbitron + Manrope`
- **Icons:** RemixIcon 4.2.0 (`cdn.jsdelivr.net`)

### 2.3 Spacing & Layout

- **Container:** `max-w-[1280px] mx-auto px-6 lg:px-8`
- **Navbar:** `h-[72px]`, `fixed top-0 inset-x-0 z-50`, `.scrolled` → `bg-[var(--bg-card)]92% + blur12px saturate1.15 + shadow`
- **Section padding:** `py-20 lg:py-28` (hero `min-h-[92vh] pt-28 pb-12`)
- **Card radius:** `rounded-3xl` (32px), `rounded-[32px]` modal, `rounded-[40px]` contact form, `rounded-2xl` inputs, `rounded-full` CTA
- **Bento:** `grid auto-fit minmax(300px,1fr) gap-6`, spotlight `radial-gradient 800px at var(--x) var(--y)`, hover `scale1.01 + border var(--brand)` + `cubic-bezier(0.16,1,0.3,1) 0.4s`
- **Responsive:** Tailwind v4 (tailwind.min.css 94KB), `responsive.css`, breakpoints `sm/md/lg`

### 2.4 Motion

- **pixel2motion:** reveal 700ms cubic-bezier low-energy slow in/out, `p2m-reveal`, hover scale, klik logo replay via `classList remove/add void offsetWidth`, `__p2mReady` trigger, reduced-motion safe, IoU 0.937, spec `outputs/dksi/motion_spec.md`
- **Hero canvas:** 80 particles, maxDistance 150, velocity 0.5, radius 1-3, line 0.5, follow mouse

---

## 3) Asset List

### 3.1 Logo (`frontend/assets/logo/` — 5 files)

| File | Pakai di | Next.js `public/logo/` |
|------|----------|------------------------|
| `main.png` | footer, favicon | `public/logo/main.png` |
| `secondary-light.png` | navbar light (`#siteLogo` default) | `public/logo/secondary-light.png` |
| `secondary-dark.png` | navbar dark + about card | `public/logo/secondary-dark.png` |
| `dksi-logo.svg` | — (vektor) | `public/logo/dksi-logo.svg` |
| `dksi-logo-white.svg` | dark variant | `public/logo/dksi-logo-white.svg` |

Semua `h-9 lg:h-10`, `width 160 height 40`, `loading eager fetchpriority high` untuk hero logo.

### 3.2 Clients (`frontend/assets/clients/` — 25 files, 12 aktif di trusted, 20 total sumber)

**Aktif di CMS (12, carousel 120×60):**
`kementerian-agama-new-logo.png`, `lambang-polri.png`, `2560px-tmii-logo-svg.png`, `logo-kementerian-komunikasi-dan-digital-republik-indonesia-komdigi.svg`, `logo-bawaslu.png`, `logo-lkpp.png`, `logo-of-the-ministry-of-manpower-of-the-republic-of-indonesia-svg.png`, `logo-unhan.png`, `pupr.png`, `badan-standardisasi-nasional-seeklogo.png`, `rspon.png`, `ristekdikti-logo-f092eadfb2-seeklogo-com.png`

**Tambahan di folder (belum di CMS, perlu audit pakai/tidak):**
`uob-logo.png`, `schlumberger.svg`, `logobsn.jpg`, `logo-of-the-ministry-of-female-empowerment-and-child-protection-of-the-republic-of-indonesia.svg`, `logo-of-ministry-of-communication-and-information-technology-of-the-republic-of-indonesia-svg.png`, `logo-bawaslu-persegi.png`, `iha-logo-landscape-615a712c.png`, `idb-logo.png` + 3× duplikat historis + 2× logo SVG.

**Spec DESIGN_SYSTEM.md:** container 120×60, `object-contain`, no border, white card, grayscale→color hover, `width 120 height 60 loading lazy decoding async onerror fallback`, marquee duplicate div seamless loop (`logo-carousel` + `logo-track`).

**Gambar eksternal (Unsplash, perlu optimasi next/image):**
- Hero 1100×440 `photo-1451187580459` + fallback `photo-1497366216548`
- Infra `photo-1558494949`, Edu `photo-1524178232363`, AI `photo-1551288049`, Portfolio 6× (av/office/micro/infra/net/rental)

---

## 4) Next.js App — Sudah Ada vs Perlu Dibuat

### 4.1 Sudah Ada (`frontend/`)

```
frontend/
├─ package.json → next 16.3.5, react 19.2.8, react-dom 19.2.8, @tailwindcss/postcss ^4, tailwindcss ^4, typescript ^5, @types/*
├─ app/
│  ├─ layout.tsx → Geist Sans/Mono (SALAH — harus Orbitron+Manrope), lang="en" (harus "id"), metadata generic
│  ├─ page.tsx → default create-next-app (belum ada section)
│  ├─ globals.css → Tailwind 4 (belum ada design tokens --bg/--brand)
│  └─ favicon.ico
└─ AGENTS.md → Next.js breaking changes warning (baca node_modules/next/dist/docs/)
```

**Status:** scaffold kosong, belum ada migrasi konten.

### 4.2 Perlu Dibuat (checklist migrasi)

**A. Design tokens & fonts**
- [ ] `app/globals.css` → port `style.css` vars (--bg, --brand, color-scheme, oklch, .label, .glass-btn, .form-input, .filter-btn, .bento-*, canvas)
- [ ] `app/layout.tsx` → `next/font/google` Orbitron + Manrope + IBM Plex Mono, `color-scheme` meta, theme-color, RemixIcon, scroll-smooth
- [ ] Tailwind 4 config (`@import "tailwindcss"` + theme vars) vs `tailwind.min.css` 94KB lama

**B. Assets**
- [ ] `public/logo/*` (5) + `public/clients/*` (25) → copy dari `frontend/assets/`
- [ ] `next.config` → `images.remotePatterns` Unsplash
- [ ] Optimasi `next/image` (sizes, priority hero, lazy trusted)

**C. CMS / Data layer**
- [ ] `lib/cms.ts` → TypeScript type 22 keys (homepage … meta), fetch `GET /api/cms` (published) + `/api/cms/draft` (auth), fallback DEFAULTS
- [ ] `data/cms.seed.json` → copy `backend/src/data/cms.seed.json` sebagai fallback
- [ ] Server Components fetch + ISR/revalidate

**D. Components (1 per section, 19 total)**
- [ ] `components/Navbar.tsx` (`#navbar`, branding, themeToggle, mobileNav, ScrollSpy)
- [ ] `components/Hero.tsx` (`#home`, canvas particle → client component, heroBadges 6)
- [ ] `components/TrustBar.tsx` (`#trustBar`)
- [ ] `components/About.tsx` (`#about`, sectorTabs client state)
- [ ] `components/Process.tsx` (`#process`, 6 steps + progress)
- [ ] `components/Services.tsx` (`#services`, services[5] grid)
- [ ] `components/BuildSmarter.tsx` (buildSmarter 3 cards)
- [ ] `components/Solutions.tsx` (`#solutions` wrapper + `SolInfra`/`SolEdu`/`SolAi`)
- [ ] `components/Portfolio.tsx` (`#portfolio`, filter client)
- [ ] `components/FinalCta.tsx` (gradient banner)
- [ ] `components/Why.tsx` (`#why` 4 cols)
- [ ] `components/Compliance.tsx` (`#compliance` 2 cols)
- [ ] `components/Trusted.tsx` (`#trusted` marquee)
- [ ] `components/Contact.tsx` (`#contact`, form + honeypot + categories)
- [ ] `components/Footer.tsx` (footer 4 cols + social)
- [ ] `components/Modals.tsx` (consult + solution)
- [ ] `components/ui/*` (Label, GlassBtn, FormInput, FilterBtn, BentoCard)

**E. Logic migrasi**
- [ ] Hero canvas mouse follow (convert script inline → useEffect, pointer-events)
- [ ] ScrollSpy DOM-order + alias sol-* → #solutions
- [ ] Theme toggle localStorage `dksi_theme` + `prefers-color-scheme`
- [ ] Contact form `contactsAdd` → POST Laravel `/api/contacts` (ganti localStorage)
- [ ] `app/page.tsx` → compose semua section order FIXED (jangan acak)

**F. Backend Laravel**
- [ ] API `/api/cms` (published) + `/api/cms/draft` (auth) mirror Express lama
- [ ] `cms.seed.json` seed DB

---

## 5) Risiko & Catatan

- `layout.tsx` masih pakai **Geist** (bawaan create-next-app) → wajib ganti Orbitron/Manrope, `lang="id"`, metadata SEO dari `seo` key.
- `globals.css` Tailwind 4 belum berisi vars lama → tanpa port, warna `var(--bg)` pecah.
- Trusted 25 file tapi CMS cuma 12 → putuskan 8 sisa dipakai/tidak (UOB, Schlumberger, BSN JPG duplikat, dll).
- Unsplash external → butuh `next/image` remotePatterns atau download ke `public/images/`.
- Canvas hero butuh `useEffect` + `ResizeObserver`, jangan SSR.
- `id="contact"` dipakai untuk Portfolio di HTML lama (line 566) → di Next.js perbaiki jadi `#portfolio` + `#contact` terpisah (typografi HTML lama salah label).

---

*Generated: audit read 693-line index.html, 431-line cms-data.js (22 keys), 582-line cms.seed.json, DESIGN_SYSTEM.md, style.css vars, 25 assets, Next.js app 4 files.*
