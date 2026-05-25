import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function EventSection() {
  return (
    <section
      id="evento"
      className="section-shell px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-6xl lg:w-full">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-12">
          <div className="relative">
            <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full border border-gold/30" />
            <div className="relative w-full overflow-hidden rounded-[28px] shadow-2xl sm:rounded-[44px]">
              <div className="relative aspect-[4/5] max-h-[520px] w-full sm:aspect-[3/4] sm:max-h-[580px] lg:h-full lg:max-h-[68vh] lg:aspect-auto">
                <Image
                  src="/stock/flowers.jpg"
                  alt="Arranjo floral clássico"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:flex lg:flex-col lg:justify-center lg:py-4">
            <p className="text-sm uppercase tracking-[0.3em] text-gold-muted">O Evento</p>
            <h2 className="text-3xl text-ink sm:text-4xl">
              Um dia para celebrar o amor
            </h2>
            <p className="text-base text-ink-soft">
              Preparamos uma experiência elegante e acolhedora, com cerimônia e
              recepção no mesmo espaço para que todos aproveitem cada momento.
            </p>
            <div className="mt-6 grid gap-5">
              {[
                {
                  title: "Cerimônia",
                  description:
                    "Uma celebração intimista para abençoar nossa união.",
                },
                {
                  title: "Recepção",
                  description:
                    "Brindes, música e um jantar especial com os nossos convidados.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-gold/30 bg-white/80 px-6 py-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gold/10 p-2 text-gold">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg text-ink">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">{item.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold-muted">
                    17:00
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
