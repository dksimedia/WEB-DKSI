/**
 * DKSI Website — Core Script
 * ============================================================
 * Stack  : Vanilla JS + Tailwind + localStorage CMS bridge
 * Pages  : frontend/index.html  (public site)
 *          backend/admin/*       (CMS admin)
 * CMS    : window.CMS  (frontend/cms/cms-data.js)
 *          Draft  -> localStorage[dksi_cms_v2]
 *          Public -> localStorage[dksi_cms_v2_published] (after Publish)
 * ============================================================
 * Sections:
 *   0  Constants & Utils
 *   1  Theme (light/dark)
 *   2  Navigation (sticky + mobile + dropdown a11y)
 *   3  CMS Bridge (applyCMS)
 *   4  Data Fallback (DKSI_DATA)
 *   5  Renderers (sectors / process / services / portfolio)
 *   6  Modals
 *   7  Forms (contact + consult → POST /api/contact)
 *   8  Init
 * ============================================================
 */
'use strict';

/* ──────────────────────────────────────────────────────────
   0. Constants & Utils
   ────────────────────────────────────────────────────────── */

const API = Object.freeze({
  CONTACT: '/api/contact',
  ADMIN_CONTACTS: '/api/admin/contacts',
});

const LS = Object.freeze({
  THEME: 'dksi_theme',
});

// Tiny DOM helpers — avoid repeated querySelector boilerplate
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Safe text/content setters (skip if element missing)
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html != null) el.innerHTML = html;
}
function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

/** POST JSON helper — returns parsed JSON or throws */
async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ──────────────────────────────────────────────────────────
   1. Theme (light / dark)
   ────────────────────────────────────────────────────────── */

const htmlEl      = document.documentElement;
const themeToggle = $('#themeToggle');
const themeIcon   = $('#themeIcon');

let _brandingCache = null;
function updateLogos() {
  const isDark = htmlEl.classList.contains('dark');
  const b = _brandingCache;
  const light = b?.secondaryLight || 'assets/logo/secondary-light.png';
  const dark  = b?.secondaryDark  || 'assets/logo/secondary-dark.png';
  const navLogo = isDark ? dark : light;
  const siteLogo = $('#siteLogo');  if (siteLogo) siteLogo.src = navLogo;
  const abLogo   = $('#aboutLogo'); if (abLogo)   abLogo.src   = navLogo;
}

function updateThemeUI() {
  const isDark = htmlEl.classList.contains('dark');
  htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (themeIcon) {
    themeIcon.className = isDark
      ? 'ri-sun-line text-lg text-amber-400'
      : 'ri-moon-line text-lg';
  }
  updateLogos();
}

updateThemeUI();

// Restore saved preference
try {
  const saved = localStorage.getItem(LS.THEME);
  if (saved === 'dark') htmlEl.classList.add('dark');
  if (saved === 'light') htmlEl.classList.remove('dark');
  updateThemeUI();
} catch (_) {}

themeToggle?.addEventListener('click', () => {
  htmlEl.classList.toggle('dark');
  const isDark = htmlEl.classList.contains('dark');
  try { localStorage.setItem(LS.THEME, isDark ? 'dark' : 'light'); } catch (_) {}
  updateThemeUI();
});

/* ──────────────────────────────────────────────────────────
   2. Navigation
   ────────────────────────────────────────────────────────── */

// 2a. Sticky navbar
const nav = $('#navbar');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// 2b. Mobile menu
const menuBtn   = $('#menuBtn');
const mobileNav = $('#mobileNav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => mobileNav.classList.toggle('hidden'));
  $$('#mobileNav a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.add('hidden')),
  );
}

// 2b2. Scroll spy — nav active follow section in viewport (DOM-order sorted)
(function initScrollSpy() {
  const links = [...document.querySelectorAll('#navbar .nav-link, #mobileNav a')];
  if (!links.length) return;
  const sectionIds = ['home', 'about', 'services', 'solutions', 'sol-infra', 'sol-edu', 'sol-ai', 'portfolio', 'why', 'contact'];
  let sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  sections.sort((a, b) => a.offsetTop - b.offsetTop);
  if (!sections.length) return;
  const navH = () => document.getElementById('navbar')?.offsetHeight || 72;
  function setActive(activeId) {
    let navId = activeId;
    if (['sol-infra','sol-edu','sol-ai'].includes(activeId)) navId = 'solutions';
    links.forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href')?.slice(1);
      if (href === navId) a.classList.add('active');
    });
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (window.scrollY < 80) { setActive('home'); return; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) { setActive('contact'); return; }
      const y = window.scrollY + navH() + 24;
      let cur = sections[0].id;
      for (const s of sections) { if (s.offsetTop <= y) cur = s.id; else break; }
      if (['sol-infra','sol-edu','sol-ai'].includes(cur)) cur = 'solutions';
      setActive(cur);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { sections.sort((a, b) => a.offsetTop - b.offsetTop); onScroll(); }, { passive: true });
  links.forEach(a => a.addEventListener('click', () => {
    const id = a.getAttribute('href')?.slice(1);
    if (id) setActive(id);
  }));
  onScroll();
})();

