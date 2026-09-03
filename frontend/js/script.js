/**
 * DKSI WEBSITE CORE SCRIPT
 * Version: 2.0.0
 * Author: Developer Team
 */

/* ==========================================================================
   1. THEME MANAGEMENT (LIGHT/DARK)
   ========================================================================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;

function updateThemeUI() {
  const isDark = htmlEl.classList.contains('dark');
  if (themeIcon) {
    themeIcon.className = isDark ? "ri-sun-line text-lg text-amber-400" : "ri-moon-line text-lg";
  }
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// Initial UI setup
updateThemeUI();

// Event listener for toggle button
themeToggle?.addEventListener('click', () => {
  htmlEl.classList.toggle('dark');
  const isDark = htmlEl.classList.contains('dark');
  localStorage.setItem('dksi_theme', isDark ? 'dark' : 'light');
  updateThemeUI();
});

/* ==========================================================================
   2. NAVIGATION & UI COMPONENTS
   ========================================================================== */
// Sticky Navbar on Scroll
const nav = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
if (menuBtn) {
  menuBtn.onclick = () => mobileNav.classList.toggle("hidden");
}
document.querySelectorAll("#mobileNav a").forEach(a => {
  a.onclick = () => mobileNav.classList.add("hidden");
});

/* ==========================================================================
   2b. CMS BRIDGE — inject into frontend
   ========================================================================== */
