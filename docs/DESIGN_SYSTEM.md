# DKSI Design System — PT Dua Kawan Sejahtera Indonesia

Jangan ubah tanpa approval Director. File ini source of truth desain.

## Typography
- Heading: Orbitron 400/500/600/700/800/900 (bento title, hero, section)
- Body: Manrope 400/500/600/700/800
- Accent: Playfair Display (testimonial/quote bila perlu)
- Google Fonts: Orbitron + Manrope (preconnect fonts.googleapis.com)

## Color
- Primary slate-blue: #1a365d (light theme-color)
- Dark bg: #070707 (dark theme-color)
- CSS: `color-scheme: light dark` + `oklch` + `color-mix(in oklab, ...)` untuk interpolasi
- Vars: --bg, --bg-soft, --bg-card, --text, --text-muted, --border (light/dark auto-switch, no refresh)

## Layout
- Navbar order FIXED: Home, About, Services, Solutions (#solutions wrapper covering sol-infra/edu/ai), Portfolio, Why DKSI, Contact
- Sections di index.html sudah reorder sesuai navbar — jangan acak lagi
- Solutions wrapper id="solutions" berisi 3 sub: sol-infra, sol-edu, sol-ai
- ScrollSpy: DOM-order mapping + alias sol-* -> #solutions highlight biru
- Bento grid Quantexa-style, spotlight hover, reveal animation, card rounded-2xl

## Logo Motion (pixel2motion)
- Tools: https://github.com/nolangz/pixel2motion
- Reveal 700ms cubic-bezier, low-energy slow in/out, hover scale, klik logo replay
- Class: p2m-reveal + reduced-motion safe (@media prefers-reduced-motion)
- JS: __p2mReady trigger, replay via classList remove/add void offsetWidth
- Output: outputs/dksi/motion_spec.md + logo.svg IoU 0.937

## Trusted Client Logos
- Sumber: D:\CUSTOMER LOGO\LOGO CUSTOMER (20 file)
- Dest: frontend/assets/clients/ — uniform container 120x60, logo-item object-fit contain
- No border kotak, white card, grayscale hover
- CMS: frontend/cms/cms-data.js field trusted[].logo + admin picker/upload
- Carousel seamless loop duplicate <div> + CSS marquee
- Semua logo: width="120" height="60" loading="lazy" decoding="async" onerror fallback

## Responsive
- Tailwind v4 (tailwind.min.css 94KB, jangan commit 2x), responsive.css untuk breakpoint
- Canvas hero particle: canvas di luar pointer-events-none wrapper biar follow mouse