// 2c. Dropdown a11y — SOLUTIONS / PRODUCTS
// Supports: hover (CSS group-hover/group-focus-within) + click + keyboard
// Keys: Enter/Space toggle, ArrowDown open, ArrowUp/Down navigate, Esc close
(function initDropdowns() {
  const triggers = $$('[aria-haspopup="true"]');
  if (!triggers.length) return;

  const closeAll = (except = null) => {
    triggers.forEach(btn => {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      const menu = document.getElementById(btn.getAttribute('aria-controls'));
      if (menu) {
        menu.classList.add('opacity-0', 'invisible');
        menu.classList.remove('opacity-100', 'visible');
      }
    });
  };

  triggers.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    const open  = () => {
      btn.setAttribute('aria-expanded', 'true');
      menu.classList.remove('opacity-0', 'invisible');
      menu.classList.add('opacity-100', 'visible');
    };
    const close = () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.add('opacity-0', 'invisible');
      menu.classList.remove('opacity-100', 'visible');
    };
    const toggle = () =>
      btn.getAttribute('aria-expanded') === 'true' ? close() : (closeAll(btn), open());

    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(); });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault(); open();
        menu.querySelector('[role="menuitem"]')?.focus();
      } else if (e.key === 'Escape') { close(); btn.focus(); }
    });

    menu.addEventListener('keydown', e => {
      const items = [...menu.querySelectorAll('[role="menuitem"]')];
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown')  { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      if (e.key === 'Home')       { e.preventDefault(); items[0]?.focus(); }
      if (e.key === 'End')        { e.preventDefault(); items[items.length - 1]?.focus(); }
      if (e.key === 'Escape')     { e.preventDefault(); close(); btn.focus(); }
    });

    // Keep CSS :focus-within as primary; JS open on focus for older browsers
    btn.addEventListener('focus', open);
    btn.parentElement?.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!btn.parentElement.contains(document.activeElement)) close();
      }, 0);
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('[aria-haspopup="true"]') && !e.target.closest('[role="menu"]')) {
      closeAll(null);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(null); });
})();

/* ──────────────────────────────────────────────────────────
   3. CMS Bridge — applyCMS()
   Public site reads Published snapshot if exists, else Draft.
   Split into focused helpers for readability.
   ────────────────────────────────────────────────────────── */

function getPublicCMS() {
  if (!window.CMS) return null;
  // Lazy shim for older cms-data.js without getPublic/getPublished
  if (!window.CMS.getPublic) {
    window.CMS.getPublic = () =>
      window.CMS.getPublished ? window.CMS.getPublished() : window.CMS.get();
  }
  return window.CMS.getPublic();
}

function applyHero(cms) {
  const h = cms.homepage;
  if (!h) return;
  setText('heroEyebrow', h.eyebrow);
  setText('heroHeadline', h.headline);
  setText('heroAccent', h.headlineAccent);
  setText('heroSuffix', h.headlineSuffix);
  setText('heroDesc', h.description);

  const a1 = $('#heroPrimaryCta');
  if (a1 && h.primaryCtaText) {
    a1.innerHTML = `${h.primaryCtaText} <i class="ri-arrow-right-line"></i>`;
    a1.href = h.primaryCtaLink || '#contact';
  }
  const a2 = $('#heroSecondaryCta');
    if (a2) {
      a2.textContent = h.secondaryCtaText || 'Jelajahi Solusi';
      let _link = h.secondaryCtaLink || '#solutions';
      _link = _link.replace('#solInfra','#sol-infra').replace('#solEdu','#sol-edu').replace('#solAi','#sol-ai');
      a2.href = _link;
    }
  const img = $('#heroImage');
  if (img && h.heroImage) img.src = h.heroImage;

  if (h.heroBadges) setHTML('heroBadges',
    h.heroBadges.map(b => `<span class="glass-btn">${b}</span>`).join(''));
}

