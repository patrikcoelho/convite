"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";

export default function DressCode() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="lux-card px-7 py-8 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-ivory/85">
            <Sparkles className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <OrnamentalDivider className="mt-4" />
          <p className="mt-4 text-xs uppercase tracking-[0.45em] text-ink/60">Dress code</p>
          <h3 className="mt-3 text-xl font-semibold tracking-wide text-ink">Traje: Social</h3>
          <p className="mt-3 text-xl text-ink-soft">
            Vista-se com traje apropriado e confortável para uma noite especial.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
