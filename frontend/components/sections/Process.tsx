interface ProcessProps {
  data: {
    label?: string;
    headline: string;
    steps: Array<{
      num: number;
      title: string;
      desc: string;
      detail: string;
    }>;
  };
}

export default function ProcessSection({ data }: ProcessProps) {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        {data.label && (
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">
            {data.label}
          </span>
        )}
        <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-16">{data.headline}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.steps.map((step) => (
            <div
              key={step.num}
              className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-auto pt-4">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
