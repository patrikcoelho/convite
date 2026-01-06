"use client";

import { useEffect, useMemo, useState } from "react";

const targetDate = new Date("2026-06-11T00:00:00-03:00");

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(): CountdownValues {
  const now = new Date();
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function CountdownSection() {
  const [countdown, setCountdown] = useState<CountdownValues>(getCountdown());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = useMemo(
    () => [
      { label: "Dias", value: countdown.days },
      { label: "Horas", value: countdown.hours },
      { label: "Min", value: countdown.minutes },
      { label: "Seg", value: countdown.seconds },
    ],
    [countdown]
  );

  return (
    <section id="contagem" className="section-shell px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[30px] border border-gold/30 bg-white/85 px-6 py-10 shadow-xl sm:rounded-[42px] sm:px-14 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,168,107,0.15),transparent_60%)]" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-gold/30" />
          <div className="relative z-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gold-muted">
              Contagem Regressiva
            </p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
              Estamos contando os dias
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {values.map((item) => (
                <div key={item.label} className="count-chip bg-white/80">
                  <div className="text-2xl font-semibold text-ink animate-number sm:text-3xl">
                    {mounted ? item.value.toString().padStart(2, "0") : "--"}
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold-muted">
                    {item.label}
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