function applyBranding(cms) {
  if (!cms.branding) return;
  _brandingCache = cms.branding;
  const footLogo  = cms.branding.mainLogo;
  updateLogos();
  const ftLogo   = $('#footerLogo'); if (ftLogo)    ftLogo.src   = footLogo;

  if (cms.branding.favicon) {
    let link = $('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = cms.branding.favicon;
  }
}

function applyAboutAndCompany(cms) {
  if (cms.trustBar) setHTML('trustBar',
    cms.trustBar.map(t =>
      `<div><div class="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">${t.label}</div>`
    + `<div class="font-extrabold text-[var(--brand)] text-lg">${t.value}</div></div>`).join(''));

  if (cms.about) {
    setText('aboutLabel', cms.about.label || 'DKSI Profile');
    setText('aboutHeadline', cms.about.headline);
    if (cms.about.paragraphs) setHTML('aboutDesc', cms.about.paragraphs.join('<br><br>'));
  }
  if (cms.company) {
    const c = cms.company;
    const tagline = $('#aboutCardTagline');
    if (tagline && c.tagline) tagline.textContent = `"${c.tagline}"`;
    setText('aboutCert1', c.stats?.cert1);
    setText('aboutCert2', c.stats?.cert2);
    setText('aboutCity', c.city);
    const est = $('#aboutEstablished');
    if (est && c.established) est.textContent = `EST. ${c.established}`;
  }
  if (cms.sectors) window.DKSI_DATA.sectors = cms.sectors;
}

function applyCollections(cms) {
  // Process steps
  if (cms.process?.steps) {
    window.DKSI_DATA.steps = cms.process.steps.map(s => ({
      step: s.num, title: s.title, desc: s.desc, detail: s.detail,
    }));
  }
  // Services / solutions / portfolio / trusted / why / compliance
  if (cms.services) {
    window.DKSI_DATA.services = cms.services.map(s => ({
      tag: s.tag || '', icon: s.icon || 'ri-service-line',
      title: s.title, sub: s.sub || s.subtitle || '',
      desc: s.desc, points: s.points || [],
      target: s.target || '', benefit: s.benefit || '', visible: s.visible !== false,
    }));
  }
  if (cms.solInfra) window.DKSI_DATA.solInfraData = cms.solInfra.map(x => ({ icon: x.icon || 'ri-service-line', title: x.title, desc: x.desc }));
  if (cms.solEdu)   window.DKSI_DATA.solEduData   = cms.solEdu.map(x => ({ icon: x.icon || 'ri-presentation-line', title: x.title, desc: x.desc }));
  if (cms.solAi)    window.DKSI_DATA.solAiData    = cms.solAi.map(x => ({ icon: x.icon || 'ri-building-line', title: x.title, desc: x.desc }));
  if (cms.why)        window.DKSI_DATA.whyData        = cms.why.map(w => ({ icon: w.icon || 'ri-award-line', title: w.title, desc: w.desc }));
  if (cms.compliance) window.DKSI_DATA.complianceData = cms.compliance.map(c => ({ icon: c.icon || 'ri-shield-check-line', title: c.title, subtitle: c.subtitle || '', desc: c.desc, points: c.points || [] }));
  if (cms.trusted)    window.DKSI_DATA.trustedData    = cms.trusted.map(t => typeof t === 'string' ? { name: t } : t);
  if (cms.portfolio?.items) window.DKSI_DATA.portfolios = cms.portfolio.items;
}

function applySeoAndContact(cms) {
  if (cms.seo?.title) document.title = cms.seo.title;
  const metaDesc = $('meta[name="description"]');
  if (metaDesc && cms.seo?.description) metaDesc.content = cms.seo.description;

  // Footer / contact company info
  const company = cms.company;
  if (company) {
    setText('footerCity', company.city);
    setText('footerEmail', company.email);
    setText('footerPhone', company.phone);
    $$('[href^="tel:"]').forEach(a => {
      if (company.phone) {
        a.href = `tel:${company.phone.replaceAll(' ', '').replaceAll('-', '')}`;
        a.textContent = company.phone;
      }
    });
    $$('[href^="mailto:"]').forEach(a => {
      if (company.email) { a.href = `mailto:${company.email}`; a.textContent = company.email; }
    });
    const addrEl = $('#contact .text-sm.font-bold.leading-relaxed');
    if (addrEl && company.address) addrEl.textContent = company.address;
  }

  if (cms.contact) {
    const t2 = $('#contactHeadline');
    if (t2) t2.textContent = cms.contact.title;
    const submitBtn = $('#contact button[type="submit"]');
    if (submitBtn && cms.contact.submitText) submitBtn.textContent = cms.contact.submitText;
    const formMsg = $('#formMsg');
    if (formMsg && cms.contact.successMsg) formMsg.textContent = cms.contact.successMsg;
  }

  // Social links
  if (cms.social) {
    const footSocial = $('footer .flex.gap-3, footer .flex.gap-4');
    if (footSocial) {
      footSocial.querySelectorAll('a').forEach(a => {
        if (a.href.startsWith('mailto:') && cms.social.email) a.href = cms.social.email;
        else if (a.querySelector('.ri-linkedin-fill') && cms.social.linkedin) a.href = cms.social.linkedin;
        else if (a.querySelector('.ri-instagram-line') && cms.social.instagram) a.href = cms.social.instagram;
        else if (a.querySelector('.ri-facebook-circle-line') && cms.social.facebook) a.href = cms.social.facebook;
        else if (a.querySelector('.ri-youtube-line') && cms.social.youtube) a.href = cms.social.youtube;
      });
    }
  }
}

function applyCMS() {
  const cms = getPublicCMS();
  if (!cms) return;
  applyHero(cms);
  applyBranding(cms);
  applyAboutAndCompany(cms);
  applyCollections(cms);
  applySeoAndContact(cms);
}

// Bridge: run once + on update events (same-tab + cross-tab)
(function initCMSBridge() {
  const run = () => { try { applyCMS(); } catch (_) {} };
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('cms:update', run);
  window.addEventListener('cms:published', run);
  if (window.BroadcastChannel) {
    try {
      const bc = new BroadcastChannel('dksi_cms');
      bc.onmessage = e => {
        if (e.data?.type === 'update' || e.data?.type === 'published') run();
      };
    } catch (_) {}
  }
})();

/* ──────────────────────────────────────────────────────────
   4. Data Fallback (used when CMS not yet loaded)
   Overridden by applyCMS() above.
   ────────────────────────────────────────────────────────── */
if (!window.DKSI_DATA) {
  window.DKSI_DATA = {
    sectors: {
      education:  { desc: 'Solusi kampus cerdas, ruang kelas interaktif hybrid, dan lab bahasa berbasis AI.', sols: ['Smartclassroom', 'Microteaching', 'Lab Bahasa', 'WiFi Kampus'] },
      government: { desc: 'Command Center, paperless conference, dan pengadaan TKDN untuk instansi pemerintah.', sols: ['Command Center', 'AV Sidang', 'Procurement TKDN', 'Cybersecurity'] },
      enterprise: { desc: 'Hybrid cloud, SD-WAN multi-cabang, dan enterprise data center high-availability.', sols: ['Enterprise Data Center', 'SD-WAN', 'Firewall Next-Gen', 'IT Rental'] },
    },
    steps: [
      { step: '01', title: 'Consultation',    desc: 'Analisis kebutuhan sistem.',     detail: 'Discovery mendalam untuk memetakan tantangan operasional instansi Anda.' },
      { step: '02', title: 'Assessment',      desc: 'Audit infrastruktur existing.',  detail: 'Pemeriksaan menyeluruh terhadap perangkat dan jaringan saat ini.' },
      { step: '03', title: 'Solution Design', desc: 'Arsitektur dan perencanaan.',    detail: 'Merancang topologi, spesifikasi, dan estimasi anggaran efisien.' },
      { step: '04', title: 'Implementation',  desc: 'Eksekusi oleh expert.',          detail: 'Pemasangan, konfigurasi, dan integrasi dengan standar ISO.' },
      { step: '05', title: 'Training',        desc: 'Transfer knowledge.',            detail: 'Pelatihan operasional bagi tim internal.' },
      { step: '06', title: 'Maintenance',     desc: 'Dukungan purna jual 24/7.',      detail: 'Monitoring berkala dan layanan teknis responsif.' },
    ],
    services: [
      { tag: '01', icon: 'ri-shield-keyhole-line', title: 'DKSI Solutions',   sub: 'IT Infrastructure & Network Security', desc: 'Jaringan, server & keamanan siber end-to-end — audit hingga maintenance 24/7.', points: ['Server & Storage Enterprise', 'Next-Gen Firewall', 'Structured Cabling 10G'], target: 'Kementerian, BUMN, Kampus', benefit: 'Uptime 99.9% & keamanan berlapis', visible: true },
      { tag: '02', icon: 'ri-hard-drive-3-line',   title: 'DKSI Data',        sub: 'Data Center & Hybrid Cloud', desc: 'Desain & kelola Data Center hybrid dengan backup otomatis dan DR.', points: ['Hybrid Cloud', 'Backup Otomatis & DR', 'Monitoring 24/7'], target: 'Instansi data kritis', benefit: 'Skalabilitas elastis', visible: true },
      { tag: '03', icon: 'ri-code-s-slash-line',   title: 'DKSI Apps',        sub: 'Custom Software, ERP & Mobile', desc: 'Aplikasi web/mobile & ERP custom terintegrasi API.', points: ['Custom ERP & SIAKAD', 'Mobile Apps', 'API & SSO'], target: 'Kampus & Enterprise', benefit: 'Proses 40% lebih cepat', visible: true },
      { tag: '04', icon: 'ri-shopping-bag-4-line', title: 'DKSI Procurement', sub: 'ICT Procurement Resmi & TKDN', desc: 'Pengadaan ICT resmi prinsipal, dokumen TKDN/LKPP lengkap.', points: ['Sesuai LKPP & TKDN', 'Garansi Prinsipal', 'Transparent Pricing'], target: 'Pemerintah & BUMN', benefit: 'Audit-ready', visible: true },
      { tag: '05', icon: 'ri-computer-line',       title: 'DKSI Rental',      sub: 'IT Equipment Rental Fleksibel', desc: 'Sewa laptop/PC/server/printer/AV — harian/bulanan.', points: ['Laptop, Server, AV', 'Harian/Bulanan', 'Full Support'], target: 'Event & project', benefit: 'Tanpa CAPEX, <24 jam', visible: true },
    ],
    solInfraData: [
      { icon: 'ri-server-line',          title: 'Data Center & Server', desc: 'Server enterprise, storage, dan disaster recovery.' },
      { icon: 'ri-wifi-line',            title: 'Networking & WiFi',    desc: 'Fiber backbone, switching, dan WiFi enterprise.' },
      { icon: 'ri-shield-keyhole-line',  title: 'Network Security',     desc: 'Next-gen firewall, endpoint protection, dan VPN.' },
      { icon: 'ri-hard-drive-line',      title: 'Storage & Backup',     desc: 'NAS/SAN dan backup otomatis RTO minimal.' },
      { icon: 'ri-router-line',          title: 'SD-WAN & VPN',         desc: 'Konektivitas multi-cabang terenkripsi.' },
      { icon: 'ri-cpu-line',             title: 'IT Infrastructure Audit', desc: 'Assessment untuk perencanaan upgrade.' },
    ],
    solEduData: [
      { icon: 'ri-presentation-line', title: 'Smartclassroom',   desc: 'Ruang kelas interaktif dengan hybrid learning.' },
      { icon: 'ri-mic-line',          title: 'Microteaching Lab',desc: 'Lab simulasi mengajar multi-kamera.' },
      { icon: 'ri-translate-2',       title: 'Lab Bahasa Digital', desc: 'Platform lab bahasa berbasis AI.' },
      { icon: 'ri-team-line',         title: 'LMS & E-Learning', desc: 'Learning management system terintegrasi.' },
    ],
    solAiData: [
      { icon: 'ri-building-line',    title: 'Smart Campus',      desc: 'IoT untuk manajemen gedung & energi kampus.' },
      { icon: 'ri-home-office-line', title: 'Smart Office',      desc: 'Booking system & paperless meeting.' },
      { icon: 'ri-command-line',     title: 'Command Center',    desc: 'Pusat kendali data dashboard real-time.' },
      { icon: 'ri-robot-line',       title: 'AI Analytics',      desc: 'Analitik prediktif untuk decision support.' },
      { icon: 'ri-sensor-line',      title: 'IoT Integration',   desc: 'Sensor pintar monitoring lingkungan & aset.' },
      { icon: 'ri-vidicon-line',     title: 'AV & Video Conference', desc: 'Sistem AV hybrid berkualitas tinggi.' },
    ],
    whyData: [
      { icon: 'ri-award-line',                 title: 'ISO 9001:2015',      desc: 'Manajemen mutu bersertifikasi internasional.' },
      { icon: 'ri-team-line',                 title: 'Expert Team',         desc: 'Engineer berpengalaman di ICT & smart systems.' },
      { icon: 'ri-customer-service-2-line',   title: 'End-to-End Service',  desc: 'Konsultasi hingga maintenance 24/7.' },
      { icon: 'ri-shield-check-line',         title: 'TKDN Compliant',      desc: 'Dukungan regulasi TKDN untuk pemerintah & BUMN.' },
    ],
    complianceData: [
      { icon: 'ri-shield-check-line', title: 'ISO 9001:2015', subtitle: 'Quality Management Certified', desc: 'Standar mutu internasional di setiap tahapan proyek.', points: ['Proses terdokumentasi', 'Audit berkala', 'Continuous improvement'] },
      { icon: 'ri-government-line',   title: 'TKDN Support',  subtitle: 'Komitmen Produk Dalam Negeri', desc: 'Mendukung regulasi TKDN untuk pengadaan nasional.', points: ['Dokumen TKDN lengkap', 'Sesuai LKPP', 'Vendor resmi prinsipal'] },
    ],
    trustedData: [
      { name: 'KEMENAG', logo: 'assets/clients/kementerian-agama-new-logo.png' },
      { name: 'POLRI', logo: 'assets/clients/lambang-polri.png' },
      { name: 'TMII', logo: 'assets/clients/2560px-tmii-logo-svg.png' },
      { name: 'KOMDIGI', logo: 'assets/clients/logo-kementerian-komunikasi-dan-digital-republik-indonesia-komdigi.svg' },
      { name: 'BAWASLU', logo: 'assets/clients/logo-bawaslu.png' },
      { name: 'LKPP', logo: 'assets/clients/logo-lkpp.png' },
    ],
    portfolios: {
      av:     { title: 'Audio Visual & Smart Room',  client: 'Kementerian Pendidikan & Kebudayaan', loc: 'Jakarta', desc: 'Sistem AV terintegrasi & smart room paperless.', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', cat: 'smart', status: 'published' },
      office: { title: 'Smart Office System',        client: 'Kementerian Ketenagakerjaan',          loc: 'Jakarta Selatan', desc: 'Paperless Conference & office automation.',       img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80', cat: 'smart', status: 'published' },
      micro:  { title: 'Microteaching Lab',          client: 'Universitas Negeri',                   loc: 'Bandung', desc: 'Lab simulasi mengajar multi-kamera.',               img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', cat: 'edu',   status: 'published' },
      infra:  { title: 'Enterprise Data Center',     client: 'Kementerian Hukum & HAM',              loc: 'Jakarta', desc: 'Server high-availability & backup terpusat.',       img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', cat: 'infra', status: 'published' },
      net:    { title: 'Backbone Networking',        client: 'BUMN & Instansi Pemerintah',           loc: 'Multi Cabang', desc: 'Fiber backbone & router enterprise.',            img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', cat: 'infra', status: 'published' },
      rental: { title: 'National Event ICT Rental',  client: 'Event Kenegaraan Nasional',            loc: 'Nasional', desc: 'Ratusan unit laptop & server on-site support.',     img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', cat: 'smart', status: 'published' },
    },
  };
}

/* ──────────────────────────────────────────────────────────
   5. Renderers
   ────────────────────────────────────────────────────────── */

// 5a. Sectors (About tabs)
function renderSector(secKey) {
  const data = window.DKSI_DATA.sectors[secKey];
  const detail = $('#sectorDetail');
  const tabs   = $$('.sector-btn');
  if (!data || !detail) return;

  tabs.forEach(b => {
    const active = b.dataset.sector === secKey;
    b.className = active
      ? 'sector-btn py-3 px-3 rounded-xl text-[11px] font-extrabold bg-[var(--bg-card)] text-[var(--brand)] shadow-sm'
      : 'sector-btn py-3 px-3 rounded-xl text-[11px] font-extrabold text-[var(--text-muted)]';
  });

  detail.innerHTML =
    `<p class="text-sm text-[var(--text-soft)] leading-relaxed mb-4">${data.desc}</p>`
  + `<ul class="grid grid-cols-2 gap-2">${data.sols.map(s =>
      `<li class="flex items-center gap-2 text-xs font-semibold text-[var(--text)]"><i class="ri-check-line text-[var(--brand)]"></i>${s}</li>`
    ).join('')}</ul>`;
}

// 5b. Process steps
let currentStep = 0;
function renderProcess() {
  const steps = window.DKSI_DATA.steps;
  const container = $('#stepButtons');
  const detail    = $('#stepDetail');
  const progress  = $('#processProgress');
  if (!container || !detail) return;

  if (progress) {
    progress.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
  }

  container.innerHTML = steps.map((s, i) =>
    `<button onclick="setStep(${i})" class="text-left p-4 rounded-2xl border transition-all ${i === currentStep ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-lg' : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--brand)]'}">`
  + `<div class="text-[10px] font-mono tracking-widest ${i === currentStep ? 'text-white/70' : 'text-[var(--text-muted)]'}">${s.step}</div>`
  + `<div class="text-sm font-extrabold mt-1">${s.title}</div>`
  + `<div class="text-xs mt-1 ${i === currentStep ? 'text-white/80' : 'text-[var(--text-soft)]'}">${s.desc}</div>`
  + `</button>`
  ).join('');

  const active = steps[currentStep];
  detail.innerHTML =
    `<h3 class="text-xl font-extrabold text-[var(--text)]">${active.title}</h3>`
  + `<p class="text-sm text-[var(--text-soft)] leading-relaxed mt-2">${active.detail}</p>`;
}

// 5c. Services + Solutions grids
function renderGrids() {
  const data = window.DKSI_DATA;
  const cms = window.CMS?.get() || {};

  // Build Smarter Section
  const bs = cms.buildSmarter || data.buildSmarter;
  if (bs) {
    const bsSection = $('#services').nextElementSibling; // The "Bangun Infrastruktur" section
    if (bsSection && bsSection.querySelector('h2')) {
      const h2 = bsSection.querySelector('h2');
      h2.innerHTML = `${bs.headline} <span class="text-[var(--brand)]">${bs.headlineAccent}</span>`;
      const p = bsSection.querySelector('p');
      if (p) p.textContent = bs.description;
      
      const grid = bsSection.querySelector('.grid');
      if (grid && bs.cards) {
        grid.innerHTML = bs.cards.map(c => 
          `<div class="p-8 rounded-[32px] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-md">`
        + `<div class="w-14 h-14 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-2xl mb-6 shadow-lg"><i class="${c.icon}"></i></div>`
        + `<h3 class="font-extrabold text-lg mb-3 text-[var(--text)]">${c.title}</h3>`
        + `<p class="text-sm text-[var(--text-soft)] leading-relaxed">${c.desc}</p>`
        + `</div>`
        ).join('');
      }
    }
  }

  // Services — Solusi Utama
  const sGrid = $('#servicesGrid');
  if (sGrid) {
    const visible = data.services.filter(s => s.visible !== false);
    sGrid.innerHTML = visible.map(s =>
      `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 flex flex-col justify-between hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl">`
    + `<div><div class="flex justify-between items-center mb-8"><span class="text-2xl font-black text-[var(--text-muted)] opacity-20">${s.tag}</span>`
    + `<div class="flex items-center gap-2"><div class="w-12 h-12 rounded-2xl bg-royal dark:bg-cyan grid place-items-center text-white dark:text-darkBg text-xl shadow-md"><i class="${s.icon || 'ri-service-line'}"></i></div>`
    + `</div></div>`
    + `<h3 class="text-xl font-extrabold text-[var(--text)] mb-1">${s.title}</h3>`
    + `<p class="text-xs font-bold text-[var(--brand)] mb-3 uppercase tracking-wider">${s.sub}</p>`
    + (s.target  ? `<p class="text-[11px] text-[var(--text-soft)] mb-2 flex items-center gap-1.5"><i class="ri-user-3-line text-[var(--brand)]"></i> ${s.target}</p>` : '')
    + `<p class="text-sm text-[var(--text-soft)] leading-relaxed mb-4">${s.desc}</p>`
    + (s.benefit ? `<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-6"><i class="ri-flashlight-line"></i> ${s.benefit}</div>` : '')
    + `<ul class="space-y-2.5 pt-6 border-t border-[var(--border)] mb-8">${s.points.map(p => `<li class="flex items-center gap-2.5 text-xs font-semibold text-[var(--text)]"><i class="ri-checkbox-circle-fill text-[var(--brand)] text-sm"></i>${p}</li>`).join('')}</ul></div>`
    + `<a href="#contact" class="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] text-xs font-extrabold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-all">Pelajari Layanan <i class="ri-arrow-right-line"></i></a></div>`
    ).join('');
  }

  // Solutions — dynamic by category (from CMS solCategories)
  const dyn = $('#solutions-dynamic');
  if (dyn) {
    const cats = (window.CMS?.get()?.solCategories) || [
      { id: 'solInfra', name: 'IT Infrastructure & Network Security', desc: 'Infrastruktur TI & keamanan siber.', icon: 'ri-server-line', color: 'royal' },
      { id: 'solEdu',   name: 'Smart Education & Digital Learning',   desc: 'Kelas interaktif & lab bahasa AI.',       icon: 'ri-presentation-line', color: 'cyan' },
      { id: 'solAi',    name: 'AI, IoT & Smart Innovation',           desc: 'Smart campus, smart office, command center.', icon: 'ri-robot-line', color: 'navy' },
    ];
    const dataMap = { solInfra: data.solInfraData, solEdu: data.solEduData, solAi: data.solAiData };

    dyn.innerHTML = cats.map(cat => {
      const items = dataMap[cat.id] || [];
      if (!items.length) return '';
      return `<section id="${cat.id}" class="py-20 border-t border-[var(--border)]">`
        + `<div class="max-w-[1280px] mx-auto px-6 lg:px-8">`
        + `<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">`
        + `<div><div class="label mb-2">${cat.id === 'solInfra' ? 'INFRASTRUCTURE' : cat.id === 'solEdu' ? 'EDUCATION' : 'INNOVATION'}</div>`
        + `<h2 class="text-3xl font-extrabold text-[var(--text)]">${cat.name}</h2>`
        + `<p class="text-sm text-[var(--text-soft)] max-w-xl mt-2">${cat.desc}</p></div>`
        + `<div class="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] grid place-items-center text-[var(--brand)] text-xl shadow-sm"><i class="${cat.icon}"></i></div>`
        + `</div>`
        + `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${items.map(it =>
            `<div class="group p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl flex flex-col justify-between">`
          + `<div><div class="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] grid place-items-center text-[var(--brand)] mb-6 group-hover:scale-110 transition-transform"><i class="${it.icon} text-xl"></i></div>`
          + `<h4 class="text-lg font-extrabold text-[var(--text)] mb-3">${it.title}</h4>`
          + `<p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">${it.desc}</p></div>`
          + `<button onclick="openSolutionModal('${it.title}')" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Detail Solusi <i class="ri-arrow-right-line"></i></button>`
          + `</div>`
          ).join('')}</div></div></section>`;
    }).join('');
  }

  // Why / Compliance / Trusted — simple text grids (no heavy DOM)
  const whyGrid = $('#whyGrid');
  if (whyGrid && data.whyData) {
    whyGrid.innerHTML = data.whyData.map(w =>
      `<div class="text-center p-6"><div class="w-12 h-12 rounded-2xl bg-royal dark:bg-cyan grid place-items-center text-white mx-auto mb-4"><i class="${w.icon} text-xl"></i></div>`
    + `<h4 class="text-sm font-extrabold text-[var(--text)]">${w.title}</h4><p class="text-xs text-[var(--text-soft)] mt-2">${w.desc}</p></div>`
    ).join('');
  }
  const compGrid = $('#complianceGrid');
  if (compGrid && data.complianceData) {
    compGrid.innerHTML = data.complianceData.map(c =>
      `<div class="p-6 rounded-3xl bg-[var(--bg)] border border-[var(--border)]"><div class="w-10 h-10 rounded-xl bg-[var(--bg-soft)] grid place-items-center text-[var(--brand)] mb-4"><i class="${c.icon}"></i></div>`
    + `<h4 class="text-sm font-extrabold text-[var(--text)]">${c.title}</h4><p class="text-xs font-bold text-[var(--text-muted)]">${c.subtitle || ''}</p>`
    + `<p class="text-xs text-[var(--text-soft)] mt-2">${c.desc}</p>`
    + (c.points?.length ? `<ul class="mt-3 space-y-1">${c.points.map(p => `<li class="text-xs text-[var(--text-soft)] flex items-center gap-2"><i class="ri-check-line text-[var(--brand)]"></i>${p}</li>`).join('')}</ul>` : '')
    + `</div>`
    ).join('');
  }
  const trustedGrid = $('#trustedGrid');
  if (trustedGrid && data.trustedData) {
    trustedGrid.innerHTML = data.trustedData.map(it => {
      const name = typeof it === 'string' ? it : it.name;
      const logo = typeof it === 'object' ? it.logo : '';
      return logo ? `<div class="p-3 rounded-2xl bg-white border border-[var(--border)] grid place-items-center h-[64px]"><img src="${logo}" alt="${name}" class="max-h-[44px] max-w-[100px] w-auto h-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition" loading="lazy"></div>` : `<div class="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] text-center"><span class="text-xs font-black tracking-widest text-[var(--text-muted)]">${name}</span></div>`;
    }).join('');
  }
  // CMS-driven logo carousel (#trusted)
  const logoTrack = document.getElementById('logoTrack');
  if (logoTrack && data.trustedData) {
    const makeImgs = (arr) => arr.map(it => {
      const name = typeof it === 'string' ? it : it.name;
      const logo = typeof it === 'object' ? it.logo : '';
      return logo ? `<img src="${logo}" alt="${name}" class="logo-item" loading="lazy">` : `<span class="px-6 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg-soft)] text-sm font-black">${name}</span>`;
    }).join('');
    const html = `<div class="flex items-center gap-10 whitespace-nowrap">${makeImgs(data.trustedData)}</div><div class="flex items-center gap-10 whitespace-nowrap" aria-hidden="true">${makeImgs(data.trustedData)}</div>`;
    logoTrack.innerHTML = html;
  }
}

// 5d. Portfolio (filter + draft guard)
const pfGrid = $('#portfolioGrid');

function renderPortfolio(cat = 'all') {
  if (!pfGrid) return;
  const entries  = Object.entries(window.DKSI_DATA.portfolios);
  // Public: hide drafts. Admin preview uses ?preview=1 to show all — handled via CMS bridge if needed
  const filtered = entries.filter(([, v]) => v.status !== 'draft' && (cat === 'all' || v.cat === cat));

  if (!filtered.length) {
    pfGrid.innerHTML = `<p class="col-span-full text-center text-sm text-[var(--text-muted)] py-10">Belum ada project di kategori ini.</p>`;
    return;
  }
  pfGrid.innerHTML = filtered.map(([k, p]) =>
    `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] overflow-hidden group hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl flex flex-col justify-between">`
  + `<div><div class="overflow-hidden h-[180px]"><img loading="lazy" decoding="async" src="${p.img}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt=""></div>`
  + `<div class="p-8"><span class="text-[10px] font-mono tracking-widest text-[var(--brand)] uppercase font-bold">${p.client} \u2022 ${p.loc}</span>`
  + `<h3 class="text-lg font-extrabold text-[var(--text)] mt-1 mb-2">${p.title}</h3>`
  + `<p class="text-xs text-[var(--text-soft)] leading-relaxed">${p.desc}</p></div></div>`
  + `<div class="px-8 pb-8"><button onclick="openModal('${k}')" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Detail Project <i class="ri-arrow-right-line"></i></button></div>`
  + `</div>`
  ).join('');
}

/* ──────────────────────────────────────────────────────────
   6. Modals
   ────────────────────────────────────────────────────────── */

function toggleModal(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('hidden', !show);
  el.classList.toggle('flex', show);
  document.body.style.overflow = show ? 'hidden' : '';
}
function closeModal()        { toggleModal('solutionModal', false); }
function closeConsultModal() { toggleModal('consultModal', false); }

function openModal(key) {
  const p = window.DKSI_DATA.portfolios[key];
  if (!p) return;
  const content = $('#mContent');
  if (!content) return;
  content.innerHTML =
    `<img loading="lazy" decoding="async" src="${p.img}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'" class="w-full h-[260px] object-cover rounded-2xl mb-6 shadow-md">`
  + `<span class="text-xs font-mono text-[var(--brand)] font-bold uppercase">${p.client} \u2022 ${p.loc}</span>`
  + `<h3 class="text-2xl font-extrabold text-[var(--text)] mt-1 mb-3">${p.title}</h3>`
  + `<p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">${p.desc}</p>`
  + `<div class="p-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] flex justify-between items-center">`
  + `<span class="text-xs font-bold text-[var(--text-muted)]">Status: Selesai &amp; Beroperasi</span>`
  + `<a href="#contact" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-black uppercase">Konsultasi Serupa</a></div>`;
  toggleModal('solutionModal', true);
}

function openSolutionModal(title) {
  const content = $('#mContent');
  if (!content) return;
  content.innerHTML =
    `<div class="w-16 h-16 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white text-2xl mb-6"><i class="ri-star-line"></i></div>`
  + `<h3 class="text-2xl font-extrabold text-[var(--text)] mb-3">${title}</h3>`
  + `<p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">Solusi ${title} dari DKSI dirancang untuk kebutuhan infrastruktur digital modern dengan standar keamanan tinggi.</p>`
  + `<a href="#contact" onclick="closeModal()" class="inline-flex px-6 py-3 rounded-xl bg-[var(--brand)] text-white text-xs font-black uppercase">Konsultasi solusi ini \u2192</a>`;
  toggleModal('solutionModal', true);
}

// Expose for inline onclick handlers in HTML
window.setStep          = i => { currentStep = i; renderProcess(); };
window.openModal        = openModal;
window.closeModal       = closeModal;
window.openSolutionModal = openSolutionModal;
window.closeConsultModal = closeConsultModal;

/* ──────────────────────────────────────────────────────────
   7. Forms — honeypot + backend POST
   Shared helper so contact & consult don't duplicate logic.
   ────────────────────────────────────────────────────────── */

function bindForm({ formId, msgId, getPayload, onSuccess }) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot — hidden field that bots fill
    const hp = document.getElementById('honeypot');
    if (hp?.value) { console.warn('[DKSI] Spam blocked (honeypot).'); return; }

    const payload = getPayload(form);
    if (!payload.name || !payload.email) return; // HTML5 required handles this, guard anyway

    const msg = document.getElementById(msgId);
    try {
      await postJSON(API.CONTACT, { ...payload, honeypot: hp?.value || '' });
      // Mirror to local CMS so admin sees it instantly without polling
      if (window.CMS?.contactsAdd) window.CMS.contactsAdd(payload);
      if (msg) msg.classList.remove('hidden');
      form.reset();
      onSuccess?.(msg);
    } catch (err) {
      if (msg) {
        msg.textContent = 'Terjadi kesalahan. Silakan coba lagi nanti.';
        msg.classList.remove('hidden');
      }
    }
  });
}

function setupForms() {
  // Contact section form — inputs order: [honeypot, name, company, email, phone, category, message]
  bindForm({
    formId: 'contactForm',
    msgId: 'formMsg',
    getPayload: form => {
      const f = form.querySelectorAll('input, select, textarea');
      return {
        name:     f[1]?.value.trim() || '',
        company:  f[2]?.value.trim() || '',
        email:    f[3]?.value.trim() || '',
        phone:    f[4]?.value.trim() || '',
        category: f[5]?.value || 'General',
        message:  f[6]?.value.trim() || '',
      };
    },
    onSuccess: msg => setTimeout(() => msg?.classList.add('hidden'), 5000),
  });

  // Consult modal form — inputs order: [name, company, email, category]
  bindForm({
    formId: 'consultForm',
    msgId: 'consultMsg',
    getPayload: form => {
      const f = form.querySelectorAll('input, textarea, select');
      return {
        name:     f[0]?.value.trim() || '',
        company:  f[1]?.value.trim() || '',
        email:    f[2]?.value.trim() || '',
        category: f[3]?.value || 'General',
        message:  'Via consult modal',
      };
    },
    onSuccess: msg => setTimeout(() => { msg?.classList.add('hidden'); closeConsultModal(); }, 2500),
  });
}

/* ──────────────────────────────────────────────────────────
   8. Init
   ────────────────────────────────────────────────────────── */

function initSectors() {
  const tabs   = $$('.sector-btn');
  const detail = $('#sectorDetail');
  if (!tabs.length || !detail) { setTimeout(initSectors, 300); return; }
  tabs.forEach(btn => btn.addEventListener('click', () => renderSector(btn.dataset.sector)));
  renderSector('education');
}

document.addEventListener('DOMContentLoaded', () => {
  initSectors();
  renderProcess();
  renderGrids();
  renderPortfolio('all');
  setupForms();

  // Close modals on backdrop click
  document.addEventListener('click', e => {
    if (e.target.id === 'solutionModal') closeModal();
    if (e.target.id === 'consultModal') closeConsultModal();
  });

  // Portfolio filters
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(x => { x.className = 'filter-btn'; });
      btn.className = 'filter-btn active';
      renderPortfolio(btn.dataset.filter);
    });
  });

  // Re-apply CMS after first paint (hero/trust/about may have been updated via admin)
  try { applyCMS(); renderGrids(); renderPortfolio('all'); } catch (_) {}
});

