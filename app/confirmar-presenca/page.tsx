import type { Metadata } from "next";
import RSVPCard from "@/components/RSVPCard";
import { FloralCorner } from "@/components/DecorativeSvgs";

export const metadata: Metadata = {
  title: "Confirmar Presença | Vitória & Patrik",
  description:
    "Formulário de confirmação de presença para o casamento de Vitória e Patrik.",
};

export default function ConfirmarPresencaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <FloralCorner className="absolute -left-12 -top-8" />
        <FloralCorner className="absolute -bottom-10 -right-12 rotate-180" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
        <div className="w-full">
          <RSVPCard />
        </div>
      </div>
    </main>
  );
}
