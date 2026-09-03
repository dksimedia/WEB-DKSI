// =============================================
// DKSI CONTENT API — localStorage-based CMS Bridge
// =============================================
// Source of Truth: localStorage["dksi_cms_v2"]
// Public API: window.CMS.get()
// Admin API: window.CMS.set() saves & dispatches "cms:update"

(function () {
  const KEY = "dksi_cms_v2";

  const DEFAULTS = {
    homepage: {
      eyebrow: "YOUR TRUSTED PARTNER FOR INTEGRATED ICT",
      headline: "Support Your",
      headlineAccent: "Business",
      headlineSuffix: "With ICT",
      description: "Menghadirkan solusi ICT terintegrasi untuk membantu pendidikan, pemerintahan, dan enterprise menjadi lebih terkoneksi, aman, dan efisien.",
      primaryCtaText: "Kebutuhan Anda",
      primaryCtaLink: "#contact",
      secondaryCtaText: "Jelajahi Solusi",
      secondaryCtaLink: "#solutions-infra",
      heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1100&q=80",
      heroBadges: ["AI", "IoT", "SECURITY", "NETWORK", "DATA", "SMART"]
    },
    trustBar: [
      { label: "Established", value: "2019" },
      { label: "Quality", value: "ISO 9001:2015" },
      { label: "Approach", value: "End-to-End" },
      { label: "Expertise", value: "ICT Solutions" },
      { label: "Compliance", value: "TKDN Support" }
    ],
    about: {
      label: "DKSI Profile",
      headline: "Solusi ICT Terintegrasi Untuk Masa Depan Digital",
      paragraphs: [
        "PT Dua Kawan Sejahtera Indonesia (DKSI) adalah partner strategis dalam modernisasi infrastruktur teknologi informasi untuk sektor pendidikan, pemerintahan, dan enterprise.",
        "Berdiri sejak 2019, kami berkomitmen menghadirkan teknologi yang andal, aman, dan adaptif sesuai kebutuhan spesifik institusi Anda."
      ],
      sectorEducation: "Pendidikan",
      sectorGovernment: "Pemerintahan",
      sectorEnterprise: "Enterprise",
      ctaPrimary: "Konsultasi Sektor",
      ctaSecondary: "Lihat Alur Kerja"
    },
    branding: {
      mainLogo: "assets/logo/main.png",
      secondaryLight: "assets/logo/secondary-light.png",
      secondaryDark: "assets/logo/secondary-dark.png",
      favicon: "assets/logo/main.png"
    },
    company: {
      name: "PT Dua Kawan Sejahtera Indonesia",
      shortName: "DKSI",
      tagline: "Support Your Business With ICT",
      subTagline: "Your Trusted Partner for Integrated ICT & Smart Solutions",
      established: "2019",
      address: "Rukan Crown Palace Blok D.3, Jl. Prof Dr. Soepomo No. 231, Tebet, Jakarta Selatan",
      city: "Jakarta, Indonesia",
      email: "sales@dksi.co.id",
      phone: "+62 811-1234-5678",
      website: "https://www.dksi.co.id",
      stats: { cert1: "ISO 9001:2015", cert2: "TKDN Support", establishedLabel: "EST. 2019" }
    },
    process: {
      label: "WORK PROCESS",
      headline: "End-to-End Solution Process",
      steps: [
        { num: "01", title: "Consultation", desc: "Analisis kebutuhan sistem.", detail: "Discovery mendalam untuk memetakan tantangan operasional dan teknis instansi Anda." },
        { num: "02", title: "Assessment", desc: "Audit infrastruktur existing.", detail: "Pemeriksaan menyeluruh terhadap perangkat, jaringan, dan keamanan saat ini." },
        { num: "03", title: "Solution Design", desc: "Arsitektur dan perencanaan.", detail: "Merancang topologi, spesifikasi hardware/software, dan estimasi anggaran yang efisien." },
        { num: "04", title: "Implementation", desc: "Eksekusi oleh expert.", detail: "Pemasangan perangkat, konfigurasi jaringan, dan integrasi sistem dengan standar ISO." },
        { num: "05", title: "Training", desc: "Transfer knowledge.", detail: "Pelatihan operasional bagi tim internal untuk memastikan pemanfaatan sistem optimal." },
        { num: "06", title: "Maintenance", desc: "Dukungan purna jual 24/7.", detail: "Monitoring berkala, pemeliharaan preventif, dan layanan teknis responsif." }
      ]
    },
    services: [
      { tag: "01", title: "DKSI Solutions", sub: "IT Infrastructure & Security", desc: "Membangun pondasi jaringan, server, dan keamanan siber yang tangguh.", points: ["Server & Storage", "Next-Gen Firewall", "Structured Cabling"], visible: true },
      { tag: "02", title: "DKSI Data", sub: "Data Center & Cloud", desc: "Manajemen pusat data dan integrasi cloud untuk skalabilitas tinggi.", points: ["Hybrid Cloud", "Disaster Recovery", "Monitoring 24/7"], visible: true },
      { tag: "03", title: "DKSI Apps", sub: "Custom Software & ERP", desc: "Pengembangan aplikasi web/mobile terintegrasi sesuai kebutuhan institusi.", points: ["Custom ERP", "Mobile Apps", "API Integration"], visible: true },
      { tag: "04", title: "DKSI Procurement", sub: "ICT Procurement Services", desc: "Layanan pengadaan perangkat resmi dengan dukungan TKDN lengkap.", points: ["Sesuai LKPP/TKDN", "Garansi Prinsipal", "Transparent Pricing"], visible: true },
      { tag: "05", title: "DKSI Rental", sub: "IT Equipment Rental", desc: "Solusi sewa perangkat IT fleksibel untuk event kenegaraan & korporasi.", points: ["Laptop & Server", "Harian/Bulanan", "Full Maintenance"], visible: true }
    ],
    solInfra: [
      { id: 'infra-1', icon: 'ri-server-line', title: 'Data Center & Server', shortDesc: 'Pengadaan dan instalasi server enterprise, storage, dan disaster recovery.', desc: 'Solusi pusat data enterprise yang handal, scalable, dan aman untuk mendukung operasional bisnis 24/7.', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', features: ['Server Rack Enterprise', 'SAN/NAS Storage', 'Backup Otomatis', 'DR Center'], benefits: ['Uptime 99.9%', 'Scalable', 'ISO 27001'], status: 'published' },
      { id: 'infra-2', icon: 'ri-wifi-line', title: 'Networking & WiFi', shortDesc: 'Backbone fiber, switching, dan WiFi enterprise untuk coverage optimal.', desc: 'Infrastruktur jaringan enterprise-grade fiber optic backbone + managed switch + WiFi 6.', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', features: ['Fiber Optic 10G', 'Managed Switch L3', 'WiFi 6 AP', 'Network Monitoring'], benefits: ['10 Gbps', 'Coverage 100%', 'Auto failover'], status: 'published' }
    ],
    solEdu: [
      { id: 'edu-1', icon: 'ri-presentation-line', title: 'Smartclassroom', shortDesc: 'Ruang kelas interaktif dengan interactive flat panel dan hybrid learning.', desc: 'Ruang kelas modern dengan interactive flat panel 75-86 inci, video conference, dan platform hybrid learning.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', features: ['Interactive Flat Panel', 'Hybrid Conference', 'Wireless Casting', 'Auto Recording'], benefits: ['Interaktif', 'Hybrid learning', 'Rekam otomatis'], status: 'published' }
    ],
    solAi: [
      { id: 'ai-1', icon: 'ri-building-line', title: 'Smart Campus', shortDesc: 'Integrasi IoT untuk manajemen gedung, energi, dan keamanan kampus.', desc: 'Platform IoT terintegrasi untuk manajemen gedung pintar, monitoring energi real-time, dan sistem keamanan kampus otomatis.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', features: ['IoT Sensors', 'Energy Management', 'Smart Access', 'Real-time Monitoring'], benefits: ['Efisiensi energi 30%', 'Monitoring terpusat', 'Automation'], status: 'published' }
    ],
    solCategories: [
      { id: 'solInfra', name: 'IT Infrastructure & Network Security', desc: 'Solusi infrastruktur TI dan keamanan siber untuk instansi dan enterprise.', icon: 'ri-server-line', color: 'royal' },
      { id: 'solEdu', name: 'Smart Education & Digital Learning', desc: 'Ruang kelas interaktif, lab bahasa berbasis AI, dan sistem manajemen pembelajaran.', icon: 'ri-presentation-line', color: 'cyan' },
      { id: 'solAi', name: 'AI, IoT & Smart Innovation', desc: 'Inovasi teknologi terkini untuk smart campus, smart office, dan command center.', icon: 'ri-robot-line', color: 'navy' }
    ],
    buildSmarter: {
      label: "BUILD SMARTER",
      headline: "Bangun Infrastruktur Digital yang Lebih",
      headlineAccent: "Cerdas",
      description: "Dari jaringan enterprise hingga kampus pintar, kami mengintegrasikan teknologi terkini untuk efisiensi dan daya saing Anda.",
      cards: [
        { icon: 'ri-server-line', title: 'High-Performance', desc: 'Infrastructure berperforma tinggi untuk kebutuhan skala enterprise.' },
        { icon: 'ri-brain-line', title: 'AI-Ready', desc: 'Platform siap AI untuk analitik prediktif dan otomatisasi bisnis.' },
        { icon: 'ri-shield-check-line', title: 'Secure by Design', desc: 'Keamanan terintegrasi dari desain awal hingga monitoring.' }
      ]
    },
    why: [
      { icon: 'ri-award-line', title: 'ISO 9001:2015', desc: 'Manajemen mutu bersertifikasi internasional untuk setiap proyek.' },
      { icon: 'ri-team-line', title: 'Expert Team', desc: 'Tim engineer berpengalaman di bidang ICT dan smart systems.' },
      { icon: 'ri-customer-service-2-line', title: 'End-to-End Service', desc: 'Layanan lengkap dari konsultasi hingga maintenance 24/7.' },
      { icon: 'ri-shield-check-line', title: 'TKDN Compliant', desc: 'Dukungan regulasi TKDN untuk pengadaan pemerintah dan BUMN.' }
    ],
    compliance: [
      { icon: 'ri-shield-check-line', title: 'ISO 9001:2015', subtitle: 'Quality Management Certified', desc: 'Komitmen terhadap standar mutu internasional dalam setiap tahapan proyek.', points: ['Proses terdokumentasi', 'Audit berkala', 'Continuous improvement'] },
      { icon: 'ri-government-line', title: 'TKDN Support', subtitle: 'Komitmen Produk Dalam Negeri', desc: 'Mendukung regulasi TKDN untuk pengadaan pemerintah dan institusi nasional.', points: ['Dokumen TKDN lengkap', 'Sesuai LKPP', 'Vendor resmi prinsipal'] }
    ],
    trusted: [
      { name: "KEMENDIKBUD", subtitle: "Kementerian P&K" },
      { name: "KEMENAKER", subtitle: "Kementerian Ketenagakerjaan" },
      { name: "KEMENKUMHAM", subtitle: "Kementerian Hukum & HAM" },
      { name: "KEMENDAGRI", subtitle: "Kementerian Dalam Negeri" },
      { name: "BUMN", subtitle: "BUMN & Enterprise" },
      { name: "UNIVERSITAS", subtitle: "Universitas Negeri" }
    ],
    portfolio: {
      items: {
        "av": { title: "Audio Visual & Smart Room", client: "Kementerian Pendidikan & Kebudayaan", loc: "Jakarta", shortDesc: "Instalasi sistem AV terintegrasi dan smart room untuk ruang paperless.", desc: "Implementasi komprehensif sistem AV terintegrasi mencakup display interaktif, audio conference, dan manajemen ruang pintar.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", cat: "smart", featured: false, status: "published" },
        "office": { title: "Smart Office System", client: "Kementerian Ketenagakerjaan", loc: "Jakarta Selatan", desc: "Paperless Conference System dan digital office automation.", img: "https://images.unsplash.com/photo-1497366811353-2533774fa78d?auto=format&fit=crop&w=800&q=80", cat: "smart", featured: true, status: "published" },
        "micro": { title: "Microteaching Lab", client: "Universitas Negeri", loc: "Bandung", desc: "Lab simulasi mengajar dengan perekaman multi-kamera.", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", cat: "edu", featured: false, status: "published" },
        "infra": { title: "Enterprise Data Center", client: "Kementerian Hukum & HAM", loc: "Jakarta", desc: "Server high-availability dan sistem backup terpusat.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", cat: "infra", featured: false, status: "published" },
        "net": { title: "Backbone Networking", client: "BUMN & Instansi Pemerintah", loc: "Multi Cabang", desc: "Pemasangan fiber optic backbone dan router enterprise grade.", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80", cat: "infra", featured: false, status: "published" },
        "rental": { title: "National Event ICT Rental", client: "Event Kenegaraan Nasional", loc: "Nasional", desc: "Penyediaan ratusan unit perangkat laptop & server dengan dukungan teknis on-site.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", cat: "smart", featured: false, status: "published" }
      },
      filterOrder: ["all", "edu", "infra", "smart"]
    },
    finalCta: {
      label: "PT Dua Kawan Sejahtera Indonesia",
      headline: "Siap Membangun Infrastruktur Digital Anda?",
      description: "Konsultasikan kebutuhan ICT dengan ahli kami. Dapatkan solusi terintegrasi untuk instansi atau bisnis Anda.",
      primaryText: "Konsultasi Sekarang",
      primaryLink: "#contact",
      secondaryText: "Hubungi Kami",
      secondaryLink: "tel:+622112345678"
    },
    contact: {
      title: "Let's Build Your ICT Solution",
      phone: "+62 811-1234-5678",
      address: "Rukan Crown Palace Blok D.3, Jl. Prof Dr. Soepomo No. 231, Tebet, Jakarta Selatan",
      formLabels: {
        name: "Nama Lengkap",
        inst: "Instansi / Perusahaan",
        email: "Email",
        phone: "Nomor Telepon / WhatsApp",
        category: "Kategori Kebutuhan",
        message: "Pesan / Detail Kebutuhan"
      },
      submitText: "Kirim Konsultasi",
      successMsg: "Pesan Terkirim! Tim kami akan menghubungi dalam 1×24 jam."
    },
    seo: {
      title: "PT Dua Kawan Sejahtera Indonesia | Integrated ICT & Smart Solutions",
      description: "DKSI menyediakan solusi ICT terintegrasi untuk pendidikan, pemerintahan, dan enterprise.",
      keywords: "ICT, infrastruktur, smart education, AI, IoT, data center, pengadaan",
      ogImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
    },
    social: {
      linkedin: "#",
      instagram: "#",
      twitter: "#",
      facebook: "#",
      youtube: "#",
      email: "mailto:sales@dksi.co.id"
    },
    meta: {
      publishedCount: 6,
      draftsCount: 0,
      version: 2,
      lastPublished: new Date().toISOString()
    }
  };

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return deepClone(DEFAULTS);
      const parsed = JSON.parse(raw);
      return mergeDefaults(deepClone(DEFAULTS), parsed);
    } catch (e) {
      return deepClone(DEFAULTS);
    }
  }

  function mergeDefaults(base, override) {
    if (override === null || typeof override !== "object") return override ?? base;
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    for (const k of Object.keys(override)) {
      if (k in base) {
        if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
          base[k] = mergeDefaults(base[k], override[k]);
        } else {
          base[k] = override[k];
        }
      } else {
        base[k] = override[k];
      }
    }
    return base;
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("cms:update", { detail: data }));
    try {
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel("dksi_cms");
        bc.postMessage({ type: "update", data });
        bc.close();
      }
    } catch (e) {}
  }

  function get() { return load(); }

  function set(patch) {
    const current = load();
    const next = mergeDefaults(current, patch);
    save(next);
    return next;
  }

  function setPath(path, value) {
    const data = load();
    const parts = path.split(".");
    let cur = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in cur) || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    save(data);
    return data;
  }

  function reset() {
    localStorage.removeItem(KEY);
    const fresh = deepClone(DEFAULTS);
    save(fresh);
    return fresh;
  }

  function addActivity(action, target) {
    const ACT_KEY = "dksi_activity_v2";
    const list = JSON.parse(localStorage.getItem(ACT_KEY) || "[]");
    list.unshift({ id: Date.now(), action, target, user: "Admin", time: new Date().toISOString() });
    localStorage.setItem(ACT_KEY, JSON.stringify(list.slice(0, 100)));
  }

  function getActivity() {
    return JSON.parse(localStorage.getItem("dksi_activity_v2") || "[]");
  }

  function getMedia() {
    return JSON.parse(localStorage.getItem("dksi_media_v2") || "[]");
  }

  function addMedia(entry) {
    const list = getMedia();
    list.unshift({ id: Date.now() + Math.random(), url: entry.url, name: entry.name || "upload", alt: entry.alt || "", size: entry.size || 0, date: new Date().toISOString(), category: entry.category || "general" });
    localStorage.setItem("dksi_media_v2", JSON.stringify(list.slice(0, 200)));
  }

  function contactsAdd(entry) {
    const K = "dksi_contacts_v2";
    const list = JSON.parse(localStorage.getItem(K) || "[]");
    list.unshift({ id: Date.now(), name: entry.name, company: entry.company || "", email: entry.email, phone: entry.phone || "", category: entry.category || "", message: entry.message || "", status: "New", date: new Date().toISOString() });
    localStorage.setItem(K, JSON.stringify(list));
    addActivity("New inquiry", entry.name + " — " + (entry.company || entry.email));
  }

  function contactsList() {
    return JSON.parse(localStorage.getItem("dksi_contacts_v2") || "[]");
  }

  function revisionsPush(snapshot) {
    const K = "dksi_revisions_v2";
    const list = JSON.parse(localStorage.getItem(K) || "[]");
    list.unshift({ id: Date.now(), data: deepClone(snapshot), date: new Date().toISOString(), user: "Admin" });
    localStorage.setItem(K, JSON.stringify(list.slice(0, 30)));
  }

  function revisionsList() {
    return JSON.parse(localStorage.getItem("dksi_revisions_v2") || "[]");
  }

  window.CMS = {
    KEY,
    DEFAULTS: deepClone(DEFAULTS),
    get, set, setPath, save, load, reset, mergeDefaults,
    addActivity, getActivity,
    getMedia, addMedia,
    contactsAdd, contactsList,
    revisionsPush, revisionsList,
    deepClone
  };

  if (!localStorage.getItem(KEY)) {
    save(deepClone(DEFAULTS));
  }

  try {
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel("dksi_cms");
      bc.onmessage = (e) => {
        if (e.data && e.data.type === "update") {
          localStorage.setItem(KEY, JSON.stringify(e.data.data));
          window.dispatchEvent(new CustomEvent("cms:update", { detail: e.data.data }));
        }
      };
    }
  } catch (e) {}

  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      window.dispatchEvent(new CustomEvent("cms:update", { detail: JSON.parse(e.newValue) }));
    }
  });

  console.log("[CMS] cms-data.js loaded — localStorage bridge active");
})();