function applyCMS() {
  if (!window.CMS) return;
  const cms = window.CMS.get();
  // Hero
  const el = (id, prop, val) => { const n = document.getElementById(id); if (n) n.textContent = val; };
  el("heroEyebrow", null, cms.homepage.eyebrow);
  el("heroHeadline", null, cms.homepage.headline);
  el("heroAccent", null, cms.homepage.headlineAccent);
  el("heroSuffix", null, cms.homepage.headlineSuffix);
  el("heroDesc", null, cms.homepage.description);
  const a1 = document.getElementById("heroPrimaryCta");
  if (a1) { a1.textContent = (cms.homepage.primaryCtaText || "") + " "; if (cms.homepage.primaryCtaText) a1.innerHTML = cms.homepage.primaryCtaText + ' <i class="ri-arrow-right-line"></i>'; a1.href = cms.homepage.primaryCtaLink || "#contact"; }
  const a2 = document.getElementById("heroSecondaryCta");
  if (a2) { a2.textContent = cms.homepage.secondaryCtaText || "Jelajahi Solusi"; a2.href = cms.homepage.secondaryCtaLink || "#solutions-infra"; }
  const img = document.getElementById("heroImage"); if (img && cms.homepage.heroImage) img.src = cms.homepage.heroImage;
  // Branding: auto-switch between main / secondary light / secondary dark based on theme
  if (cms.branding) {
    const isDark = document.documentElement.classList.contains('dark');
    const nav = isDark ? (cms.branding.secondaryDark || cms.branding.secondaryLight || cms.branding.mainLogo) : (cms.branding.secondaryLight || cms.branding.secondaryDark || cms.branding.mainLogo);
    const footer = cms.branding.mainLogo;
    const about = isDark ? (cms.branding.secondaryDark || cms.branding.mainLogo) : (cms.branding.secondaryLight || cms.branding.mainLogo);
    const siteLogo = document.getElementById('siteLogo'); if (siteLogo) siteLogo.src = nav;
    const aboutLogo = document.getElementById('aboutLogo'); if (aboutLogo) aboutLogo.src = about;
    const footerLogo = document.getElementById('footerLogo'); if (footerLogo) footerLogo.src = footer;
    // CMS Panel sync
    const cmsLoginLogo = document.getElementById('cmsLoginLogo'); if (cmsLoginLogo) cmsLoginLogo.src = cms.branding.mainLogo || '../assets/logo/main.png';
    const cmsSidebarLogo = document.getElementById('cmsSidebarLogo'); if (cmsSidebarLogo) cmsSidebarLogo.src = cms.branding.mainLogo || '../assets/logo/main.png';
    if (cms.branding.favicon) {
      let f = document.querySelector('link[rel="icon"]'); if (!f) { f = document.createElement('link'); f.rel='icon'; document.head.appendChild(f); } f.href = cms.branding.favicon;
    }
  }
  const badges = document.getElementById("heroBadges");
  if (badges && cms.homepage.heroBadges) badges.innerHTML = cms.homepage.heroBadges.map(b => `<span class="glass-btn">${b}</span>`).join("");
  const tb = document.getElementById("trustBar");
  if (tb && cms.trustBar) tb.innerHTML = cms.trustBar.map(t => `<div><div class="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">${t.label}</div><div class="font-extrabold text-[var(--brand)] text-lg">${t.value}</div></div>`).join("");
  const aboutLabel = document.getElementById("aboutLabel"); if (aboutLabel) aboutLabel.textContent = cms.about.label || "DKSI Profile";
  const aboutHeadline = document.getElementById("aboutHeadline"); if (aboutHeadline) aboutHeadline.textContent = cms.about.headline;
  const aboutDesc = document.getElementById("aboutDesc"); if (aboutDesc) aboutDesc.innerHTML = cms.about.paragraphs.map(p => p).join("<br><br>");
  // About right card — cert tiles + footer line
  const aboutCardTagline = document.getElementById("aboutCardTagline"); if (aboutCardTagline && cms.company?.tagline) aboutCardTagline.textContent = '"' + cms.company.tagline + '"';
  const aboutCert1 = document.getElementById("aboutCert1"); if (aboutCert1) aboutCert1.textContent = cms.company?.stats?.cert1 || aboutCert1.textContent;
  const aboutCert2 = document.getElementById("aboutCert2"); if (aboutCert2) aboutCert2.textContent = cms.company?.stats?.cert2 || aboutCert2.textContent;
  const aboutCity = document.getElementById("aboutCity"); if (aboutCity) aboutCity.textContent = cms.company?.city || aboutCity.textContent;
  const aboutEstablished = document.getElementById("aboutEstablished"); if (aboutEstablished) aboutEstablished.textContent = 'EST. ' + (cms.company?.established || aboutEstablished.textContent.replaceAll('EST.','').trim());
  // Sync DKSI_DATA from CMS so renderers use admin data
  if (cms.sectors) window.DKSI_DATA.sectors = cms.sectors;
  // Process
  if (cms.process) { window.DKSI_DATA.steps = cms.process.steps.map(s => ({ step: s.num, title: s.title, desc: s.desc, detail: s.detail })); }
  // BuildSmarter (merge into solutions intro if present)
  const bLabel = document.querySelector("section:nth-of-type(7) .label"); if (bLabel && cms.buildSmarter?.label) bLabel.textContent = cms.buildSmarter.label;
  // Solutions / services / why / compliance / trusted / portfolio
  if (cms.services) window.DKSI_DATA.services = cms.services.map(s => ({ tag: s.tag || "", title: s.title, sub: s.sub || s.subtitle || "", desc: s.desc, points: s.points || [] }));
  if (cms.solInfra) window.DKSI_DATA.solInfraData = cms.solInfra.map(x => ({ icon: x.icon || "ri-service-line", title: x.title, desc: x.desc }));
  if (cms.solEdu) window.DKSI_DATA.solEduData = cms.solEdu.map(x => ({ icon: x.icon || "ri-presentation-line", title: x.title, desc: x.desc }));
  if (cms.solAi) window.DKSI_DATA.solAiData = cms.solAi.map(x => ({ icon: x.icon || "ri-building-line", title: x.title, desc: x.desc }));
  if (cms.why) window.DKSI_DATA.whyData = cms.why.map(w => ({ icon: w.icon || "ri-award-line", title: w.title, desc: w.desc }));
  if (cms.compliance) window.DKSI_DATA.complianceData = cms.compliance.map(c => ({ icon: c.icon || "ri-shield-check-line", title: c.title, subtitle: c.subtitle || "", desc: c.desc, points: c.points || [] }));
  if (cms.trusted) window.DKSI_DATA.trustedData = cms.trusted.map(t => t.name || t);
  if (cms.portfolio?.items) window.DKSI_DATA.portfolios = cms.portfolio.items;
  // SEO
  if (cms.seo?.title) document.title = cms.seo.title;
  const metaDesc = document.querySelector('meta[name="description"]'); if (metaDesc && cms.seo?.description) metaDesc.content = cms.seo.description;
  // Company info in contact/footer
  const ftCity = document.getElementById("footerCity"); if (ftCity && cms.company?.city) ftCity.textContent = cms.company.city;
  const ftEmail = document.getElementById("footerEmail"); if (ftEmail && cms.company?.email) ftEmail.textContent = cms.company.email;
  const ftPhone = document.getElementById("footerPhone"); if (ftPhone && cms.company?.phone) ftPhone.textContent = cms.company.phone;
  const phoneLinks = document.querySelectorAll('[href^="tel:"]'); phoneLinks.forEach(a => { if (cms.company?.phone) { a.href = "tel:" + cms.company.phone.replaceAll(" ","").replaceAll("-",""); a.textContent = cms.company.phone; } });
  const mailLinks = document.querySelectorAll('[href^="mailto:"]'); mailLinks.forEach(a => { if (cms.company?.email) { a.href = "mailto:" + cms.company.email; a.textContent = cms.company.email; } });
  const addrEl = document.querySelector("#contact .text-sm.font-bold.leading-relaxed"); if (addrEl && cms.company?.address) addrEl.textContent = cms.company.address;
  // Contact section headline & CTA texts
  const contactTitle = document.querySelector("#contact .text-4xl.sm\\:text-5xl"); // may have that class — fallback to id
  const contactTitle2 = document.getElementById("contactHeadline"); if (contactTitle2 && cms.contact?.title) contactTitle2.textContent = cms.contact.title;
  else if (contactTitle && cms.contact?.title) contactTitle.textContent = cms.contact.title;
  const submitBtn = document.querySelector('#contact button[type="submit"]'); if (submitBtn && cms.contact?.submitText) submitBtn.textContent = cms.contact.submitText;
  const formMsgEl = document.getElementById("formMsg"); if (formMsgEl && cms.contact?.successMsg) formMsgEl.textContent = cms.contact.successMsg;
  // Social links (footer) — sync CMS social into footer icons
  if (cms.social) {
    const socialMap = { linkedin: 'ri-linkedin-fill', instagram: 'ri-instagram-line', facebook: 'ri-facebook-circle-line', youtube: 'ri-youtube-line', email: 'ri-mail-line' };
    const footSocial = document.querySelector("footer .flex.gap-3, footer .flex.gap-4");
    if (footSocial) {
      footSocial.querySelectorAll('a').forEach(a => {
        if (a.href.startsWith('mailto:') && cms.social.email) { a.href = cms.social.email; }
        else if (a.querySelector('.ri-linkedin-fill') && cms.social.linkedin) a.href = cms.social.linkedin;
        else if (a.querySelector('.ri-instagram-line') && cms.social.instagram) a.href = cms.social.instagram;
        else if (a.querySelector('.ri-facebook-circle-line') && cms.social.facebook) a.href = cms.social.facebook;
        else if (a.querySelector('.ri-youtube-line') && cms.social.youtube) a.href = cms.social.youtube;
      });
    }
  }
  window.addEventListener("cms:update", applyCMS);
}

