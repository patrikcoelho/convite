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
        <span className="script-font gold-foil text-6xl leading-none sm:text-7xl">
          11 de junho
        </span>
        <span className="text-4xl font-semibold text-ink">2026</span>
      </div>
    </motion.div>
  );
}
