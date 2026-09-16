interface AboutProps {
  data: {
    label?: string;
    headline: string;
    paragraphs: string[];
    sectorEducation?: string;
    sectorGovernment?: string;
    sectorEnterprise?: string;
  };
}

export default function AboutSection({ data }: AboutProps) {
  const sectors = [
    { title: "Pendidikan", desc: data.sectorEducation || "Solusi pembelajaran digital" },
    { title: "Pemerintahan", desc: data.sectorGovernment || "Layanan publik aman & terpercaya" },
    { title: "Perusahaan", desc: data.sectorEnterprise || "Solusi bisnis yang adaptif" },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {data.label && (
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">
                {data.label}
              </span>
            )}
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              {data.headline}
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {sectors.map((sector) => (
              <div
                key={sector.title}
                className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {sector.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
