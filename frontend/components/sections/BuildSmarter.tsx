import { cn } from "@/lib/utils";

interface BuildSmarterProps {
  data: {
    label?: string;
    headline: string;
    headlineAccent?: string;
    description: string;
    cards: Array<{
      icon: string;
      title: string;
      desc: string;
    }>;
  };
}

export default function BuildSmarter({ data }: BuildSmarterProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        {data.label && (
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">
            {data.label}
          </span>
        )}
        
        <h2 className="text-5xl lg:text-6xl font-bold mt-4 mb-4">
          {data.headline}
          {data.headlineAccent && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {data.headlineAccent}
            </span>
          )}
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-16">{data.description}</p>

        <div className="grid md:grid-cols-3 gap-8">
          {data.cards.map((card, i) => (
            <div key={i} className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
              <div className="text-5xl mb-4">
                <i className={cn("text-blue-600 dark:text-blue-400", card.icon)} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
