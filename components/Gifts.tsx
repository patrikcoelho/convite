"use client";

import { motion } from "framer-motion";
import { Copy, Gift } from "lucide-react";
import Image from "next/image";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";
import { useEffect, useRef, useState } from "react";

const pixKey = "presenteie@patrikevitoria.com.br";

export default function Gifts() {
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
    } catch (error) {
      setCopyStatus("error");
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
    }
  }

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
          <h3 className="mt-4 text-2xl font-semibold tracking-wide text-ink">
            Contribua com Nossa Jornada
          </h3>
          <p className="mt-3 text-xl text-ink-soft">
            Não temos lista de presentes, mas se você deseja nos presentear, ficaremos muito felizes
            com sua contribuição para nossa nova vida juntos.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm tracking-[0.2em] text-ink/60">PIX via QR Code</p>
            <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-gold/20 bg-white/90 shadow-sm">
              <Image
                src="/qrcode-pix.png"
                alt="QR Code Pix"
                width={120}
                height={120}
                className="h-28 w-28"
              />
            </div>
            <p className="text-sm text-ink/60">Escaneie com o app do seu banco</p>
          </div>

          <div className="mt-5 flex w-full items-center gap-3">
            <input
              readOnly
              value={pixKey}
              className="input-base flex-1"
              aria-label="Chave Pix"
            />
            <div className="relative">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${
                  copyStatus === "success"
                    ? "border-gold bg-gold text-ivory shadow-lg shadow-gold/30"
                    : "border-gold/30 bg-ivory/90 text-gold hover:bg-champagne/70"
                }`}
                aria-label="Copiar chave Pix"
                disabled={copyStatus === "success"}
              >
                <Copy className="h-5 w-5" strokeWidth={1.6} />
              </button>
              {copyStatus === "success" ? (
                <span className="absolute -top-9 right-0 rounded-full border border-gold/30 bg-ivory/95 px-3 py-1 text-xs text-ink">
                  Copiado!
                </span>
              ) : null}
            </div>
          </div>
          {copyStatus === "error" ? (
            <p className="mt-2 text-sm text-red-600/90" role="alert">
              Não foi possível copiar a chave Pix.
            </p>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
