// CMS data fetcher with ISR revalidation
// Fetches from NEXT_PUBLIC_API_URL or localhost:8000/api/cms
// Falls back to local seed data if fetch fails

const DEFAULT_REVALIDATE = 60; // 1 minute ISR

// Type definitions for 22 CMS keys
export interface CMSBadge {
  text: string;
  color?: string;
}

export interface CMSHomepage {
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  headlineSuffix?: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  heroImage?: string;
  heroBadges?: CMSBadge[];
}

export interface CMSTrustBarItem {
  label: string;
  value: string;
}

export interface CMSAbout {
  label?: string;
  headline: string;
  paragraphs: string[];
  sectorEducation?: string;
  sectorGovernment?: string;
  sectorEnterprise?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export interface CMSSector {
  desc: string;
  sols: string[];
}

export interface CMSSectors {
  education: CMSSector;
  government: CMSSector;
  enterprise: CMSSector;
}

export interface CMSBranding {
  mainLogo: string;
  secondaryLight: string;
  secondaryDark: string;
  favicon?: string;
}

export interface CMSCompanyStats {
  cert1?: string;
  cert2?: string;
  establishedLabel?: string;
}

export interface CMSCompany {
  name: string;
  shortName?: string;
  tagline: string;
  subTagline?: string;
  established?: number;
  address: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  stats?: CMSCompanyStats;
}

export interface CMSProcessStep {
  num: number;
  title: string;
  desc: string;
  detail: string;
}

export interface CMSProcess {
  label?: string;
  headline: string;
  steps: CMSProcessStep[];
}

export interface CMSService {
  tag: string;
  icon: string;
  title: string;
  sub: string;
  desc: string;
  points: string[];
  target: string;
  benefit: string;
  visible: boolean;
}

export interface CMSSolutionCard {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  desc: string;
  img?: string;
  features: string[];
  benefits: string[];
  status: string;
}

export interface CMSSolCategory {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

export interface CMSBuildSmarter {
  label?: string;
  headline: string;
  headlineAccent?: string;
  description: string;
  cards: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
}

export interface CMSWhyItem {
  icon: string;
  title: string;
  desc: string;
}

export interface CMSCompliance {
  icon: string;
  title: string;
  subtitle?: string;
  desc: string;
  points: string[];
}

export interface CMSTrustedItem {
  name: string;
  subtitle?: string;
  logo: string;
}

export interface CMSPortfolioItem {
  title: string;
  client: string;
  loc: string;
  shortDesc: string;
  desc: string;
  img?: string;
  cat: string;
  featured?: boolean;
  status: string;
}

export interface CMSPortfolio {
  items: Record<string, CMSPortfolioItem>;
  filterOrder: string[];
}

export interface CMSFinalCta {
  label?: string;
  headline: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export interface CMSContact {
  title: string;
  phone: string;
  address: string;
  formLabels: {
    name: string;
    inst: string;
    email: string;
    phone: string;
    category: string;
    message: string;
  };
  submitText: string;
  successMsg: string;
}

export interface CMSSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export interface CMSSocial {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  email?: string;
}

export interface CMSMeta {
  publishedCount?: number;
  draftsCount?: number;
  version?: string;
  lastPublished?: string;
}

export interface CMSData {
  homepage: CMSHomepage;
  trustBar: CMSTrustBarItem[];
  about: CMSAbout;
  sectors: CMSSectors;
  branding: CMSBranding;
  company: CMSCompany;
  process: CMSProcess;
  services: CMSService[];
  solInfra: CMSSolutionCard[];
  solEdu: CMSSolutionCard[];
  solAi: CMSSolutionCard[];
  solCategories: CMSSolCategory[];
  buildSmarter: CMSBuildSmarter;
  why: CMSWhyItem[];
  compliance: CMSCompliance[];
  trusted: CMSTrustedItem[];
  portfolio: CMSPortfolio;
  finalCta: CMSFinalCta;
  contact: CMSContact;
  seo: CMSSEO;
  social: CMSSocial;
  meta: CMSMeta;
}

// Local seed data fallback
const CMS_SEED: CMSData = {
  homepage: {
    eyebrow: "Welcome to DKSI",
    headline: "Build Tomorrow's Digital Solutions",
    headlineAccent: "Today",
    headlineSuffix: "",
    description: "Enterprise-grade IT solutions for government, education, and business.",
    primaryCtaText: "Get Started",
    primaryCtaLink: "#contact",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "#about",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    heroBadges: [
      { text: "ISO 9001", color: "blue" },
      { text: "TKDN Certified", color: "green" },
      { text: "24/7 Support", color: "purple" },
      { text: "10+ Years", color: "orange" },
      { text: "500+ Clients", color: "red" },
      { text: "99.9% Uptime", color: "cyan" },
    ],
  },
  trustBar: [
    { label: "Established", value: "2013" },
    { label: "Quality", value: "ISO 9001" },
    { label: "Approach", value: "Agile" },
    { label: "Expertise", value: "500+" },
    { label: "Compliance", value: "TKDN" },
  ],
  about: {
    label: "About Us",
    headline: "Your Partner in Digital Excellence",
    paragraphs: [
      "DKSI is a leading Indonesian technology company specializing in comprehensive IT solutions.",
      "We serve government, education, and enterprise sectors with proven expertise and commitment.",
    ],
    ctaPrimary: "View Our Work",
    ctaSecondary: "Contact Us",
  },
  sectors: {
    education: {
      desc: "Smart learning solutions for modern institutions",
      sols: ["Smart Classroom", "Digital Lab", "Learning Analytics", "Campus Management"],
    },
    government: {
      desc: "Secure infrastructure for public services",
      sols: ["eGov Platform", "Data Security", "Network Security", "Cloud Services"],
    },
    enterprise: {
      desc: "Scalable solutions for growing businesses",
      sols: ["ERP Systems", "Cloud Infrastructure", "Business Intelligence", "Cybersecurity"],
    },
  },
  branding: {
    mainLogo: "/logo/main.png",
    secondaryLight: "/logo/secondary-light.png",
    secondaryDark: "/logo/secondary-dark.png",
    favicon: "/favicon.ico",
  },
  company: {
    name: "PT Duakawan Sistem Integrator",
    shortName: "DKSI",
    tagline: "Digital Solutions for Indonesia",
    subTagline: "Enterprise IT Solutions & Services",
    established: 2013,
    address: "Jl. Raya Example No. 123",
    city: "Jakarta, Indonesia",
    email: "info@dksi.co.id",
    phone: "+62-21-XXXX-XXXX",
    website: "https://dksi.co.id",
    stats: {
      cert1: "ISO 9001:2015",
      cert2: "TKDN",
      establishedLabel: "Founded 2013",
    },
  },
  process: {
    label: "Our Process",
    headline: "From Concept to Delivery",
    steps: [
      { num: 1, title: "Discovery", desc: "Understand your needs", detail: "We analyze requirements and define objectives." },
      { num: 2, title: "Design", desc: "Plan the solution", detail: "Create architecture and technical specifications." },
      { num: 3, title: "Development", desc: "Build the product", detail: "Develop with best practices and standards." },
      { num: 4, title: "Testing", desc: "Ensure quality", detail: "Comprehensive QA and performance testing." },
      { num: 5, title: "Deployment", desc: "Go live", detail: "Smooth transition to production." },
      { num: 6, title: "Support", desc: "Long-term success", detail: "Ongoing maintenance and optimization." },
    ],
  },
  services: [
    {
      tag: "01",
      icon: "ri-cloud-line",
      title: "Cloud Infrastructure",
      sub: "Scalable & Secure",
      desc: "Enterprise-grade cloud solutions on AWS, Azure, or on-premises.",
      points: ["99.9% Uptime", "Auto-scaling", "Disaster Recovery"],
      target: "Enterprise",
      benefit: "Reduce infrastructure costs by 40%",
      visible: true,
    },
    {
      tag: "02",
      icon: "ri-shield-check-line",
      title: "Cybersecurity",
      sub: "Advanced Protection",
      desc: "Comprehensive security solutions protecting your digital assets.",
      points: ["24/7 Monitoring", "Threat Detection", "Compliance"],
      target: "All Sectors",
      benefit: "Minimize security risks",
      visible: true,
    },
    {
      tag: "03",
      icon: "ri-database-line",
      title: "Data & Analytics",
      sub: "Smart Insights",
      desc: "Transform data into actionable business intelligence.",
      points: ["Real-time Analytics", "Visualization", "ML Insights"],
      target: "Enterprise",
      benefit: "Data-driven decisions",
      visible: true,
    },
    {
      tag: "04",
      icon: "ri-settings-line",
      title: "System Integration",
      sub: "Seamless Connectivity",
      desc: "Integrate disparate systems into unified platforms.",
      points: ["API Integration", "Legacy Modernization", "SOA"],
      target: "All Sectors",
      benefit: "Operational efficiency",
      visible: true,
    },
    {
      tag: "05",
      icon: "ri-team-line",
      title: "IT Consulting",
      sub: "Strategic Guidance",
      desc: "Expert advisory on digital transformation strategies.",
      points: ["Strategy Planning", "Technology Roadmap", "Change Management"],
      target: "All Sectors",
      benefit: "Accelerated transformation",
      visible: true,
    },
  ],
  solInfra: [
    {
      id: "infra-01",
      icon: "ri-server-line",
      title: "Server Infrastructure",
      shortDesc: "High-performance computing",
      desc: "Enterprise server infrastructure with redundancy and failover.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      features: ["99.9% SLA", "Redundant Architecture", "Load Balancing", "Auto-recovery"],
      benefits: ["Minimized downtime", "Optimal performance", "Cost efficient", "Scalable"],
      status: "active",
    },
    {
      id: "infra-02",
      icon: "ri-shield-line",
      title: "Network Security",
      shortDesc: "Advanced threat protection",
      desc: "Multi-layer security infrastructure for network protection.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      features: ["Firewall Management", "IDS/IPS", "VPN Solutions", "DDoS Protection"],
      benefits: ["Enhanced security", "Threat prevention", "Compliance ready", "24/7 monitoring"],
      status: "active",
    },
  ],
  solEdu: [
    {
      id: "edu-01",
      icon: "ri-book-line",
      title: "Smart Education Solutions",
      shortDesc: "Digital learning platforms",
      desc: "Comprehensive education technology solutions for modern institutions.",
      img: "https://images.unsplash.com/photo-1524178232363-1fb2fe6b6585?w=600&h=400&fit=crop",
      features: ["LMS Platform", "Virtual Classroom", "Student Analytics", "Assignment Management"],
      benefits: ["Enhanced learning", "Digital transformation", "Better insights", "Engagement boost"],
      status: "active",
    },
  ],
  solAi: [
    {
      id: "ai-01",
      icon: "ri-robot-line",
      title: "AI & IoT Solutions",
      shortDesc: "Smart automation",
      desc: "AI-powered and IoT-enabled solutions for intelligent operations.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      features: ["AI Analytics", "IoT Integration", "Smart Devices", "Predictive Analytics"],
      benefits: ["Process automation", "Cost reduction", "Real-time insights", "Innovation"],
      status: "active",
    },
  ],
  solCategories: [
    { id: "solInfra", name: "Infrastructure", desc: "IT Infrastructure & Network Security", icon: "ri-server-line", color: "royal" },
    { id: "solEdu", name: "Education", desc: "Smart Education & Digital Learning", icon: "ri-book-line", color: "cyan" },
    { id: "solAi", name: "Innovation", desc: "AI, IoT & Smart Solutions", icon: "ri-robot-line", color: "navy" },
  ],
  buildSmarter: {
    label: "Why Choose DKSI",
    headline: "Build Smarter,",
    headlineAccent: "Faster, Stronger",
    description: "We combine cutting-edge technology with proven expertise to deliver solutions that drive growth.",
    cards: [
      {
        icon: "ri-flash-line",
        title: "High-Performance",
        desc: "Optimized solutions built for speed and scalability.",
      },
      {
        icon: "ri-ai-generate",
        title: "AI-Ready",
        desc: "Future-proof architecture with AI integration ready.",
      },
      {
        icon: "ri-shield-check-line",
        title: "Secure",
        desc: "Enterprise-grade security at every layer.",
      },
    ],
  },
  why: [
    {
      icon: "ri-award-line",
      title: "Proven Excellence",
      desc: "ISO 9001 certified with 10+ years of industry experience.",
    },
    {
      icon: "ri-team-line",
      title: "Expert Team",
      desc: "Dedicated professionals committed to your success.",
    },
    {
      icon: "ri-customer-service-2-line",
      title: "24/7 Support",
      desc: "Round-the-clock assistance for peace of mind.",
    },
    {
      icon: "ri-shield-check-line",
      title: "Compliance",
      desc: "TKDN certified and compliant with all standards.",
    },
  ],
  compliance: [
    {
      icon: "ri-checkbox-circle-line",
      title: "ISO 9001:2015",
      subtitle: "Quality Management",
      desc: "Certified quality management system ensuring excellence.",
      points: ["Process optimization", "Continuous improvement", "Customer focus"],
    },
    {
      icon: "ri-government-line",
      title: "TKDN",
      subtitle: "Indonesian Standard",
      desc: "TKDN certified for use in government projects.",
      points: ["Local content", "National compliance", "Government approved"],
    },
  ],
  trusted: [
    { name: "Ministry of Religion", subtitle: "Government", logo: "/clients/kementerian-agama-new-logo.png" },
    { name: "Indonesian Police", subtitle: "Law Enforcement", logo: "/clients/lambang-polri.png" },
    { name: "TMII", subtitle: "Tourism", logo: "/clients/2560px-tmii-logo-svg.png" },
    { name: "Ministry of Communication", subtitle: "Government", logo: "/clients/logo-kementerian-komunikasi-dan-digital-republik-indonesia-komdigi.svg" },
    { name: "Bawaslu", subtitle: "Government", logo: "/clients/logo-bawaslu.png" },
    { name: "LKPP", subtitle: "Public Procurement", logo: "/clients/logo-lkpp.png" },
    { name: "Ministry of Manpower", subtitle: "Government", logo: "/clients/logo-of-the-ministry-of-manpower-of-the-republic-of-indonesia-svg.png" },
    { name: "Unhan", subtitle: "Defense", logo: "/clients/logo-unhan.png" },
    { name: "PUPR", subtitle: "Public Works", logo: "/clients/pupr.png" },
    { name: "BSN", subtitle: "Standards", logo: "/clients/badan-standardisasi-nasional-seeklogo.png" },
    { name: "RSPON", subtitle: "Education", logo: "/clients/rspon.png" },
    { name: "Ristekdikti", subtitle: "Research", logo: "/clients/ristekdikti-logo-f092eadfb2-seeklogo-com.png" },
  ],
  portfolio: {
    items: {
      av: {
        title: "Smart Audiovisual System",
        client: "Ministry of Education",
        loc: "Jakarta",
        shortDesc: "Advanced AV infrastructure for conference rooms.",
        desc: "Deployed integrated audiovisual system across 50 conference rooms with centralized control.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        cat: "infra",
        featured: true,
        status: "completed",
      },
      office: {
        title: "Smart Office Platform",
        client: "Enterprise Corp",
        loc: "Surabaya",
        shortDesc: "IoT-based office management system.",
        desc: "Building automation and space utilization optimization with real-time analytics.",
        img: "https://images.unsplash.com/photo-1497366216548-495266fee048?w=600&h=400&fit=crop",
        cat: "smart",
        featured: true,
        status: "completed",
      },
      micro: {
        title: "Micro-Teaching Lab",
        client: "University of Indonesia",
        loc: "Jakarta",
        shortDesc: "Digital teaching and learning facility.",
        desc: "Interactive micro-teaching laboratory with AI-powered feedback system.",
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
        cat: "edu",
        featured: true,
        status: "completed",
      },
      infra: {
        title: "Data Center Infrastructure",
        client: "Government Agency",
        loc: "Bandung",
        shortDesc: "Enterprise data center deployment.",
        desc: "Tier-3 data center with redundancy, security, and compliance infrastructure.",
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
        cat: "infra",
        featured: false,
        status: "completed",
      },
      net: {
        title: "Network Modernization",
        client: "Ministry of Interior",
        loc: "Jakarta",
        shortDesc: "Legacy network upgrade and optimization.",
        desc: "Complete network modernization improving performance and security by 300%.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        cat: "infra",
        featured: false,
        status: "completed",
      },
      rental: {
        title: "Event Management System",
        client: "Convention Center",
        loc: "Medan",
        shortDesc: "Rental and booking management platform.",
        desc: "Complete event and venue rental management with online booking and payments.",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
        cat: "smart",
        featured: false,
        status: "completed",
      },
    },
    filterOrder: ["all", "infra", "edu", "smart"],
  },
  finalCta: {
    label: "Next Steps",
    headline: "Ready to Transform Your Business?",
    description: "Partner with DKSI to unlock digital excellence and drive sustainable growth.",
    primaryText: "Start Your Project",
    primaryLink: "#contact",
    secondaryText: "Schedule a Consultation",
    secondaryLink: "#contact",
  },
  contact: {
    title: "Get in Touch",
    phone: "+62-21-XXXX-XXXX",
    address: "Jl. Raya Example No. 123, Jakarta 12345",
    formLabels: {
      name: "Full Name",
      inst: "Institution/Company",
      email: "Email Address",
      phone: "Phone Number",
      category: "Category",
      message: "Message",
    },
    submitText: "Send Message",
    successMsg: "Thank you! We'll be in touch soon.",
  },
  seo: {
    title: "DKSI - Enterprise IT Solutions",
    description: "Digital transformation solutions for government, education, and enterprise sectors.",
    keywords: "IT solutions, cloud, security, digital transformation, Indonesia",
    ogImage: "/logo/main.png",
  },
  social: {
    linkedin: "https://linkedin.com/company/dksi",
    instagram: "https://instagram.com/dksi",
    twitter: "https://twitter.com/dksi",
    facebook: "https://facebook.com/dksi",
    youtube: "https://youtube.com/@dksi",
    email: "info@dksi.co.id",
  },
  meta: {
    publishedCount: 22,
    draftsCount: 0,
    version: "1.0.0",
    lastPublished: new Date().toISOString(),
  },
};

/**
 * Fetch CMS data from API with fallback to local seed
 * Implements ISR with 60-second revalidation
 */
export async function getCMS(): Promise<CMSData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/cms";

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: DEFAULT_REVALIDATE,
      },
    });

    if (!response.ok) {
      console.warn(`CMS API returned ${response.status}, using seed data`);
      return CMS_SEED;
    }

    const data = await response.json();
    return data as CMSData;
  } catch (error) {
    console.warn("CMS API fetch failed, using seed data:", error);
    return CMS_SEED;
  }
}

export default getCMS;
