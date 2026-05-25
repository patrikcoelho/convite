"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Gift } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";

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
          <h3 className="mt-4 text-2xl font-semibold tracking-wide text-ink lg:mt-3 lg:text-[1.6rem]">
            Contribua com Nossa Jornada
          </h3>
          <p className="mt-3 text-xl text-ink-soft lg:mt-2 lg:text-lg lg:leading-relaxed">
            Não temos lista de presentes tradicional. Se você quiser nos presentear, sua
            contribuição via PIX nos ajuda a escolher com carinho o que faz mais sentido para a
            nossa nova vida juntos.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/presentes"
              className="btn-secondary h-12 px-5 text-sm uppercase tracking-[0.22em]"
            >
              Ver ideias de presentes
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="mt-6 w-full lg:mt-5">
            <p className="text-sm tracking-[0.2em] text-ink/60">PIX via QR Code</p>
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-gold/20 bg-white/90 shadow-sm lg:h-28 lg:w-28">
                <Image
                  src="/qrcode-pix.png"
                  alt="QR Code Pix"
                  width={120}
                  height={120}
                  className="h-28 w-28 lg:h-24 lg:w-24"
                />
              </div>
              <p className="text-sm text-ink/60">Escaneie com o app do seu banco</p>
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={pixKey}
                  size={pixKey.length}
                  className="input-base w-auto max-w-none"
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
