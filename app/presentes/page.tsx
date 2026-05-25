"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Bath,
  Coffee,
  Copy,
  CreditCard,
  Gift,
  Hotel,
  House,
  Microwave,
  Sofa,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

const pixKey = "presenteie@patrikevitoria.com.br";
const pixMerchantName = "VITORIA E PATRIK";
const pixMerchantCity = "BOA VISTA";
const cardPaymentUrl = process.env.NEXT_PUBLIC_CARD_PAYMENT_URL?.trim() ?? "";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=360`;

const emv = (id: string, value: string) => `${id}${value.length.toString().padStart(2, "0")}${value}`;

function crc16(payload: string) {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function txIdFromTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 25);
}

function buildPixPayload(idea: GiftIdea) {
  const merchantAccount = emv("00", "br.gov.bcb.pix") + emv("01", pixKey);
  const additionalData = emv("05", txIdFromTitle(idea.title) || "PRESENTE");
  const payload =
    emv("00", "01") +
    emv("26", merchantAccount) +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", idea.amount.toFixed(2)) +
    emv("58", "BR") +
    emv("59", pixMerchantName.slice(0, 25)) +
    emv("60", pixMerchantCity.slice(0, 15)) +
    emv("62", additionalData) +
    "6304";

  return payload + crc16(payload);
}

type GiftIdea = {
  title: string;
  amount: number;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
};

const sections: Array<{
  title: string;
  subtitle: string;
  items: GiftIdea[];
}> = [
  {
    title: "Nova Casa & Vida a Dois",
    subtitle: "Sugestões para o começo do nosso lar.",
    items: [
      {
        title: "Jogo de toalhas do casal",
        amount: 120,
        image: pexels(12679),
        imageAlt: "Toalhas dobradas em banheiro claro e elegante",
        icon: Bath,
      },
      {
        title: "Kit de organização da casa",
        amount: 120,
        image: pexels(8581052),
        imageAlt: "Ambiente organizado com caixas e cestos",
        icon: House,
      },
      {
        title: "Primeira compra do supermercado",
        amount: 180,
        image: pexels(264636),
        imageAlt: "Frutas, legumes e itens de mercado sobre a mesa",
        icon: Coffee,
      },
      {
        title: "Jantar especial dos recém-casados",
        amount: 150,
        image: pexels(1640777),
        imageAlt: "Mesa de jantar romântica em ambiente aconchegante",
        icon: UtensilsCrossed,
      },
      {
        title: "Conjunto de taças para brindar",
        amount: 180,
        image: pexels(1123260),
        imageAlt: "Taças elegantes sobre mesa de celebração",
        icon: Wine,
      },
      {
        title: "Cafeteira para os cafés da manhã juntos",
        amount: 200,
        image: pexels(11206191),
        imageAlt: "Cafeteira elétrica em uma bancada de cozinha",
        icon: Coffee,
      },
      {
        title: "Kit cama nova do casal",
        amount: 220,
        image: pexels(17404725),
        imageAlt: "Quarto com cama bem arrumada e tons claros",
        icon: Hotel,
      },
      {
        title: "Utensílios para cozinha",
        amount: 250,
        image: pexels(9475353),
        imageAlt: "Utensílios e panelas organizados na cozinha",
        icon: UtensilsCrossed,
      },
      {
        title: "Ajuda para eletrodomésticos",
        amount: 300,
        image: pexels(4258272),
        imageAlt: "Eletrodomésticos modernos em cozinha iluminada",
        icon: Microwave,
      },
      {
        title: "Contribuição para mobiliar o lar",
        amount: 400,
        image: pexels(13013748),
        imageAlt: "Sala aconchegante com móveis de madeira clara",
        icon: Sofa,
      },
      {
        title: "Mesa lateral ou aparador",
        amount: 550,
        image: pexels(1571460),
        imageAlt: "Mesa lateral decorativa em ambiente de estar",
        icon: Sofa,
      },
      {
        title: "Micro-ondas ou air fryer",
        amount: 650,
        image: pexels(1599791),
        imageAlt: "Pequeno eletrodoméstico em cozinha moderna",
        icon: Microwave,
      },
      {
        title: "Contribuição para máquina de lavar",
        amount: 1200,
        image: pexels(5591463),
        imageAlt: "Área de lavanderia organizada e moderna",
        icon: House,
      },
    ],
  },
  {
    title: "Lua de Mel",
    subtitle: "Experiências em Buenos Aires e Colonia del Sacramento.",
    items: [
      {
        title: "Café da manhã especial",
        amount: 120,
        image: pexels(376464),
        imageAlt: "Mesa de café da manhã com bebidas e frutas",
        icon: Coffee,
      },
      {
        title: "Passeio romântico",
        amount: 150,
        image: pexels(346885),
        imageAlt: "Passeio em cidade com clima de viagem",
        icon: Gift,
      },
      {
        title: "Almoço especial em Buenos Aires",
        amount: 180,
        image: pexels(262978),
        imageAlt: "Mesa de almoço elegante em restaurante da cidade",
        icon: UtensilsCrossed,
      },
      {
        title: "Jantar romântico na viagem",
        amount: 220,
        image: pexels(3171837),
        imageAlt: "Taças e mesa de jantar em ambiente intimista",
        icon: Wine,
      },
      {
        title: "Massagem relaxante",
        amount: 250,
        image: pexels(3757942),
        imageAlt: "Espaço de spa com clima relaxante",
        icon: Bath,
      },
      {
        title: "Passeio turístico especial",
        amount: 300,
        image: pexels(2444403),
        imageAlt: "Rua histórica com clima de passeio turístico",
        icon: Gift,
      },
      {
        title: "Uma diária da hospedagem",
        amount: 400,
        image: pexels(271624),
        imageAlt: "Quarto de hotel confortável e elegante",
        icon: Hotel,
      },
      {
        title: "Upgrade do quarto do casal",
        amount: 500,
        image: pexels(271618),
        imageAlt: "Quarto de hotel com atmosfera sofisticada",
        icon: Hotel,
      },
      {
        title: "Experiência gastronômica premium",
        amount: 650,
        image: pexels(1267320),
        imageAlt: "Prato refinado em restaurante elegante",
        icon: UtensilsCrossed,
      },
      {
        title: "Passeio completo em Buenos Aires",
        amount: 800,
        image: pexels(358319),
        imageAlt: "Paisagem urbana inspirada em Buenos Aires",
        icon: Gift,
      },
      {
        title: "Bate-volta a Colonia del Sacramento",
        amount: 900,
        image: pexels(1174732),
        imageAlt: "Rua charmosa em cidade histórica uruguaia",
        icon: Gift,
      },
    ],
  },
  {
    title: "Experiências do Casal",
    subtitle: "Momentos simples e especiais para a rotina a dois.",
    items: [
      {
        title: "Cinema + jantar dos recém-casados",
        amount: 120,
        image: pexels(7234322),
        imageAlt: "Sala de cinema com clima aconchegante",
        icon: Gift,
      },
      {
        title: "Noite especial a dois",
        amount: 150,
        image: pexels(941861),
        imageAlt: "Mesa de jantar em atmosfera romântica",
        icon: Wine,
      },
      {
        title: "Assinatura de streaming para maratonas",
        amount: 180,
        image: pexels(4009401),
        imageAlt: "Sala de estar confortável com televisão",
        icon: House,
      },
      {
        title: "Encontro gastronômico do casal",
        amount: 220,
        image: pexels(6287525),
        imageAlt: "Mesa de restaurante com pratos bem servidos",
        icon: UtensilsCrossed,
      },
      {
        title: "Final de semana romântico",
        amount: 350,
        image: pexels(1024960),
        imageAlt: "Paisagem serena com clima de viagem de fim de semana",
        icon: Gift,
      },
    ],
  },
];

function SectionCard({ idea }: { idea: GiftIdea }) {
  const [src, setSrc] = useState(idea.image);
  const [imageFailed, setImageFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const Icon = idea.icon;
  const pixPayload = buildPixPayload(idea);

  async function handleCopyItemPix() {
    setCopyStatus("idle");
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    } finally {
      setTimeout(() => setCopyStatus("idle"), 1800);
    }
  }

  return (
    <li className="rounded-2xl border border-gold/16 bg-white/88 p-3 shadow-[0_14px_34px_-32px_rgba(0,0,0,0.28)]">
      <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)_minmax(250px,300px)] sm:items-center">
        <div className="relative h-[68px] w-[68px] overflow-hidden rounded-xl border border-gold/16 bg-champagne/55 sm:h-[76px] sm:w-[76px]">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ivory to-champagne">
              <Icon className="h-7 w-7 text-gold-deep" strokeWidth={1.45} />
            </div>
          ) : (
            <Image
              src={src}
              alt={idea.imageAlt}
              fill
              unoptimized
              className="object-cover"
              sizes="76px"
              onError={() => {
                setImageFailed(true);
                setSrc("");
              }}
            />
          )}
        </div>

        <div className="min-w-0 self-center">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-muted sm:text-[0.68rem]">
            Presente sugerido
          </p>
          <h3 className="mt-0.5 text-[1.25rem] leading-[1.08] text-ink sm:text-[1.42rem]">
            {idea.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="text-xs text-ink/55">Valor de referência</span>
            <span className="text-xl font-semibold leading-none text-gold-deep sm:text-2xl">
              {currency.format(idea.amount)}
            </span>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1">
          <button
            type="button"
            aria-label={`Copiar código PIX de ${currency.format(idea.amount)} para ${idea.title}`}
            title={`Copiar PIX copia e cola de ${currency.format(idea.amount)}`}
            onClick={handleCopyItemPix}
            className={`inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 text-[0.78rem] font-semibold shadow-sm transition hover:border-gold/50 hover:bg-champagne/65 sm:h-11 sm:text-sm ${
              copyStatus === "success"
                ? "border-gold bg-gold text-ivory"
                : "border-gold/30 bg-white text-ink"
            }`}
          >
            <Copy className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
            <span className="truncate">{copyStatus === "success" ? "Copiado" : "Copiar PIX"}</span>
          </button>

          {cardPaymentUrl ? (
            <a
              href={cardPaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-2 text-[0.78rem] font-semibold text-ivory shadow-md shadow-gold/20 transition hover:-translate-y-0.5 sm:h-11 sm:text-sm"
            >
              <CreditCard className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
              <span className="truncate">Cartão</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-10 min-w-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-ink/10 px-2 text-[0.78rem] font-semibold text-ink/40 sm:h-11 sm:text-sm"
              title="Defina NEXT_PUBLIC_CARD_PAYMENT_URL com o link do Mercado Pago"
            >
              <CreditCard className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
              <span className="truncate">Cartão</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default function PresentesPage() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopyPix() {
    setCopyStatus("idle");
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    } finally {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <section className="relative px-5 pb-6 pt-5 sm:px-8 sm:pt-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/75 px-4 py-2 text-sm text-ink-soft shadow-sm backdrop-blur-sm transition hover:border-gold/40 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Voltar ao convite
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-gold/20 bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ink-soft sm:inline-flex">
            <Gift className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
            Presentes por PIX
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 sm:px-8 sm:pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold-muted">
              Nova casa, lua de mel e experiências
            </p>
            <h1 className="mt-3 text-4xl leading-tight text-ink sm:text-5xl">
              Ideias de presentes para a nossa vida a dois
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              As sugestões abaixo são apenas referências. Você pode contribuir via PIX ou usar o
              link de cartão quando estiver configurado.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#presentes" className="btn-primary px-5 text-base">
                Ver lista
              </a>
              <a href="#pix" className="btn-secondary px-5 text-base">
                PIX e cartão
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="presentes" className="space-y-10 px-5 pb-12 sm:px-8 sm:pb-16">
        {sections.map((section) => (
          <div key={section.title} className="mx-auto max-w-6xl">
            <div className="mb-4 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-muted">{section.title}</p>
              <h2 className="mt-1 text-2xl text-ink sm:text-3xl">{section.subtitle}</h2>
            </div>

            <ul className="space-y-3">
              {section.items.map((idea) => (
                <SectionCard key={idea.title} idea={idea} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="pix" className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-gold/20 bg-white/84 p-6 shadow-[0_24px_54px_-44px_rgba(0,0,0,0.34)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-muted">Pix e cartão</p>
            <h2 className="mt-3 text-3xl text-ink">Recebimento simples e prático</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              O PIX é a forma mais direta de contribuir. Para cartão, o ideal é usar um link de
              pagamento do Mercado Pago, porque ele é rápido de configurar e já suporta a
              experiência hospedada de checkout.
            </p>
          </div>

          <div className="rounded-[28px] border border-gold/20 bg-white/84 p-6 shadow-[0_24px_54px_-44px_rgba(0,0,0,0.34)] sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                aria-label={`Copiar chave PIX ${pixKey}`}
                onClick={handleCopyPix}
                className={`inline-flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${
                  copyStatus === "success"
                    ? "border-gold bg-gold text-ivory shadow-lg shadow-gold/30"
                    : "border-gold/30 bg-ivory/90 text-gold hover:bg-champagne/70"
                }`}
              >
                <Copy className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span className="ml-2 flex min-w-0 flex-col items-start leading-tight">
                  <span>Copiar PIX</span>
                  <span className="max-w-[190px] truncate text-xs font-normal opacity-75">{pixKey}</span>
                </span>
              </button>

              {cardPaymentUrl ? (
                <a
                  href={cardPaymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-4 text-sm font-semibold text-ivory shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
                >
                  <CreditCard className="mr-2 h-4 w-4" strokeWidth={1.8} />
                  Presentear com cartão
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-ink/10 px-4 text-sm font-medium text-ink/40"
                  title="Defina NEXT_PUBLIC_CARD_PAYMENT_URL com o link do Mercado Pago"
                >
                  <CreditCard className="mr-2 h-4 w-4" strokeWidth={1.8} />
                  Presentear com cartão
                </button>
              )}
            </div>

            <p className="mt-4 text-sm text-ink/55">
              {copyStatus === "success"
                ? "Chave Pix copiada."
                : copyStatus === "error"
                  ? "Não foi possível copiar a chave Pix."
                  : "No celular, os botões ficam lado a lado e ocupam toda a largura."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
