"use client";

import { motion } from "framer-motion";

export default function DateHighlight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-4 text-center"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="date-serif date-numerals gold-foil text-5xl font-semibold leading-[1.15] sm:text-6xl">
          11 de junho
        </span>
        <span className="date-serif text-4xl font-semibold text-ink">2026</span>
        <span className="mt-3 text-sm font-medium tracking-[0.35em] text-gold-muted sm:text-[0.8rem]">
          às 17:00
        </span>
      </div>
    </motion.div>
  );
}
