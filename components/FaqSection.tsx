import Image from "next/image";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Há estacionamento no local?",
    answer:
      "Sim, o restaurante possui estacionamento próprio. Em breve informaremos mais detalhes.",
  },
  {
    question: "Qual o horário de chegada recomendado?",
    answer:
      "Sugerimos chegar com pelo menos 30 minutos de antecedência para acomodação.",
  },
  {
    question: "Qual o traje indicado?",
    answer: "O dress code será informado em breve.",
  },
  {
    question: "Crianças são bem-vindas?",
    answer:
      "Sim, crianças são bem-vindas. Caso haja alguma necessidade especial, avise-nos.",
  },
  {
    question: "Haverá lista de presentes?",
    answer:
      "Em breve compartilharemos as informações sobre lista de presentes.",
  },
  {
    question: "Como entrar em contato?",
    answer:
      "Use o campo de mensagem no RSVP ou o contato que enviaremos em breve.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="section-shell px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[380px] overflow-hidden rounded-[30px] border border-gold/30 shadow-xl sm:min-h-[520px] sm:rounded-[38px]">
            <Image
              src="/stock/rings.jpg"
              alt="Alianças de casamento"
              width={640}
              height={840}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.5),transparent_60%)]" />
            <div className="mt-4 rounded-[20px] border border-gold/40 bg-white/90 px-5 py-4 text-sm text-ink sm:absolute sm:bottom-8 sm:left-8 sm:right-8 sm:mt-0 sm:rounded-[24px] sm:px-6 sm:py-5">
              <div className="flex items-center gap-2 text-gold">
                <HelpCircle className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.3em] text-gold-muted">Dúvidas</span>
              </div>
              <p className="mt-3 text-base text-ink">Estamos aqui para ajudar.</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-muted">FAQ</p>
            <h2 className="mt-3 text-3xl text-ink sm:text-4xl">Perguntas frequentes</h2>
            <div className="mt-8 grid gap-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[24px] border border-gold/25 bg-white/80 px-6 py-4 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-left text-base font-semibold text-ink">
                    {item.question}
                    <span className="ml-4 text-gold transition group-open:rotate-180">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-ink-soft">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
