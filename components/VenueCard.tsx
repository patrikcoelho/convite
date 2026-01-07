"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Navigation } from "lucide-react";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";

const address = "R. Floriano Peixoto, 545 – Centro, Boa Vista – RR, 69301-320";
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

export default function VenueCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="lux-card relative overflow-hidden px-7 py-9 sm:px-10 sm:py-10">
        <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-gold/10 blur-2xl" aria-hidden="true" />
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ivory/80">
            <MapPin className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <OrnamentalDivider className="mt-5" />
          <p className="mt-4 text-xs uppercase tracking-[0.4em] text-ink/60">Cerimônia & Recepção</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-wide">Restaurante Riu — Orla Taumanan</h3>
          <p className="mt-3 text-sm text-ink-soft">{address}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-soft">
          <div className="flex items-center gap-2 text-center">
            <Clock className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span>Cerimônia e recepção/jantar no mesmo local</span>
          </div>
        </div>

        <OrnamentalDivider className="mx-auto mt-7 -scale-y-100" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
          >
            <Navigation className="mr-2 h-5 w-5" strokeWidth={1.5} />
            Abrir no Google Maps
          </a>
          <a
            href={wazeLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary w-full sm:w-auto sm:min-w-[220px]"
          >
            <MapPin className="mr-2 h-5 w-5" strokeWidth={1.5} />
            Abrir no Waze
          </a>
        </div>
      </div>
    </motion.section>
  );
}
