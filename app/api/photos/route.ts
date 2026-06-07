import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadedPhoto = {
  fileName: string;
  path: string;
};

type SupabaseError = {
  message?: string;
  error?: string;
};

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_PHOTOS_BUCKET || "wedding-photos";

    if (!supabaseUrl || !serviceRoleKey || !bucket) {
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
      await uploadToSupabase({
        supabaseUrl,
        serviceRoleKey,
        bucket,
        objectPath,
        file,
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

async function uploadToSupabase({
  supabaseUrl,
  serviceRoleKey,
  bucket,
  objectPath,
  file,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  bucket: string;
  objectPath: string;
  file: File;
}) {
  const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${encodePath(
    bucket
  )}/${encodePath(objectPath)}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: Buffer.from(await file.arrayBuffer()),
    cache: "no-store",
  });

  if (response.ok) {
    return;
  }

  const rawText = await response.text();
  const data = safeParseJson(rawText);
  const message =
    data?.message ||
    data?.error ||
    rawText.slice(0, 180) ||
    "Falha ao salvar foto no Supabase.";

  throw new Error(message);
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

function encodePath(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as SupabaseError;
  } catch {
    return null;
  }
}
