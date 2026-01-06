"use client";

import { motion } from "framer-motion";
import { FloralCorner, OrnamentalDivider } from "@/components/DecorativeSvgs";
import { Heart } from "lucide-react";
import DateHighlight from "@/components/DateHighlight";

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroInvite() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <FloralCorner className="absolute -left-10 -top-6" />
        <FloralCorner className="absolute -bottom-8 -right-10 rotate-180" />
      </div>

      <div className="relative mx-auto max-w-xl">
        <div className="relative z-10 px-7 pb-12 pt-11 sm:px-10">
          <div className="text-center">
            <div className="mb-2" />

            <motion.div
              className="mt-4 flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <p className="text-xs font-semibold tracking-[0.25em] text-ink/70">
                Com a bênção de Deus e de nossos pais
              </p>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-gold-muted">
                Convidamos você para nosso casamento
              </p>
            </motion.div>
            <motion.h1
              className="mt-7 text-6xl font-semibold tracking-wide text-ink sm:text-7xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
              Vitória <span className="text-gold">&</span> Patrik
            </motion.h1>

            <div className="mt-5 flex flex-col items-center">
              <OrnamentalDivider />
              <DateHighlight />
              <OrnamentalDivider className="mt-2" />
            </div>

            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              &quot;Assim, eles já não são dois, mas sim uma só carne. Portanto, o que Deus uniu,
              ninguém separe.&quot;
              <span className="ui-font mt-3 block text-sm uppercase tracking-[0.3em] text-ink/60">
                Mateus 19:6
              </span>
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a href="#rsvp" className="btn-primary w-auto px-6 text-lg">
                <Heart className="mr-2 h-5 w-5" strokeWidth={1.6} />
                Confirmar presença
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
