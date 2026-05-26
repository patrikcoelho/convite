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
const freePaymentUrl = "https://www.asaas.com/c/r46edo1djdluvwes";

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
  if (typeof idea.amount !== "number") {
    return pixKey;
  }

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

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

type GiftIdea = {
  title: string;
  amount?: number;
  paymentUrl: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
};

const sections: Array<{
  id: string;
  title: string;
  subtitle: string;
  items: GiftIdea[];
}> = [
  {
    id: "casa",
    title: "Nova Casa & Vida a Dois",
    subtitle: "Sugestões para o começo do nosso lar.",
    items: [
      {
        title: "Jogo de toalhas do casal",
        amount: 120,
        paymentUrl: "https://www.asaas.com/c/s2rfaauyfbxn4h2a",
        image: pexels(12679),
        imageAlt: "Toalhas dobradas em banheiro claro e elegante",
        icon: Bath,
      },
      {
        title: "Kit de organização da casa",
        amount: 120,
        paymentUrl: "https://www.asaas.com/c/x96d7it904ayo47w",
        image: pexels(8581052),
        imageAlt: "Ambiente organizado com caixas e cestos",
        icon: House,
      },
      {
        title: "Primeira compra do supermercado",
        amount: 180,
        paymentUrl: "https://www.asaas.com/c/t6mu9g2hh4r8ksjc",
        image: pexels(264636),
        imageAlt: "Frutas, legumes e itens de mercado sobre a mesa",
        icon: Coffee,
      },
      {
        title: "Jantar especial dos recém-casados",
        amount: 150,
        paymentUrl: "https://www.asaas.com/c/wts4l06uxq0mns9m",
        image: pexels(1640777),
        imageAlt: "Mesa de jantar romântica em ambiente aconchegante",
        icon: UtensilsCrossed,
      },
      {
        title: "Conjunto de taças para brindar",
        amount: 180,
        paymentUrl: "https://www.asaas.com/c/0yt3eya4uz3n3fdf",
        image: pexels(1123260),
        imageAlt: "Taças elegantes sobre mesa de celebração",
        icon: Wine,
      },
      {
        title: "Cafeteira para os cafés da manhã juntos",
        amount: 200,
        paymentUrl: "https://www.asaas.com/c/tc1oq2p50t6zh0kg",
        image: pexels(11206191),
        imageAlt: "Cafeteira elétrica em uma bancada de cozinha",
        icon: Coffee,
      },
      {
        title: "Kit cama nova do casal",
        amount: 220,
        paymentUrl: "https://www.asaas.com/c/uv8emcviuf91utgz",
        image: pexels(17404725),
        imageAlt: "Quarto com cama bem arrumada e tons claros",
        icon: Hotel,
      },
      {
        title: "Utensílios para cozinha",
        amount: 250,
        paymentUrl: "https://www.asaas.com/c/duzemj0tyas05o19",
        image: pexels(9475353),
        imageAlt: "Utensílios e panelas organizados na cozinha",
        icon: UtensilsCrossed,
      },
      {
        title: "Ajuda para eletrodomésticos",
        amount: 300,
        paymentUrl: "https://www.asaas.com/c/rgwdxpdtqe58i7wu",
        image: pexels(4258272),
        imageAlt: "Eletrodomésticos modernos em cozinha iluminada",
        icon: Microwave,
      },
      {
        title: "Contribuição para mobiliar o lar",
        amount: 400,
        paymentUrl: "https://www.asaas.com/c/r3x0bb7y6kjfl19e",
        image: pexels(13013748),
        imageAlt: "Sala aconchegante com móveis de madeira clara",
        icon: Sofa,
      },
      {
        title: "Mesa lateral ou aparador",
        amount: 550,
        paymentUrl: "https://www.asaas.com/c/h7hwrn62bh2xeq12",
        image: pexels(1571460),
        imageAlt: "Mesa lateral decorativa em ambiente de estar",
        icon: Sofa,
      },
      {
        title: "Micro-ondas ou air fryer",
        amount: 650,
        paymentUrl: "https://www.asaas.com/c/8yq1l2pk3yd0dgfz",
        image: pexels(1599791),
        imageAlt: "Pequeno eletrodoméstico em cozinha moderna",
        icon: Microwave,
      },
      {
        title: "Contribuição para máquina de lavar",
        amount: 1200,
        paymentUrl: "https://www.asaas.com/c/49yspj9tltzfnahx",
        image: pexels(5591463),
        imageAlt: "Área de lavanderia organizada e moderna",
        icon: House,
      },
    ],
  },
  {
    id: "lua-de-mel",
    title: "Lua de Mel",
    subtitle: "Experiências em Buenos Aires e Colonia del Sacramento.",
    items: [
      {
        title: "Café da manhã especial",
        amount: 120,
        paymentUrl: "https://www.asaas.com/c/biokokrxv44iehap",
        image: pexels(376464),
        imageAlt: "Mesa de café da manhã com bebidas e frutas",
        icon: Coffee,
      },
      {
        title: "Passeio romântico",
        amount: 150,
        paymentUrl: "https://www.asaas.com/c/ofedjrfu6d6ooohr",
        image: pexels(346885),
        imageAlt: "Passeio em cidade com clima de viagem",
        icon: Gift,
      },
      {
        title: "Almoço especial em Buenos Aires",
        amount: 180,
        paymentUrl: "https://www.asaas.com/c/yztbovbbq3fzkag9",
        image: pexels(262978),
        imageAlt: "Mesa de almoço elegante em restaurante da cidade",
        icon: UtensilsCrossed,
      },
      {
        title: "Jantar romântico na viagem",
        amount: 220,
        paymentUrl: "https://www.asaas.com/c/8bfa1cuvr6fsprul",
        image: pexels(3171837),
        imageAlt: "Taças e mesa de jantar em ambiente intimista",
        icon: Wine,
      },
      {
        title: "Massagem relaxante",
        amount: 250,
        paymentUrl: "https://www.asaas.com/c/pfkb56r7jh0sec5g",
        image: pexels(3757942),
        imageAlt: "Espaço de spa com clima relaxante",
        icon: Bath,
      },
      {
        title: "Passeio turístico especial",
        amount: 300,
        paymentUrl: "https://www.asaas.com/c/64dqyczlnzgqklh0",
        image: pexels(2444403),
        imageAlt: "Rua histórica com clima de passeio turístico",
        icon: Gift,
      },
      {
        title: "Uma diária da hospedagem",
        amount: 400,
        paymentUrl: "https://www.asaas.com/c/lat7f0a8fqxl6n2h",
        image: pexels(271624),
        imageAlt: "Quarto de hotel confortável e elegante",
        icon: Hotel,
      },
      {
        title: "Upgrade do quarto do casal",
        amount: 500,
        paymentUrl: "https://www.asaas.com/c/lya16hq10aosw7uk",
        image: pexels(271618),
        imageAlt: "Quarto de hotel com atmosfera sofisticada",
        icon: Hotel,
      },
      {
        title: "Experiência gastronômica premium",
        amount: 650,
        paymentUrl: "https://www.asaas.com/c/8gnn0lqi1mm5rj4k",
        image: pexels(1267320),
        imageAlt: "Prato refinado em restaurante elegante",
        icon: UtensilsCrossed,
      },
      {
        title: "Passeio completo em Buenos Aires",
        amount: 800,
        paymentUrl: "https://www.asaas.com/c/rjtgre1lkaexrbrt",
        image: pexels(358319),
        imageAlt: "Paisagem urbana inspirada em Buenos Aires",
        icon: Gift,
      },
      {
        title: "Bate-volta a Colonia del Sacramento",
        amount: 900,
        paymentUrl: "https://www.asaas.com/c/wmhryjsvpfdu8ck3",
        image: pexels(1174732),
        imageAlt: "Rua charmosa em cidade histórica uruguaia",
        icon: Gift,
      },
    ],
  },
  {
    id: "experiencias",
    title: "Experiências do Casal",
    subtitle: "Momentos simples e especiais para a rotina a dois.",
    items: [
      {
        title: "Cinema + jantar dos recém-casados",
        amount: 120,
        paymentUrl: "https://www.asaas.com/c/55rmpi5z1eow4eua",
        image: pexels(7234322),
        imageAlt: "Sala de cinema com clima aconchegante",
        icon: Gift,
      },
      {
        title: "Noite especial a dois",
        amount: 150,
        paymentUrl: "https://www.asaas.com/c/fhbbvmkxircpfj1b",
        image: pexels(941861),
        imageAlt: "Mesa de jantar em atmosfera romântica",
        icon: Wine,
      },
      {
        title: "Assinatura de streaming para maratonas",
        amount: 180,
        paymentUrl: "https://www.asaas.com/c/d3ck48csx1jdllw5",
        image: pexels(4009401),
        imageAlt: "Sala de estar confortável com televisão",
        icon: House,
      },
      {
        title: "Encontro gastronômico do casal",
        amount: 220,
        paymentUrl: "https://www.asaas.com/c/nsu328c8wiq1exen",
        image: pexels(6287525),
        imageAlt: "Mesa de restaurante com pratos bem servidos",
        icon: UtensilsCrossed,
      },
      {
        title: "Final de semana romântico",
        amount: 350,
        paymentUrl: "https://www.asaas.com/c/lja6tfpj9iw4s3g3",
        image: pexels(1024960),
        imageAlt: "Paisagem serena com clima de viagem de fim de semana",
        icon: Gift,
      },
      {
        title: "Contribuição de valor livre",
        paymentUrl: "https://www.asaas.com/c/r46edo1djdluvwes",
        image: pexels(1796698),
        imageAlt: "Mesa preparada para uma celebração especial",
        icon: Gift,
      },
    ],
  },
];

