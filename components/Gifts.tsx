"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";

export default function Gifts() {
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
            <Gift className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <OrnamentalDivider className="mt-4" />
          <p className="mt-4 text-xs uppercase tracking-[0.45em] text-ink/60">Lista de presentes</p>
          <h3 className="mt-3 text-xl font-semibold tracking-wide text-ink">Com carinho</h3>
          <div className="mt-3 text-xl text-ink-soft">
            <p>Sua presença já é o nosso maior presente.</p>
            <p className="mt-3">
              Mas, se desejar nos presentear, sua contribuição será recebida com muito amor.
            </p>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-gold/20 bg-white/90 shadow-sm">
              <PixQr className="h-24 w-24 text-ink/60" />
            </div>
            <p className="text-sm text-ink/60">Chave Pix: casamento@exemplo.com</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function PixQr({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 120 120" fill="none">
      <rect width="120" height="120" rx="12" fill="currentColor" opacity="0.08" />
      <g fill="currentColor">
        <rect x="12" y="12" width="24" height="24" rx="4" />
        <rect x="84" y="12" width="24" height="24" rx="4" />
        <rect x="12" y="84" width="24" height="24" rx="4" />
        <rect x="42" y="42" width="12" height="12" rx="2" />
        <rect x="66" y="42" width="10" height="10" rx="2" />
        <rect x="42" y="66" width="10" height="10" rx="2" />
        <rect x="62" y="66" width="16" height="16" rx="3" />
        <rect x="52" y="28" width="8" height="8" rx="2" />
        <rect x="28" y="52" width="8" height="8" rx="2" />
        <rect x="90" y="52" width="8" height="8" rx="2" />
        <rect x="52" y="90" width="8" height="8" rx="2" />
      </g>
    </svg>
  );
}
