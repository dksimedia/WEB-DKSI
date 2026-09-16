'use client';

import Image from 'next/image';
import { CMSData } from '@/lib/cms';

export default function TrustedSection({ data }: { data: CMSData['trusted'] }) {
  const logos = data || [];
  // Triple the logos for seamless scroll
  const displayLogos = [...logos, ...logos, ...logos];

  return (
    <section id="trusted" className="py-16 bg-[var(--bg-card)] border-y border-[var(--border)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-xs font-black tracking-[0.2em] text-[var(--brand)] uppercase mb-2">Klien & Mitra Kami</h2>
        <p className="text-[var(--text-soft)] text-sm">Dipercaya oleh berbagai institusi ternama di Indonesia</p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-4">
          {displayLogos.map((item, i) => (
            <div key={i} className="flex-none w-[200px] px-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <div className="relative w-full h-20 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <Image 
                  src={item.logo || '/logo/dksi-logo.svg'}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
