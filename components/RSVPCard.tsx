"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { OrnamentalDivider } from "@/components/DecorativeSvgs";
import { CheckCircle, ChevronDown } from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  guests: string;
  attendance: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  phone: "",
  guests: "0",
  attendance: "",
  notes: "",
};

export default function RSVPCard() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Por favor, informe seu nome completo.");
      return;
    }

    if (!formData.attendance) {
      setError("Selecione sua presença.");
      return;
    }

    setToast("Resposta registrada. Obrigado por confirmar!");
    setFormData(initialState);

    // Integração futura: enviar para Google Sheets via endpoint (ex. /api/rsvp).
    // fetch("/api/rsvp", { method: "POST", body: JSON.stringify(formData) });

    setTimeout(() => setToast(""), 3000);
  }

  return (
    <motion.section
      id="rsvp"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="lux-card relative px-7 py-9 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-ivory/85">
            <CheckCircle className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <OrnamentalDivider className="mt-4" />
          <h3 className="mt-4 text-3xl font-semibold tracking-wide text-ink">Confirme sua presença</h3>
          <p className="mt-2 text-xl text-ink-soft">
            Sua resposta nos ajuda a preparar cada detalhe com carinho.
          </p>
        </div>

        <form className="mt-7 space-y-4 text-left form-serif" onSubmit={handleSubmit}>
          <label className="block text-base font-medium tracking-[0.08em] text-ink/70">
            Nome completo
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-base mt-2"
              placeholder="Digite seu nome"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-base font-medium tracking-[0.08em] text-ink/70">
              Filhos acima de 2 anos
              <div className="relative mt-2">
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="input-base appearance-none pr-12"
                >
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70"
                  strokeWidth={1.6}
                />
              </div>
              <p className="mt-2 text-sm text-ink/60">
                * Crianças até 2 anos não precisam confirmar presença.
              </p>
            </label>

            <label className="block text-base font-medium tracking-[0.08em] text-ink/70">
              Você estará presente?
              <div className="relative mt-2">
                <select
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  required
                  className="input-base appearance-none pr-12"
                  style={{
                    color: formData.attendance
                      ? "var(--ink)"
                      : "rgba(42, 37, 33, 0.4)",
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="yes">Sim, estarei presente</option>
                  <option value="no">Não poderei ir</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70"
                  strokeWidth={1.6}
                />
              </div>
            </label>
          </div>

          <label className="block text-base font-medium tracking-[0.08em] text-ink/70">
            Deixe uma mensagem para os noivos
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-base mt-2 min-h-[110px]"
              placeholder="Mensagem aos noivos"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600/90" role="alert">
              {error}
            </p>
          ) : null}

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full text-lg"
            type="submit"
          >
            <CheckCircle className="mr-2 h-5 w-5" strokeWidth={1.6} />
            Enviar confirmação
          </motion.button>
        </form>

        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mt-4 rounded-2xl border border-gold/30 bg-ivory/80 px-4 py-3 text-sm text-ink-soft"
          >
            {toast}
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  );
}
