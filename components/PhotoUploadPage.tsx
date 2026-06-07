"use client";

import { motion } from "framer-motion";
import { Camera, CheckCircle, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { FloralCorner, OrnamentalDivider } from "@/components/DecorativeSvgs";

const MAX_FILES = 20;
const UPLOAD_BATCH_SIZE = 4;
const MAX_DIMENSION = 1400;
const JPEG_QUALITY = 0.74;

type UploadStatus = "idle" | "sending" | "success" | "error";

type SelectedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

export default function PhotoUploadPage() {
  const [guestName, setGuestName] = useState("");
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canSubmit = photos.length > 0 && status !== "sending";

  const totalSize = useMemo(
    () => photos.reduce((sum, photo) => sum + photo.file.size, 0),
    [photos]
  );

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!files.length) {
      return;
    }

    setStatus("idle");
    setMessage("");

    setPhotos((current) => {
      const remainingSlots = Math.max(MAX_FILES - current.length, 0);
      const nextFiles = files.slice(0, remainingSlots).map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      if (files.length > remainingSlots) {
        setMessage(`Você pode enviar até ${MAX_FILES} fotos por vez.`);
      }

      return [...current, ...nextFiles];
    });

    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return current.filter((photo) => photo.id !== id);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!photos.length) {
      setStatus("error");
      setMessage("Selecione pelo menos uma foto.");
      return;
    }

    setStatus("sending");
    setMessage("Preparando as fotos...");

    try {
      const compressedPhotos: File[] = [];

      for (let index = 0; index < photos.length; index += 1) {
        setMessage(`Preparando foto ${index + 1} de ${photos.length}...`);
        compressedPhotos.push(await compressImage(photos[index].file));
      }

      let sentCount = 0;

      for (let index = 0; index < compressedPhotos.length; index += UPLOAD_BATCH_SIZE) {
        const batch = compressedPhotos.slice(index, index + UPLOAD_BATCH_SIZE);
        const formData = new FormData();
        formData.append("guestName", guestName.trim());

        batch.forEach((photo) => {
          formData.append("photos", photo, photo.name);
        });

        setMessage(
          `Enviando fotos ${index + 1} a ${Math.min(
            index + batch.length,
            compressedPhotos.length
          )} de ${compressedPhotos.length}...`
        );

        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });

        const data = (await response.json().catch(() => null)) as
          | { ok?: boolean; message?: string; count?: number }
          | null;

        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || "Falha ao enviar fotos.");
        }

        sentCount += data.count || batch.length;
      }

      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPhotos([]);
      setGuestName("");
      setStatus("success");
      setMessage(`${sentCount} foto(s) foram enviadas com sucesso.`);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar as fotos.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <FloralCorner className="absolute -left-12 -top-8" />
        <FloralCorner className="absolute -bottom-10 -right-12 rotate-180" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center"
      >
        <div className="lux-card w-full px-6 py-8 sm:px-10 sm:py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ivory/85">
              <Camera className="h-5 w-5 text-gold" strokeWidth={1.5} />
            </div>
            <OrnamentalDivider className="mx-auto mt-4" />
            <p className="mt-4 text-xs uppercase tracking-[0.34em] text-gold-muted">
              Fotos do casamento
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Compartilhe seus registros com a gente
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-ink-soft">
              Selecione as fotos da sua galeria e envie direto para os noivos.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-base font-medium tracking-[0.08em] text-ink/70">
              Nome para identificar as fotos (opcional)
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gold/30 bg-ivory/85 px-4 py-3.5 text-base text-ink outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/20 placeholder:text-ink/40"
                placeholder="Digite seu nome"
              />
              <span className="mt-2 block text-sm leading-relaxed text-ink/55">
                Esse nome ajuda os noivos a saberem quem enviou as fotos.
              </span>
            </label>

            <div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                multiple
                className="sr-only"
                onChange={handleSelect}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="group flex min-h-[170px] w-full flex-col items-center justify-center rounded-[30px] border-2 border-dashed border-gold bg-gradient-to-br from-gold/12 via-white/90 to-champagne/80 px-5 py-9 text-center shadow-[0_18px_42px_-34px_rgba(166,127,67,0.9)] transition hover:-translate-y-0.5 hover:border-gold-deep hover:bg-white hover:shadow-[0_22px_48px_-34px_rgba(166,127,67,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ivory shadow-lg shadow-gold/25 transition group-hover:scale-105">
                  <ImagePlus className="h-7 w-7" strokeWidth={1.55} />
                </span>
                <span className="mt-5 text-3xl font-semibold text-ink">Selecionar fotos</span>
                <span className="mt-2 max-w-sm text-base leading-relaxed text-ink-soft">
                  Toque aqui para escolher até {MAX_FILES} fotos da sua galeria.
                </span>
              </button>
            </div>

            {photos.length ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm text-ink/60">
                  <span>
                    {photos.length} foto(s) selecionada(s)
                  </span>
                  <span>{formatBytes(totalSize)}</span>
                </div>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((photo) => (
                    <li
                      key={photo.id}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-gold/20 bg-white/70"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-ivory backdrop-blur-sm"
                        aria-label="Remover foto"
                      >
                        <X className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {message ? (
              <p
                className={`rounded-2xl border px-4 py-3 text-center text-base ${
                  status === "success"
                    ? "border-gold/30 bg-gold/10 text-gold-deep"
                    : status === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-gold/20 bg-ivory/75 text-ink-soft"
                }`}
                role={status === "error" ? "alert" : "status"}
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={1.7} />
              ) : status === "success" ? (
                <CheckCircle className="mr-2 h-5 w-5" strokeWidth={1.7} />
              ) : (
                <Upload className="mr-2 h-5 w-5" strokeWidth={1.7} />
              )}
              {status === "sending" ? "Enviando..." : "Enviar fotos"}
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}

async function compressImage(file: File) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );

  if (!blob) {
    return file;
  }

  const cleanName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${cleanName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível preparar uma das fotos."));
    };

    image.src = url;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
