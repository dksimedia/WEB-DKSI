interface ComplianceProps {
  data: Array<{
    icon: string;
    title: string;
    subtitle?: string;
    desc: string;
    points: string[];
  }>;
}

export default function ComplianceSection({ data }: ComplianceProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Certifications & Compliance</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {data.map((cert, i) => (
            <div key={i} className="p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl text-blue-600 dark:text-blue-400">
                  <i className={cert.icon} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{cert.title}</h3>
                  {cert.subtitle && <p className="text-blue-600 dark:text-blue-400 font-medium">{cert.subtitle}</p>}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{cert.desc}</p>
              <ul className="space-y-2">
                {cert.points.map((p, j) => (
                  <li key={j} className="text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mr-3" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