// Cross-tab live update
window.addEventListener('cms:update',   () => { try { applyCMS(); renderGrids(); renderPortfolio('all'); renderSector('education'); } catch (_) {} });
window.addEventListener('cms:published',() => { try { applyCMS(); renderGrids(); renderPortfolio('all'); } catch (_) {} });

// If script loaded deferred after DOM ready
if (document.readyState !== 'loading') {
  setTimeout(() => { initSectors(); renderGrids(); renderPortfolio('all'); }, 100);
}

// Smooth scrolling for anchor links with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});

// 10. Logo motion — pixel2motion (Trustworthy/Professional 700ms, minimal modern)
(function(){
  const logo = document.getElementById('siteLogo');
  if(!logo) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function replay(){
    logo.classList.remove('replay');
    void logo.offsetWidth; // reflow
    logo.style.animation = 'none';
    void logo.offsetWidth;
    logo.style.animation = '';
    logo.classList.add('replay');
    // clear replay flag so CSS :hover still works
    setTimeout(()=> logo.classList.remove('replay'), 800);
  }
  // Click mark replays (also scrolls to #home via wrap)
  document.getElementById('siteLogoWrap')?.addEventListener('click', ()=> setTimeout(replay, 50));
  // Expose for QA: ?static=1 already handled by CSS media query, ?t= not needed for this simple reveal
  window.__p2mReady = true;
})();

document.addEventListener('mousemove', e => {
  document.querySelectorAll('.bento-item').forEach(item => {
    const rect = item.getBoundingClientRect();
    item.style.setProperty('--x', `${e.clientX - rect.left}px`);
    item.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(sec => {
  sec.classList.add('reveal');
  observer.observe(sec);
});
