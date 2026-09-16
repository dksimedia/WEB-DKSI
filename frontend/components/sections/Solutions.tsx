"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SolutionProps {
  data: {
    solInfra: any[];
    solEdu: any[];
    solAi: any[];
    solCategories: Array<{ id: string; name: string; desc: string; icon: string; color: string }>;
  };
}

export default function SolutionsSection({ data }: SolutionProps) {
  const [activeTab, setActiveTab] = useState(data.solCategories[0]?.id || "");

  const getSolData = (id: string) => {
    switch(id) {
      case "solInfra": return data.solInfra;
      case "solEdu": return data.solEdu;
      case "solAi": return data.solAi;
      default: return [];
    }
  };

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 tracking-tight">Our Solutions</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {data.solCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "px-6 py-3 rounded-full font-bold transition-all duration-300 border",
                activeTab === cat.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-400"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getSolData(activeTab).map((sol, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-xl font-bold mb-3">{sol.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{sol.shortDesc}</p>
              <ul className="space-y-2">
                {sol.features.map((f: string, j: number) => (
                  <li key={j} className="text-sm text-gray-500 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    {f}
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
