import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

export default function DetailsSection() {
  return (
    <section
      id="detalhes"
      className="section-shell px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-6xl lg:w-full">
        <div className="relative grid gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-12">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full border border-gold/30 lg:block" />
            <div className="rounded-[28px] border border-gold/30 bg-white/90 p-6 shadow-xl sm:rounded-[36px] sm:p-10 lg:h-full lg:max-h-[68vh] lg:overflow-visible">
              <p className="text-sm uppercase tracking-[0.3em] text-gold-muted">
                Detalhes
              </p>
              <h2 className="mt-4 text-3xl text-ink sm:text-4xl">
                Um cenário clássico
              </h2>
              <div className="mt-8 space-y-6 text-sm text-ink-soft">
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-gold/10 p-3 text-gold">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">Data e Horário</h3>
                    <p className="mt-2">11 de junho de 2026 • 17:00</p>
                    <p className="mt-1">Cerimônia e recepção no mesmo local.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-gold/10 p-3 text-gold">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">Local</h3>
                    <p className="mt-2">Riu Restaurante</p>
                    <p className="mt-1">Endereço a definir • Boa Vista – RR</p>
                    <a
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-muted hover:text-gold"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
                <div className="rounded-2xl border border-gold/20 bg-white/70 p-4 text-xs uppercase tracking-[0.3em] text-gold-muted">
                  Dress code a definir • Chegar com antecedência
                </div>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute -right-8 bottom-6 hidden h-40 w-40 rounded-full border border-gold/20 lg:block" />
            <div className="relative overflow-hidden rounded-[30px] shadow-2xl sm:rounded-[42px]">
              <div className="relative aspect-[4/5] max-h-[520px] w-full sm:aspect-[3/4] sm:max-h-[580px] lg:h-full lg:max-h-[68vh] lg:aspect-auto">
                <Image
                  src="/stock/detail.jpg"
                  alt="Detalhes da decoração do evento"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(15,12,10,0.55),rgba(15,12,10,0.1))]" />
            </div>
            <div className="mt-4 rounded-[22px] border border-gold/40 bg-white/90 px-5 py-4 text-sm text-ink shadow-lg sm:absolute sm:-bottom-8 sm:left-10 sm:mt-0 sm:rounded-[28px] sm:px-6 sm:py-5">
              Chegar com antecedência para acomodarmos todos com conforto.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
