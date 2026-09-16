import { cn } from "@/lib/utils";

interface WhyProps {
  data: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
}

export default function WhySection({ data }: WhyProps) {
  return (
    <section id="why" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Why Choose DKSI</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <div className="text-5xl mb-4">
                <i className={cn("text-blue-600 dark:text-blue-400", item.icon)} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
