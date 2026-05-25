"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Check, Clock, Copy, Gift, Heart, MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FloralCorner, OrnamentalDivider } from "@/components/DecorativeSvgs";

const address = "R. Floriano Peixoto, 545 - Centro, Boa Vista - RR, 69301-320";
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
const pixKey = "presenteie@patrikevitoria.com.br";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function WeddingReminderPage() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    setCopyStatus("idle");

    try {
      await navigator.clipboard.writeText(pixKey);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-champagne text-ink">
      <main>
        <section className="relative px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[92svh]">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <FloralCorner className="absolute -left-12 -top-8" />
            <FloralCorner className="absolute -bottom-10 -right-12 rotate-180" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="relative mx-auto flex max-w-5xl flex-col"
          >
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-gold-muted">
                Lembrete do casamento
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-wide text-ink sm:text-7xl">
                <span className="block sm:inline">Vitória &</span>
                <span className="block sm:inline"> Patrik</span>
              </h1>
              <OrnamentalDivider className="mx-auto mt-5" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-10 w-full max-w-3xl text-center"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-ink/55">
                  Reserve este dia
                </p>
                <div className="mt-5">
                  <p className="date-serif gold-foil text-5xl font-semibold leading-none sm:text-7xl">
                    11 de junho
                  </p>
                  <p className="date-serif mt-3 text-5xl font-semibold leading-none text-ink">
                    2026
                  </p>
                </div>
                <div className="mt-8 flex flex-col items-center gap-5">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gold" strokeWidth={1.5} />
                    <span className="date-serif text-4xl font-semibold text-ink">às 17:00</span>
                  </div>
                  <p className="mx-auto max-w-[17rem] text-lg leading-relaxed text-ink-soft sm:max-w-md sm:text-xl">
                    Cerimônia e recepção no mesmo local. Chegue com antecedência para
                    aproveitarmos com calma.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="#local" className="btn-primary w-full sm:w-auto">
                <MapPin className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Ver local
              </Link>
              <Link href="#presentes" className="btn-secondary w-full sm:w-auto">
                <Gift className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Presentes
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section id="local" className="relative px-5 py-14 sm:px-8 sm:py-18">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <CalendarDays className="mx-auto h-6 w-6 text-gold" strokeWidth={1.4} />
            <OrnamentalDivider className="mx-auto mt-4" />
            <p className="mt-5 text-xs uppercase tracking-[0.42em] text-ink/55">
              Local confirmado
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Restaurante Riu - Orla Taumanan
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-ink-soft">
              {address}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={mapsLink} target="_blank" rel="noreferrer" className="btn-primary">
                <Navigation className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Abrir no Google Maps
              </a>
              <a href={wazeLink} target="_blank" rel="noreferrer" className="btn-secondary">
                <MapPin className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Abrir no Waze
              </a>
            </div>
          </motion.div>
        </section>

        <section id="presentes" className="relative px-5 pb-16 pt-8 sm:px-8 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]"
          >
            <div className="text-center lg:text-left">
              <Heart className="mx-auto h-6 w-6 text-gold lg:mx-0" strokeWidth={1.4} />
              <OrnamentalDivider className="mx-auto mt-4 lg:mx-0" />
              <p className="mt-5 text-xs uppercase tracking-[0.42em] text-ink/55">
                Sobre os presentes
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Não criamos lista de presentes
              </h2>
              <p className="mt-5 text-xl leading-relaxed text-ink-soft">
                Para deixar tudo mais simples, escolhemos receber os presentes em formato de Pix.
                Se desejar nos presentear, sua contribuição será recebida com muito carinho para
                nossa nova vida juntos.
              </p>
            </div>

            <div className="lux-card px-7 py-8 text-center sm:px-9">
              <p className="text-xs uppercase tracking-[0.36em] text-gold-muted">
                Pix dos noivos
              </p>
              <div className="mx-auto mt-5 flex h-40 w-40 items-center justify-center rounded-2xl border border-gold/20 bg-white/90 shadow-sm">
                <Image
                  src="/qrcode-pix.png"
                  alt="QR Code Pix para presente"
                  width={148}
                  height={148}
                  className="h-36 w-36"
                />
              </div>
              <p className="mt-4 text-base text-ink-soft">Escaneie o QR Code ou copie a chave.</p>
              <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row">
                <input
                  readOnly
                  value={pixKey}
                  className="input-base min-w-0 flex-1 text-center sm:text-left"
                  aria-label="Chave Pix dos noivos"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-secondary px-5"
                  aria-label="Copiar chave Pix"
                >
                  {copyStatus === "success" ? (
                    <Check className="mr-2 h-5 w-5" strokeWidth={1.6} />
                  ) : (
                    <Copy className="mr-2 h-5 w-5" strokeWidth={1.6} />
                  )}
                  {copyStatus === "success" ? "Copiado" : "Copiar"}
                </button>
              </div>
              {copyStatus === "error" ? (
                <p className="mt-3 text-sm text-red-600/90" role="alert">
                  Não foi possível copiar a chave Pix.
                </p>
              ) : null}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
