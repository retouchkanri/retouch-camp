"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Roughly "scrolled past the hero section" — hero bands on this site
      // run close to one viewport tall.
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="ページの上部に戻る"
      tabIndex={visible ? 0 : -1}
      className={`fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-white text-forest-dark shadow-lg transition-all duration-300 hover:border-terracotta hover:text-terracotta ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
