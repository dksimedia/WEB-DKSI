import Link from "next/link";

interface FinalCtaProps {
  data: {
    label?: string;
    headline: string;
    description: string;
    primaryText: string;
    primaryLink: string;
    secondaryText?: string;
    secondaryLink?: string;
  };
}

export default function FinalCta({ data }: FinalCtaProps) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 relative overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[50px_50px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {data.label && (
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold tracking-wider uppercase mb-6">
              {data.label}
            </span>
          )}

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            {data.headline}
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={data.primaryLink || "#"}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-900 bg-white hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105"
            >
              {data.primaryText}
            </Link>
            {data.secondaryText && data.secondaryLink && (
              <Link
                href={data.secondaryLink}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 border border-white/40 hover:scale-105"
              >
                {data.secondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