(function initCMSBridge(){ if (document.readyState !== "loading") applyCMS(); else document.addEventListener("DOMContentLoaded", applyCMS); window.addEventListener("cms:update", applyCMS); if (window.BroadcastChannel) { try { const bc = new BroadcastChannel("dksi_cms"); bc.onmessage = e => { if (e.data?.type === "update") applyCMS(); }; } catch(e){} } })();

/* ==========================================================================
   3. DATA LAYER (Fallback — overridden by CMS if cms-data.js present)
   ========================================================================== */
if (!window.DKSI_DATA) window.DKSI_DATA = {
  sectors: {
    education: { desc: "Solusi kampus cerdas, ruang kelas interaktif hybrid, dan lab bahasa berbasis AI untuk institusi pendidikan modern.", sols: ["Smartclassroom", "Microteaching", "Lab Bahasa", "WiFi Kampus"] },
    government: { desc: "Infrastruktur Command Center, sistem konferensi paperless, dan pengadaan bersertifikasi TKDN untuk instansi pemerintahan.", sols: ["Command Center", "AV Sidang", "Procurement TKDN", "Cybersecurity"] },
    enterprise: { desc: "Hybrid cloud, arsitektur SD-WAN multi-cabang, serta enterprise data center yang handal dan high-availability.", sols: ["Enterprise Data Center", "SD-WAN", "Firewall Next-Gen", "IT Rental"] }
  },
  steps: [
    { step: '01', title: 'Consultation', desc: 'Analisis kebutuhan sistem.', detail: 'Discovery mendalam untuk memetakan tantangan operasional dan teknis instansi Anda.' },
    { step: '02', title: 'Assessment', desc: 'Audit infrastruktur existing.', detail: 'Pemeriksaan menyeluruh terhadap perangkat, jaringan, dan keamanan saat ini.' },
    { step: '03', title: 'Solution Design', desc: 'Arsitektur dan perencanaan.', detail: 'Merancang topologi, spesifikasi hardware/software, dan estimasi anggaran yang efisien.' },
    { step: '04', title: 'Implementation', desc: 'Eksekusi oleh expert.', detail: 'Pemasangan perangkat, konfigurasi jaringan, dan integrasi sistem dengan standar ISO.' },
    { step: '05', title: 'Training', desc: 'Transfer knowledge.', detail: 'Pelatihan operasional bagi tim internal untuk memastikan pemanfaatan sistem optimal.' },
    { step: '06', title: 'Maintenance', desc: 'Dukungan purna jual 24/7.', detail: 'Monitoring berkala, pemeliharaan preventif, dan layanan teknis responsif.' }
  ],
  services: [
    { tag: '01', title: 'DKSI Solutions', sub: 'IT Infrastructure & Security', desc: 'Membangun pondasi jaringan, server, dan keamanan siber yang tangguh.', points: ['Server & Storage', 'Next-Gen Firewall', 'Structured Cabling'] },
    { tag: '02', title: 'DKSI Data', sub: 'Data Center & Cloud', desc: 'Manajemen pusat data dan integrasi cloud untuk skalabilitas tinggi.', points: ['Hybrid Cloud', 'Disaster Recovery', 'Monitoring 24/7'] },
    { tag: '03', title: 'DKSI Apps', sub: 'Custom Software & ERP', desc: 'Pengembangan aplikasi web/mobile terintegrasi sesuai kebutuhan institusi.', points: ['Custom ERP', 'Mobile Apps', 'API Integration'] },
    { tag: '04', title: 'DKSI Procurement', sub: 'ICT Procurement Services', desc: 'Layanan pengadaan perangkat resmi dengan dukungan TKDN lengkap.', points: ['Sesuai LKPP/TKDN', 'Garansi Prinsipal', 'Transparent Pricing'] },
    { tag: '05', title: 'DKSI Rental', sub: 'IT Equipment Rental', desc: 'Solusi sewa perangkat IT fleksibel untuk event kenegaraan & korporasi.', points: ['Laptop & Server', 'Harian/Bulanan', 'Full Maintenance'] }
  ],
  solInfraData: [
    { icon: 'ri-server-line', title: 'Data Center & Server', desc: 'Pengadaan dan instalasi server enterprise, storage, dan disaster recovery.' },
    { icon: 'ri-wifi-line', title: 'Networking & WiFi', desc: 'Backbone fiber, switching, dan WiFi enterprise untuk coverage optimal.' },
    { icon: 'ri-shield-keyhole-line', title: 'Network Security', desc: 'Next-gen firewall, endpoint protection, dan VPN aman.' },
    { icon: 'ri-hard-drive-line', title: 'Storage & Backup', desc: 'Solusi NAS/SAN dan backup otomatis dengan RTO minimal.' },
    { icon: 'ri-router-line', title: 'SD-WAN & VPN', desc: 'Konektivitas multi-cabang yang efisien dan terenkripsi.' },
    { icon: 'ri-cpu-line', title: 'IT Infrastructure Audit', desc: 'Assessment menyeluruh untuk perencanaan upgrade infrastruktur.' }
  ],
  solEduData: [
    { icon: 'ri-presentation-line', title: 'Smartclassroom', desc: 'Ruang kelas interaktif dengan interactive flat panel dan hybrid learning.' },
    { icon: 'ri-mic-line', title: 'Microteaching Lab', desc: 'Lab simulasi mengajar dengan perekaman multi-kamera dan review.' },
    { icon: 'ri-translate-2', title: 'Lab Bahasa Digital', desc: 'Platform lab bahasa berbasis AI untuk pembelajaran bahasa modern.' },
    { icon: 'ri-team-line', title: 'LMS & E-Learning', desc: 'Learning management system terintegrasi untuk kampus.' }
  ],
  solAiData: [
    { icon: 'ri-building-line', title: 'Smart Campus', desc: 'Integrasi IoT untuk manajemen gedung, energi, dan keamanan kampus.' },
    { icon: 'ri-home-office-line', title: 'Smart Office', desc: 'Ruang kerja otomatis, booking system, dan paperless meeting.' },
    { icon: 'ri-command-line', title: 'Command Center', desc: 'Pusat kendali data terintegrasi dengan dashboard real-time.' },
    { icon: 'ri-robot-line', title: 'AI Analytics', desc: 'Analitik prediktif berbasis AI untuk decision support.' },
    { icon: 'ri-sensor-line', title: 'IoT Integration', desc: 'Sensor pintar untuk monitoring lingkungan dan aset.' },
    { icon: 'ri-vidicon-line', title: 'AV & Video Conference', desc: 'Sistem AV terintegrasi untuk rapat hybrid berkualitas tinggi.' }
  ],
  whyData: [
    { icon: 'ri-award-line', title: 'ISO 9001:2015', desc: 'Manajemen mutu bersertifikasi internasional untuk setiap proyek.' },
    { icon: 'ri-team-line', title: 'Expert Team', desc: 'Tim engineer berpengalaman di bidang ICT dan smart systems.' },
    { icon: 'ri-customer-service-2-line', title: 'End-to-End Service', desc: 'Layanan lengkap dari konsultasi hingga maintenance 24/7.' },
    { icon: 'ri-shield-check-line', title: 'TKDN Compliant', desc: 'Dukungan regulasi TKDN untuk pengadaan pemerintah dan BUMN.' }
  ],
  complianceData: [
    { icon: 'ri-shield-check-line', title: 'ISO 9001:2015', subtitle: 'Quality Management Certified', desc: 'Komitmen terhadap standar mutu internasional dalam setiap tahapan proyek — dari perencanaan hingga maintenance.', points: ['Proses terdokumentasi', 'Audit berkala', 'Continuous improvement'] },
    { icon: 'ri-government-line', title: 'TKDN Support', subtitle: 'Komitmen Produk Dalam Negeri', desc: 'Mendukung regulasi TKDN untuk pengadaan pemerintah, BUMN, dan institusi pendidikan nasional.', points: ['Dokumen TKDN lengkap', 'Sesuai LKPP', 'Vendor resmi prinsipal'] }
  ],
  trustedData: ['KEMENDIKBUD', 'KEMENAKER', 'KEMENKUMHAM', 'KEMENDAGRI', 'BUMN', 'UNIVERSITAS NEGERI'],
  portfolios: {
    "av": { title: "Audio Visual & Smart Room", client: "Kementerian Pendidikan & Kebudayaan", loc: "Jakarta", desc: "Instalasi sistem AV terintegrasi dan smart room untuk ruang sidang utama.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", cat: "edu" },
    "office": { title: "Smart Office System", client: "Kementerian Ketenagakerjaan", loc: "Jakarta Selatan", desc: "Implementasi sistem rapat digital tanpa kertas dan otomatisasi ruang kerja.", img: "https://images.unsplash.com/photo-1497366811353-2533774fa78d?auto=format&fit=crop&w=800&q=80", cat: "smart" },
    "micro": { title: "Microteaching Lab", client: "Universitas Negeri", loc: "Bandung", desc: "Laboratorium pengajaran interaktif dengan perekaman video multi-sudut.", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", cat: "edu" },
    "infra": { title: "Enterprise Data Center", client: "Kementerian Hukum & HAM", loc: "Jakarta", desc: "Pengadaan server high-availability dan sistem backup terpusat.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", cat: "infra" },
    "net": { title: "Backbone Networking", client: "BUMN & Instansi Pemerintah", loc: "Multi Cabang", desc: "Pemasangan fiber optic backbone dan router enterprise grade.", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80", cat: "infra" },
    "rental": { title: "National Event ICT Rental", client: "Event Kenegaraan Nasional", loc: "Nasional", desc: "Penyediaan ratusan unit perangkat laptop & server dengan dukungan teknis on-site.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", cat: "smart" }
  }
};

/* ==========================================================================
   4. RENDER LOGIC (DOM MANIPULATION)
   ========================================================================== */
// A. Render Sectors (Education/Gov/Enterprise)
const sectorTabs = document.querySelectorAll(".sector-btn");
const sectorDetail = document.getElementById("sectorDetail");

function renderSector(secKey) {
  const data = DKSI_DATA.sectors[secKey];
  if (!sectorDetail) return;
  sectorDetail.innerHTML = `
    <p class="text-sm font-medium text-[var(--text-soft)] leading-relaxed mb-4">${data.desc}</p>
    <div class="flex flex-wrap gap-2">
      ${data.sols.map(s => `<span class="px-3 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-[var(--brand)]">${s}</span>`).join('')}
    </div>`;
  sectorTabs.forEach(b => {
    const isActive = b.dataset.sector === secKey;
    b.className = isActive 
      ? "sector-btn py-3 px-3 rounded-xl text-[11px] font-extrabold transition-all bg-[var(--bg-card)] text-[var(--brand)] shadow-sm"
      : "sector-btn py-3 px-3 rounded-xl text-[11px] font-extrabold transition-all text-[var(--text-muted)]";
  });
}

// B. Render Process Steps
let currentStep = 0;
function renderProcess() {
  const steps = DKSI_DATA.steps;
  const btnContainer = document.getElementById("stepButtons");
  const detailContainer = document.getElementById("stepDetail");
  const progressBar = document.getElementById("processProgress");
  if (!btnContainer) return;

  btnContainer.innerHTML = steps.map((s, i) => `
    <button type="button" onclick="setStep(${i})" class="text-left p-5 rounded-2xl transition-all border ${currentStep === i ? 'bg-[var(--bg)] border-[var(--brand)] shadow-lg ring-2 ring-[var(--brand)]/20 -translate-y-1' : 'bg-[var(--bg-soft)] border-[var(--border)] hover:bg-[var(--bg)]'}">
      <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${currentStep === i ? 'bg-[var(--brand)] text-white' : 'bg-[var(--border)] text-[var(--text-muted)]'}">${s.step}</span>
      <h3 class="text-xs font-bold mt-3 mb-1 text-[var(--text)]">${s.title}</h3>
      <p class="text-[10px] text-[var(--text-muted)] line-clamp-1">${s.desc}</p>
    </button>`).join("");

  detailContainer.innerHTML = `
    <div class="grid md:grid-cols-3 gap-8 items-center">
      <div class="md:col-span-2">
        <span class="px-3 py-1 rounded-lg bg-[var(--brand)] text-white text-[10px] font-black uppercase">Tahap ${steps[currentStep].step}</span>
        <h3 class="text-2xl font-extrabold text-[var(--text)] mt-3 mb-2">${steps[currentStep].title}</h3>
        <p class="text-sm font-bold text-[var(--brand)] mb-3">${steps[currentStep].desc}</p>
        <p class="text-xs text-[var(--text-soft)] leading-relaxed">${steps[currentStep].detail}</p>
      </div>
      <div class="flex justify-end">
        <button onclick="setStep(${(currentStep + 1) % steps.length})" class="px-6 py-3 rounded-2xl bg-[var(--brand)] text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition">Selanjutnya →</button>
      </div>
    </div>`;

  if (progressBar) progressBar.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
}

// C. Render Grids (Infra, Edu, AI, Why, Compliance, Trusted)
function renderGrids() {
  const data = window.DKSI_DATA;
  
  // Services
  const sGrid = document.getElementById("servicesGrid");
  if (sGrid) sGrid.innerHTML = data.services.map(s => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 flex flex-col justify-between hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl"><div><div class="flex justify-between items-center mb-6"><span class="text-2xl font-black text-[var(--text-muted)]">${s.tag}</span><span class="px-3 py-1 rounded-full bg-[var(--bg-soft)] text-[10px] font-extrabold text-[var(--brand)] border border-[var(--border)]">DKSI</span></div><h3 class="text-xl font-extrabold text-[var(--text)] mb-1">${s.title}</h3><p class="text-xs font-bold text-[var(--text-muted)] mb-4">${s.sub}</p><p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">${s.desc}</p><ul class="space-y-2 pt-4 border-t border-[var(--border)] mb-6">${s.points.map(p => `<li class="flex items-center gap-2 text-xs font-semibold text-[var(--text)]"><i class="ri-check-line text-[var(--brand)]"></i>${p}</li>`).join('')}</ul></div><a href="#contact" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Pelajari Layanan <i class="ri-arrow-right-line"></i></a></div>`).join('');

  // Solutions: dynamic from cms.solCategories — each category renders its own grid section
  const dyn = document.getElementById("solutions-dynamic");
  if (dyn) {
    const cats = (window.CMS ? window.CMS.get().solCategories : null) || [
      { id: 'solInfra', name: 'IT Infrastructure & Security', desc: 'Solusi infrastruktur TI dan keamanan siber untuk instansi dan enterprise.', icon: 'ri-server-line' },
      { id: 'solEdu', name: 'Smart Education & Digital Learning', desc: 'Ruang kelas interaktif, lab bahasa berbasis AI, dan sistem manajemen pembelajaran.', icon: 'ri-presentation-line' },
      { id: 'solAi', name: 'AI, IoT & Smart Innovation', desc: 'Inovasi teknologi terkini untuk smart campus, smart office, dan command center.', icon: 'ri-robot-line' }
    ];
    const getArr = (id) => (window.CMS ? window.CMS.get()[id] : null) || data[id + 'Data'] || data[id] || [];
    const iFromBg = ['bg-[var(--bg)]', 'bg-[var(--bg-soft)]', 'bg-[var(--bg)]', 'bg-[var(--bg-soft)]', 'bg-[var(--bg)]'];
    const sectionHtml = cats.map((cat, idx) => {
      const arr = getArr(cat.id);
      if (!arr.length) return '';
      const bgClass = iFromBg[idx % iFromBg.length];
      const isEduStyle = cat.id === 'solEdu' || cat.name.toLowerCase().includes('education');
      if (isEduStyle) {
        return `
          <section id="${cat.id}" class="py-20 lg:py-28 ${bgClass}">
            <div class="max-w-[1280px] mx-auto px-6 lg:px-8">
              <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="relative">
                  <div class="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-royal/10 to-cyan/10 rounded-[40px] -z-10"></div>
                  <img src="${arr[0]?.img || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'}" class="w-full h-[400px] object-cover rounded-[32px]" alt="${cat.name}">
                </div>
                <div>
                  <div class="label mb-2">${cat.name}</div>
                  <p class="text-[var(--text-soft)] leading-relaxed mb-8">${cat.desc}</p>
                  <div class="space-y-4">${arr.map(s => `<div class="flex gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--brand)] transition-all"><div class="w-12 h-12 rounded-xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-xl flex-shrink-0"><i class="${s.icon || 'ri-service-line'}"></i></div><div><h4 class="font-extrabold text-sm text-[var(--text)]">${s.title}</h4><p class="text-xs text-[var(--text-soft)] mt-1 leading-relaxed">${s.shortDesc || s.desc}</p></div></div>`).join('')}</div>
                </div>
              </div>
            </div>
          </section>`;
      }
      return `
        <section id="${cat.id}" class="py-20 lg:py-28 ${bgClass}">
          <div class="max-w-[1280px] mx-auto px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
              <div class="label mb-2">${cat.name}</div>
              <p class="text-[var(--text-soft)] mt-4">${cat.desc}</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${arr.map(s => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl"><div class="w-12 h-12 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-xl mb-4"><i class="${s.icon || 'ri-service-line'}"></i></div><h3 class="font-extrabold text-lg mb-2 text-[var(--text)]">${s.title}</h3><p class="text-sm text-[var(--text-soft)] leading-relaxed mb-4">${s.shortDesc || s.desc}</p><button onclick="openSolutionModal('${s.title}')" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Detail <i class="ri-arrow-right-line"></i></button></div>`).join('')}
            </div>
          </div>
        </section>`;
    }).join('');
    dyn.innerHTML = sectionHtml;
    // Also sync map overrides for legacy ids if requested
    if (window.CMS && window.CMS.get().solInfra) window.DKSI_DATA.solInfraData = window.CMS.get().solInfra.map(x => ({ icon: x.icon || "ri-service-line", title: x.title, desc: x.desc || x.shortDesc || '' }));
    if (window.CMS && window.CMS.get().solEdu) window.DKSI_DATA.solEduData = window.CMS.get().solEdu.map(x => ({ icon: x.icon || "ri-presentation-line", title: x.title, desc: x.desc || x.shortDesc || '' }));
    if (window.CMS && window.CMS.get().solAi) window.DKSI_DATA.solAiData = window.CMS.get().solAi.map(x => ({ icon: x.icon || "ri-building-line", title: x.title, desc: x.desc || x.shortDesc || '' }));
    return; // skip hardcoded renderers below when dynamic rendered
  }

  // Legacy static renderers (fallback only if #solutions-dynamic missing — currently not rendered)
  // Solutions: Infra
  const infraGrid = document.getElementById("solInfraGrid");
  if (infraGrid) infraGrid.innerHTML = data.solInfraData.map(s => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl"><div class="w-12 h-12 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-xl mb-4"><i class="${s.icon}"></i></div><h3 class="font-extrabold text-lg mb-2 text-[var(--text)]">${s.title}</h3><p class="text-sm text-[var(--text-soft)] leading-relaxed mb-4">${s.desc}</p><button onclick="openSolutionModal('${s.title}')" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Detail <i class="ri-arrow-right-line"></i></button></div>`).join('');

  // Solutions: Education
  const eduList = document.getElementById("solEduList");
  if (eduList) eduList.innerHTML = data.solEduData.map(s => `<div class="flex gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--brand)] transition-all"><div class="w-12 h-12 rounded-xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-xl flex-shrink-0"><i class="${s.icon}"></i></div><div><h4 class="font-extrabold text-sm text-[var(--text)]">${s.title}</h4><p class="text-xs text-[var(--text-soft)] mt-1 leading-relaxed">${s.desc}</p></div></div>`).join('');

  // Solutions: AI & Smart
  const aiGrid = document.getElementById("solAiGrid");
  if (aiGrid) aiGrid.innerHTML = data.solAiData.map(s => `<div class="bg-[var(--bg-soft)] border border-[var(--border)] rounded-[32px] p-8 hover:bg-[var(--bg-card)] hover:border-[var(--brand)] transition-all"><div class="w-12 h-12 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-xl mb-4"><i class="${s.icon}"></i></div><h3 class="font-extrabold text-lg mb-2 text-[var(--text)]">${s.title}</h3><p class="text-sm text-[var(--text-soft)] leading-relaxed mb-4">${s.desc}</p><button onclick="openSolutionModal('${s.title}')" class="text-xs font-extrabold text-[var(--brand)]">Pelajari →</button></div>`).join('');

  // Why Us
  const wGrid = document.getElementById("whyGrid");
  if (wGrid) wGrid.innerHTML = data.whyData.map(w => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl"><div class="w-14 h-14 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-2xl mb-4"><i class="${w.icon}"></i></div><h3 class="font-extrabold text-lg mb-2 text-[var(--text)]">${w.title}</h3><p class="text-sm text-[var(--text-soft)] leading-relaxed">${w.desc}</p></div>`).join('');

  // Compliance
  const cGrid = document.getElementById("complianceGrid");
  if (cGrid) cGrid.innerHTML = data.complianceData.map(c => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all"><div class="w-14 h-14 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white dark:text-darkBg text-2xl mb-6"><i class="${c.icon}"></i></div><h3 class="text-2xl font-extrabold text-[var(--text)] mb-1">${c.title}</h3><p class="text-xs font-bold text-[var(--brand)] mb-4 uppercase tracking-widest">${c.subtitle}</p><p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">${c.desc}</p><ul class="space-y-2">${c.points.map(p => `<li class="flex items-center gap-2 text-xs font-semibold text-[var(--text)]"><i class="ri-check-line text-emerald-500"></i>${p}</li>`).join('')}</ul></div>`).join('');

  // Trusted By
  const tLogos = document.getElementById("trustedLogos");
  if (tLogos) tLogos.innerHTML = data.trustedData.map(n => `<div class="px-6 py-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] text-xs font-black tracking-widest text-[var(--text-muted)]">${n}</div>`).join('');
}

// D. Render Portfolios with Filter
const pfGrid = document.getElementById("portfolioGrid");
function renderPortfolio(cat = 'all') {
  if (!pfGrid) return;
  const items = Object.entries(DKSI_DATA.portfolios);
  const filtered = cat === 'all' ? items : items.filter(([k, v]) => v.cat === cat);
  
  pfGrid.innerHTML = filtered.map(([k, p]) => `
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] overflow-hidden group hover:border-[var(--brand)] transition-all shadow-sm hover:shadow-xl flex flex-col justify-between">
      <div>
        <div class="overflow-hidden h-[180px]"><img src="${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt=""></div>
        <div class="p-8">
          <span class="text-[10px] font-mono tracking-widest text-[var(--brand)] uppercase font-bold">${p.client} • ${p.loc}</span>
          <h3 class="text-lg font-extrabold text-[var(--text)] mt-1 mb-2">${p.title}</h3>
          <p class="text-xs text-[var(--text-soft)] leading-relaxed">${p.desc}</p>
        </div>
      </div>
      <div class="px-8 pb-8"><button onclick="openModal('${k}')" class="text-xs font-extrabold text-[var(--brand)] flex items-center gap-2">Detail Project <i class="ri-arrow-right-line"></i></button></div>
    </div>`).join('');
}

/* ==========================================================================
   5. MODALS & FORMS
   ========================================================================== */
function openModal(key) {
  const p = DKSI_DATA.portfolios[key];
  if (!p) return;
  document.getElementById("mContent").innerHTML = `
    <img src="${p.img}" class="w-full h-[260px] object-cover rounded-2xl mb-6 shadow-md">
    <span class="text-xs font-mono text-[var(--brand)] font-bold uppercase">${p.client} • ${p.loc}</span>
    <h3 class="text-2xl font-extrabold text-[var(--text)] mt-1 mb-3">${p.title}</h3>
    <p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">${p.desc}</p>
    <div class="p-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] flex justify-between items-center">
      <span class="text-xs font-bold text-[var(--text-muted)]">Status: Selesai & Beroperasi</span>
      <a href="#contact" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-black uppercase">Konsultasi Serupa</a>
    </div>`;
  toggleModal('solutionModal', true);
}

function openSolutionModal(title) {
  document.getElementById("mContent").innerHTML = `
    <div class="w-16 h-16 rounded-2xl bg-royal dark:bg-cyan flex items-center justify-center text-white text-2xl mb-6"><i class="ri-star-line"></i></div>
    <h3 class="text-2xl font-extrabold text-[var(--text)] mb-3">${title}</h3>
    <p class="text-sm text-[var(--text-soft)] leading-relaxed mb-6">Solusi ${title} dari DKSI dirancang untuk memenuhi kebutuhan infrastruktur digital modern dengan standar keamanan dan performa tinggi.</p>
    <a href="#contact" onclick="closeModal()" class="inline-flex px-6 py-3 rounded-xl bg-[var(--brand)] text-white text-xs font-black uppercase">Konsultasi solusi ini →</a>`;
  toggleModal('solutionModal', true);
}

function toggleModal(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) { el.classList.remove("hidden"); el.classList.add("flex"); document.body.style.overflow = 'hidden'; }
  else { el.classList.add("hidden"); el.classList.remove("flex"); document.body.style.overflow = ''; }
}

function closeModal() { toggleModal('solutionModal', false); }
function closeConsultModal() { toggleModal('consultModal', false); }

// Global Window Hooks
window.setStep = i => { currentStep = i; renderProcess(); };
window.openModal = openModal;
window.closeModal = closeModal;
window.openSolutionModal = openSolutionModal;
window.closeConsultModal = closeConsultModal;

  // Forms Logic — also push to CMS contacts inbox
  function setupForms() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.onsubmit = e => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        const nameVal = inputs[0]?.value || "";
        const companyVal = inputs[1]?.value || "";
        const emailVal = inputs[2]?.value || "";
        const phoneVal = inputs[3]?.value || "";
        const catVal = inputs[4]?.value || "";
        const msgVal = inputs[5]?.value || "";
        if (window.CMS && typeof CMS.contactsAdd === 'function') {
          CMS.contactsAdd({ name: nameVal, company: companyVal, email: emailVal, phone: phoneVal, category: catVal, message: msgVal });
        }
        const msg = document.getElementById("formMsg");
        if (msg) msg.classList.remove("hidden");
        contactForm.reset();
        setTimeout(() => msg && msg.classList.add("hidden"), 5000);
      };
    }
    const consultForm = document.getElementById("consultForm");
    if (consultForm) {
      consultForm.onsubmit = e => {
        e.preventDefault();
        const inputs = consultForm.querySelectorAll('input, textarea, select');
        const nameVal = inputs[0]?.value || "";
        const companyVal = inputs[1]?.value || "";
        const emailVal = inputs[2]?.value || "";
        const catVal = inputs[3]?.value || "";
        if (window.CMS && typeof CMS.contactsAdd === 'function') {
          CMS.contactsAdd({ name: nameVal, company: companyVal, email: emailVal, phone: "", category: catVal, message: "Via consult modal" });
        }
        const msg = document.getElementById("consultMsg");
        if (msg) msg.classList.remove("hidden");
        consultForm.reset();
        setTimeout(() => { if (msg) msg.classList.add("hidden"); closeConsultModal(); }, 2500);
      };
    }
  }

/* ==========================================================================
   6. INITIALIZATION
   ========================================================================== */
function initSectors() {
  const tabs = document.querySelectorAll(".sector-btn");
  const detail = document.getElementById("sectorDetail");
  if (!tabs.length || !detail) { setTimeout(initSectors, 300); return; }
  tabs.forEach(b => {
    b.addEventListener("click", () => renderSector(b.dataset.sector));
  });
  renderSector("education");
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

  // Filters binding
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.onclick = () => {
      document.querySelectorAll(".filter-btn").forEach(x => x.className = "filter-btn");
      b.className = "filter-btn active";
      renderPortfolio(b.dataset.filter);
    };
  });

  // Re-apply CMS after init so hero/trust/about reflect admin data
  if (window.CMS && typeof applyCMS === 'function') { try { applyCMS(); renderGrids(); renderPortfolio('all'); } catch(e){} }
});

// Also listen for CMS updates cross-tab
window.addEventListener("cms:update", () => { try { applyCMS(); renderGrids(); renderPortfolio('all'); renderSector("education"); } catch(e){} });

// If script loaded after DOM already ready (deferred), init immediately
if (document.readyState !== 'loading') {
  setTimeout(() => { initSectors(); renderGrids(); renderPortfolio('all'); }, 100);
}
