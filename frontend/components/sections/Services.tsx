import { cn } from "@/lib/utils";

interface ServiceProps {
  data: Array<{
    tag: string;
    icon: string;
    title: string;
    sub: string;
    desc: string;
    points: string[];
    visible: boolean;
  }>;
}

export default function ServicesSection({ data }: ServiceProps) {
  const visibleServices = data.filter((s) => s.visible);

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight">
          Our Services
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 flex flex-col group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-bold text-gray-200 dark:text-gray-800 group-hover:text-blue-500 transition-colors">
                  {service.tag}
                </span>
                <i className={cn("text-3xl text-blue-600 dark:text-blue-400", service.icon)} />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{service.sub}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{service.desc}</p>
              
              <ul className="space-y-2">
                {service.points.map((p, j) => (
                  <li key={j} className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <span className="mr-2 text-blue-500">•</span>
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
