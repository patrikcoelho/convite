"use client";

import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { useMemo, useState } from "react";

type PresenceValue = "sim" | "nao" | "";

type FormState = {
  nomeCompleto: string;
  presenca: PresenceValue;
  quantidadeAcompanhantes: number;
  nomesAcompanhantes: string[];
  telefoneWhatsapp: string;
  restricoesAlimentares: string;
  mensagemAosNoivos: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus = "idle" | "loading" | "success" | "error";

const initialState: FormState = {
  nomeCompleto: "",
  presenca: "",
  quantidadeAcompanhantes: 0,
  nomesAcompanhantes: [],
  telefoneWhatsapp: "",
  restricoesAlimentares: "",
  mensagemAosNoivos: "",
};

export default function RsvpSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const quantityOptions = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handlePresenceChange(value: PresenceValue) {
    setForm((prev) => {
      const next = { ...prev, presenca: value };
      if (value === "nao") {
        next.quantidadeAcompanhantes = 0;
        next.nomesAcompanhantes = [];
      }
      return next;
    });
  }

  function handleQuantityChange(value: number) {
    setForm((prev) => {
      const names = Array.from({ length: value }, (_, index) => prev.nomesAcompanhantes[index] ?? "");
      return { ...prev, quantidadeAcompanhantes: value, nomesAcompanhantes: names };
    });
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!form.nomeCompleto.trim()) {
      nextErrors.nomeCompleto = "Informe seu nome completo.";
    }
    if (!form.presenca) {
      nextErrors.presenca = "Selecione sua presença.";
    }
    if (form.presenca === "sim") {
      if (form.quantidadeAcompanhantes < 0 || form.quantidadeAcompanhantes > 5) {
        nextErrors.quantidadeAcompanhantes = "Escolha entre 0 e 5 acompanhantes.";
      }
      if (form.quantidadeAcompanhantes > 0) {
        const hasEmpty = form.nomesAcompanhantes.some((name) => !name.trim());
        if (hasEmpty) {
          nextErrors.nomesAcompanhantes = "Preencha o nome de cada acompanhante.";
        }
      }
    }
    return nextErrors;
  }

  async function submitToForms() {
    const action = process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION;
    const entries = {
      nome: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME,
      presenca: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_PRESENCE,
      quantidade: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_QUANTITY,
      acompanhantes: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_COMPANIONS,
      whatsapp: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_WHATSAPP,
      restricoes: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_RESTRICTIONS,
      mensagem: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE,
    };

    if (!action || Object.values(entries).some((value) => !value)) {
      throw new Error("Configuração do Google Forms incompleta.");
    }

    const params = new URLSearchParams();
    params.append(entries.nome as string, form.nomeCompleto);
    params.append(entries.presenca as string, form.presenca === "sim" ? "Sim" : "Não");
    params.append(entries.quantidade as string, String(form.quantidadeAcompanhantes));
    params.append(entries.acompanhantes as string, form.nomesAcompanhantes.join(", "));
    params.append(entries.whatsapp as string, form.telefoneWhatsapp);
    params.append(entries.restricoes as string, form.restricoesAlimentares);
    params.append(entries.mensagem as string, form.mensagemAosNoivos);

    await fetch(action, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  }

  async function submitToAppsScript() {
    const endpoint = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!endpoint) {
      throw new Error("Informe a URL do Apps Script.");
    }

    const payload = {
      ...form,
      presenca: form.presenca === "sim" ? "Sim" : "Não",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar sua confirmação.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setStatusMessage("Revise os campos destacados.");
      return;
    }

    try {
      setStatus("loading");
      const provider = process.env.NEXT_PUBLIC_RSVP_PROVIDER ?? "forms";
      if (provider === "apps_script") {
        await submitToAppsScript();
      } else {
        await submitToForms();
      }
      setStatus("success");
      setStatusMessage("Confirmação enviada com sucesso. Obrigado!");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage("Não foi possível enviar agora. Tente novamente mais tarde.");
    }
  }

  return (
    <section
      id="rsvp"
      className="section-shell px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-6xl lg:w-full">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-12">
          <div className="relative min-h-[360px] overflow-hidden rounded-[30px] border border-gold/30 shadow-2xl sm:min-h-[480px] sm:rounded-[40px] lg:h-full lg:max-h-[68vh]">
            <Image
              src="/stock/bouquet.jpg"
              alt="Buquê de flores"
              width={680}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.5),transparent_60%)]" />
            <div className="mt-4 rounded-[22px] border border-gold/40 bg-white/90 p-5 text-sm text-ink sm:absolute sm:bottom-8 sm:left-8 sm:right-8 sm:mt-0 sm:rounded-[28px] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-muted">RSVP</p>
              <p className="mt-3 text-base text-ink">
                Confirme sua presença para que possamos preparar cada detalhe.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-gold/30 bg-white/90 px-5 py-8 shadow-xl sm:rounded-[40px] sm:px-10 sm:py-10 lg:h-full lg:max-h-[68vh]">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gold/10 p-3 text-gold">
                <HeartHandshake className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-muted">
                  RSVP
                </p>
                <h2 className="mt-2 text-3xl text-ink sm:text-4xl">
                  Confirme sua presença
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Sua resposta nos ajuda a organizar cada detalhe com carinho.
            </p>

            <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
              {status !== "idle" && statusMessage && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    status === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : status === "loading"
                        ? "border-gold/30 bg-white/70 text-gold-muted"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {status === "loading" ? "Enviando sua confirmação..." : statusMessage}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="nomeCompleto">
                    Nome completo *
                  </label>
                  <input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    className="input-base mt-2"
                    value={form.nomeCompleto}
                    onChange={(event) => updateField("nomeCompleto", event.target.value)}
                    placeholder="Seu nome e sobrenome"
                  />
                  {errors.nomeCompleto && (
                    <p className="mt-2 text-xs text-rose-600">{errors.nomeCompleto}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="presenca">
                    Presença *
                  </label>
                  <select
                    id="presenca"
                    name="presenca"
                    className="input-base mt-2"
                    value={form.presenca}
                    onChange={(event) => handlePresenceChange(event.target.value as PresenceValue)}
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim, estarei presente</option>
                    <option value="nao">Não poderei comparecer</option>
                  </select>
                  {errors.presenca && (
                    <p className="mt-2 text-xs text-rose-600">{errors.presenca}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="quantidade">
                    Quantidade de acompanhantes
                  </label>
                  <select
                    id="quantidade"
                    name="quantidade"
                    className="input-base mt-2"
                    value={form.quantidadeAcompanhantes}
                    onChange={(event) => handleQuantityChange(Number(event.target.value))}
                    disabled={form.presenca !== "sim"}
                  >
                    {quantityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.quantidadeAcompanhantes && (
                    <p className="mt-2 text-xs text-rose-600">
                      {errors.quantidadeAcompanhantes}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="telefoneWhatsapp">
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="telefoneWhatsapp"
                    name="telefoneWhatsapp"
                    className="input-base mt-2"
                    value={form.telefoneWhatsapp}
                    onChange={(event) => updateField("telefoneWhatsapp", event.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {form.presenca === "sim" && form.quantidadeAcompanhantes > 0 && (
                <div>
                  <label className="text-sm font-semibold text-ink">
                    Nomes dos acompanhantes *
                  </label>
                  <div className="mt-3 grid gap-3">
                    {form.nomesAcompanhantes.map((name, index) => (
                      <input
                        key={`acompanhante-${index}`}
                        className="input-base"
                        value={name}
                        onChange={(event) => {
                          const nextNames = [...form.nomesAcompanhantes];
                          nextNames[index] = event.target.value;
                          updateField("nomesAcompanhantes", nextNames);
                        }}
                        placeholder={`Acompanhante ${index + 1}`}
                      />
                    ))}
                  </div>
                  {errors.nomesAcompanhantes && (
                    <p className="mt-2 text-xs text-rose-600">
                      {errors.nomesAcompanhantes}
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="restricoes">
                    Restrições alimentares
                  </label>
                  <input
                    id="restricoes"
                    name="restricoes"
                    className="input-base mt-2"
                    value={form.restricoesAlimentares}
                    onChange={(event) => updateField("restricoesAlimentares", event.target.value)}
                    placeholder="Vegetariano, sem lactose..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="mensagem">
                    Mensagem aos noivos
                  </label>
                  <input
                    id="mensagem"
                    name="mensagem"
                    className="input-base mt-2"
                    value={form.mensagemAosNoivos}
                    onChange={(event) => updateField("mensagemAosNoivos", event.target.value)}
                    placeholder="Deixe seu recado"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-3">
                <button className="btn-primary" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Enviando..." : "Enviar confirmação"}
                </button>
                <p className="text-xs text-ink-soft">* Campos obrigatórios</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
