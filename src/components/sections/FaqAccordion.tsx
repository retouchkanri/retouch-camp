"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-sage/20 rounded-2xl border border-sage/20 bg-white">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-forest-dark sm:text-base">{item.q}</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`h-4 w-4 flex-shrink-0 text-terracotta transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <p className="px-6 pb-5 text-sm leading-relaxed text-charcoal-soft">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
