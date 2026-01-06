import HeroInvite from "@/components/HeroInvite";
import DateHighlight from "@/components/DateHighlight";
import VenueCard from "@/components/VenueCard";
import RSVPCard from "@/components/RSVPCard";
import DressCode from "@/components/DressCode";
import Gifts from "@/components/Gifts";
import Footer from "@/components/Footer";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="relative">
        <HeroInvite />

        <section className="relative px-6 pb-14 pt-4 sm:pb-16">
          <div className="pointer-events-none absolute inset-0 ornamental-bg opacity-25" />
          <div className="relative mx-auto max-w-xl text-center">
            <OrnamentalDivider className="mx-auto" />
            <p className="mt-8 text-xl leading-relaxed text-ink">
              Com alegria convidamos você para celebrar conosco o início da nossa história a
              dois. Uma noite de amor, elegância e gratidão, cercada de pessoas especiais.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <span className="mx-3 text-xs uppercase tracking-[0.4em] text-ink/40">•</span>
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>
            <div className="mt-7 flex flex-col items-center gap-3">
              <Heart className="h-5 w-5 text-gold" strokeWidth={1.6} />
              <p className="text-3xl text-gold">
                Sua presença tornará este momento ainda mais inesquecível.
              </p>
            </div>
          </div>
        </section>

        <section className="relative -mt-4 px-6 pb-14 sm:pb-16">
          <div className="mx-auto grid max-w-3xl gap-8">
            <VenueCard />
          </div>
        </section>

        <section className="relative px-6 pb-14 sm:pb-16">
          <div className="mx-auto grid max-w-3xl gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <DressCode />
              <Gifts />
            </div>
          </div>
        </section>

        <section className="relative px-6 pb-16 sm:pb-20">
          <div className="mx-auto grid max-w-3xl gap-8">
            <RSVPCard />
          </div>
        </section>

        <section className="relative px-6 pb-12">
          <div className="mx-auto max-w-xl text-center">
            <DateHighlight />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
