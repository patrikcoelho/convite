import Image from "next/image";
import Monogram from "./Monogram";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden px-6 py-10 sm:py-12"
    >
      <Image
        src="/stock/hero.jpg"
        alt="Casal em clima romântico"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,6,5,0.9),rgba(8,6,5,0.55),rgba(8,6,5,0.86))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2),rgba(0,0,0,0.7))]" />
      <Image
        src="/stock/texture.jpg"
        alt=""
        fill
        className="object-cover opacity-35 mix-blend-soft-light"
      />
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full border border-gold/40 bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full border border-gold/30 bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center text-center text-ivory">
        <div className="pt-2 sm:pt-4">
          <Monogram />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-[0.45em] text-ivory/90 drop-shadow-md">
            Convite de casamento
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-wide text-ivory drop-shadow-2xl sm:text-6xl">
            Vitória & Patrik
          </h1>
          <p className="mt-6 text-xl uppercase tracking-[0.4em] text-gold/90 drop-shadow-md sm:text-3xl">
            11 de junho de 2026
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <a className="btn-primary shadow-2xl" href="#rsvp">
              Confirmar Presença
            </a>
          </div>
        </div>
        <a
          href="#evento"
          aria-label="Ver mais conteúdo"
          className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-ivory transition hover:text-ivory/80"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition group-hover:translate-y-0.5"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
