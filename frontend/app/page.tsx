import { getCMS } from "@/lib/cms";
import HeroSection from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import AboutSection from "@/components/sections/About";
import ProcessSection from "@/components/sections/Process";
import ServicesSection from "@/components/sections/Services";
import BuildSmarter from "@/components/sections/BuildSmarter";
import SolutionsSection from "@/components/sections/Solutions";
import PortfolioSection from "@/components/sections/Portfolio";
import FinalCta from "@/components/sections/FinalCta";
import WhySection from "@/components/sections/Why";
import ComplianceSection from "@/components/sections/Compliance";
import TrustedSection from "@/components/sections/Trusted";
import ContactSection from "@/components/sections/Contact";

export default async function Home() {
  const cms = await getCMS();

  return (
    <>
      <HeroSection data={cms.homepage} />
      <TrustBar data={cms.trustBar} />
      <AboutSection data={cms.about} />
      <ProcessSection data={cms.process} />
      <ServicesSection data={cms.services} />
      <BuildSmarter data={cms.buildSmarter} />
      <SolutionsSection
        data={{
          solInfra: cms.solInfra,
          solEdu: cms.solEdu,
          solAi: cms.solAi,
          solCategories: cms.solCategories,
        }}
      />
      <PortfolioSection data={cms.portfolio} />
      <FinalCta data={cms.finalCta} />
      <WhySection data={cms.why} />
      <ComplianceSection data={cms.compliance} />
      <TrustedSection data={cms.trusted} />
      <ContactSection data={cms.contact} />
    </>
  );
}