const giftFilters = [
  { id: "todos", label: "Todos" },
  { id: "casa", label: "Nova casa" },
  { id: "lua-de-mel", label: "Lua de mel" },
  { id: "experiencias", label: "Experiências" },
  { id: "valor-livre", label: "Valor livre" },
] as const;

function SectionCard({ idea }: { idea: GiftIdea }) {
  const [src, setSrc] = useState(idea.image);
  const [imageFailed, setImageFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = idea.icon;
  const pixPayload = buildPixPayload(idea);
  const hasFixedAmount = typeof idea.amount === "number";
  const amountText = hasFixedAmount ? currency.format(idea.amount as number) : "Valor livre";

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  async function handleCopyItemPix() {
    setCopyStatus("idle");
    if (await copyText(pixPayload)) {
      setCopyStatus("success");
    } else {
      setCopyStatus("error");
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopyStatus("idle"), 2600);
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
              {amountText}
            </span>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1">
          <button
            type="button"
            aria-label={
              hasFixedAmount
                ? `Copiar código PIX de ${amountText} para ${idea.title}`
                : `Copiar chave PIX para ${idea.title}`
            }
            title={
              hasFixedAmount
                ? `Copiar PIX copia e cola de ${amountText}`
                : `Copiar chave PIX: ${pixKey}`
            }
            onClick={handleCopyItemPix}
            className={`inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 text-[0.78rem] font-semibold shadow-sm transition hover:border-gold/50 hover:bg-champagne/65 sm:h-11 sm:text-sm ${
              copyStatus === "success"
                ? "border-gold bg-gold text-ivory"
                : "border-gold/30 bg-white text-ink"
            }`}
          >
            <Copy className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
            <span className="truncate">
              {copyStatus === "success"
                ? "Copiado"
                : hasFixedAmount
                  ? `Pix ${amountText}`
                  : "Pix livre"}
            </span>
          </button>

          <a
            href={idea.paymentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-2 text-[0.78rem] font-semibold text-ivory shadow-md shadow-gold/20 transition hover:-translate-y-0.5 sm:h-11 sm:text-sm"
          >
            <CreditCard className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
            <span className="truncate">Cartão até 21x</span>
          </a>
        </div>

        {copyStatus !== "idle" ? (
          <p
            className={`col-span-2 text-sm sm:col-start-2 sm:col-end-4 ${
              copyStatus === "success" ? "text-gold-deep" : "text-red-600/90"
            }`}
            role="status"
          >
            {copyStatus === "success"
              ? hasFixedAmount
                ? `Código Pix de ${amountText} copiado.`
                : "Chave Pix livre copiada."
              : "Não foi possível copiar o Pix."}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export default function PresentesPage() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeFilter, setActiveFilter] = useState<(typeof giftFilters)[number]["id"]>("todos");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleSections =
    activeFilter === "todos"
      ? sections
      : activeFilter === "valor-livre"
        ? sections
            .map((section) => ({
              ...section,
              items: section.items.filter((item) => typeof item.amount !== "number"),
            }))
            .filter((section) => section.items.length > 0)
        : sections.filter((section) => section.id === activeFilter);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopyPix() {
    setCopyStatus("idle");
    if (await copyText(pixKey)) {
      setCopyStatus("success");
    } else {
      setCopyStatus("error");
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
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
              As sugestões abaixo são apenas referências. Você pode escolher uma ideia, copiar o
              Pix com o valor correspondente ou contribuir pelo cartão.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-7 sm:px-8 sm:pb-9">
        <div className="mx-auto max-w-6xl">
          <div
            className="flex gap-2 overflow-x-auto rounded-full border border-gold/20 bg-white/60 p-1 shadow-sm"
            aria-label="Filtrar sugestões de presentes"
          >
            {giftFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                  activeFilter === filter.id
                    ? "bg-gold text-ivory shadow-md shadow-gold/20"
                    : "text-ink-soft hover:bg-champagne/75 hover:text-ink"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="pix" className="px-5 pb-10 sm:px-8 sm:pb-14">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-gold/20 bg-white/84 p-6 shadow-[0_24px_54px_-44px_rgba(0,0,0,0.34)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(300px,430px)] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-gold-muted">Valor livre</p>
              <h2 className="mt-3 text-3xl text-ink">Contribuição sem escolher presente</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Se preferir não escolher uma sugestão específica, você pode enviar um Pix livre ou
                usar o cartão com o valor que desejar.
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                aria-label={`Copiar chave PIX ${pixKey}`}
                onClick={handleCopyPix}
                className={`inline-flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 ${
                  copyStatus === "success"
                    ? "border-gold bg-gold text-ivory shadow-lg shadow-gold/30"
                    : "border-gold/45 bg-white text-ink hover:bg-champagne/70"
                }`}
              >
                <Copy className="h-4 w-4 shrink-0 text-gold-deep" strokeWidth={1.8} />
                <span className="ml-2 flex min-w-0 flex-col items-start leading-tight">
                  <span className="text-ink">Pix - valor livre</span>
                  <span className="max-w-[220px] truncate text-xs font-normal text-ink-soft">{pixKey}</span>
                </span>
              </button>

              <a
                href={freePaymentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-4 text-sm font-semibold text-ivory shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
              >
                <CreditCard className="mr-2 h-4 w-4" strokeWidth={1.8} />
                Contribuir no cartão
              </a>

              <p className="text-sm text-ink/55">
                {copyStatus === "success"
                  ? "Chave Pix copiada."
                  : copyStatus === "error"
                    ? "Não foi possível copiar a chave Pix."
                    : "Use esta opção para presentear com qualquer valor."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="presentes" className="space-y-10 px-5 pb-12 sm:px-8 sm:pb-16">
        {visibleSections.map((section) => (
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

    </main>
  );
}
