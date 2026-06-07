import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseStorageConfig, uploadSupabaseObject } from "@/lib/supabase-storage";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadedPhoto = {
  fileName: string;
  path: string;
};

export async function POST(request: Request) {
  try {
    const supabaseConfig = getSupabaseStorageConfig();

    if (!supabaseConfig) {
      return NextResponse.json(
        {
          ok: false,
          message: "Configuração do Supabase incompleta.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const guestName = String(formData.get("guestName") || "").trim();
    const files = formData
      .getAll("photos")
      .filter((file): file is File => file instanceof File);

    if (!files.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "Selecione pelo menos uma foto.",
        },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          ok: false,
          message: `Envie no máximo ${MAX_FILES} fotos por vez.`,
        },
        { status: 400 }
      );
    }

    const uploadedPhotos: UploadedPhoto[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            ok: false,
            message: "Envie apenas imagens JPG, PNG ou WebP.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            ok: false,
            message: "Uma das fotos ficou muito grande. Tente enviar menos fotos por vez.",
          },
          { status: 400 }
        );
      }

      const objectPath = buildObjectPath(file.name, guestName);
      await uploadSupabaseObject({
        config: supabaseConfig,
        objectPath,
        body: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      });

      uploadedPhotos.push({
        fileName: file.name,
        path: objectPath,
      });
    }

    return NextResponse.json({
      ok: true,
      message: `${uploadedPhotos.length} foto(s) enviadas com sucesso.`,
      count: uploadedPhotos.length,
      files: uploadedPhotos,
    });
  } catch (error) {
    console.error("Photo upload API error", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Não foi possível enviar as fotos agora.",
      },
      { status: 500 }
    );
  }
}

function buildObjectPath(fileName: string, guestName: string) {
  const date = new Date().toISOString().slice(0, 10);
  const guestFolder = slugify(guestName) || "convidado";
  const extension = getExtension(fileName);
  const safeFileName = slugify(fileName.replace(/\.[^.]+$/, "")) || "foto";

  return `${date}/${guestFolder}/${Date.now()}-${randomUUID()}-${safeFileName}${extension}`;
}

function getExtension(fileName: string) {
  const extension = fileName.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();

  return extension || ".jpg";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
