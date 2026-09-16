"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface TrustedProps {
  data: Array<{
    name: string;
    subtitle?: string;
    logo: string;
  }>;
}

export default function TrustedSection({ data }: TrustedProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Clone items for seamless loop
    const items = Array.from(track.children) as HTMLElement[];
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Trusted By</h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-8 animate-scroll whitespace-nowrap"
            >
              {data.map((client, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-center border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 16px));
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
