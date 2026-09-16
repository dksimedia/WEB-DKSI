interface TrustBarProps {
  data: Array<{
    label: string;
    value: string;
  }>;
}

export default function TrustBar({ data }: TrustBarProps) {
  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {data.map((item, i) => (
            <div key={i}>
              <p className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">{item.value}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
