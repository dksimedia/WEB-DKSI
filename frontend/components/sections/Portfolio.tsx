"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PortfolioProps {
  data: {
    items: Record<string, any>;
    filterOrder: string[];
  };
}

export default function PortfolioSection({ data }: PortfolioProps) {
  const [filter, setFilter] = useState("all");
  const items = Object.values(data.items);
  const filteredItems = filter === "all" ? items : items.filter((i) => i.cat === filter);

  return (
    <section id="portfolio" className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 tracking-tight">Portfolio Kami</h2>
        
        <div className="flex justify-center gap-4 mb-12">
          {data.filterOrder.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all capitalize",
                filter === cat ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, i) => (
            <div key={i} className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group">
              <div className="relative aspect-[16/10]">
                <Image src={item.img || "/placeholder.jpg"} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">{item.client}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
