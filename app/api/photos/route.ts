import { NextResponse } from "next/server";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadedPhoto = {
  fileName: string;
  mimeType: string;
  data: string;
};

export async function POST(request: Request) {
  try {
    const endpoint = process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

    if (!endpoint) {
      return NextResponse.json(
        {
          ok: false,
          message: "APPS_SCRIPT_URL não configurada.",
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

    const photos: UploadedPhoto[] = [];

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

      const bytes = Buffer.from(await file.arrayBuffer());

      photos.push({
        fileName: file.name,
        mimeType: file.type,
        data: bytes.toString("base64"),
      });
    }

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "photoUpload",
        guestName,
        photos,
      }),
      cache: "no-store",
    });

    const rawText = await upstreamResponse.text();
    const upstreamData = safeParseJson(rawText);

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          message:
            upstreamData?.message ||
            rawText.slice(0, 180) ||
            "Falha ao enviar fotos para o Apps Script.",
        },
        { status: 502 }
      );
    }

    if (upstreamData && upstreamData.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: upstreamData.message || "Apps Script recusou o envio das fotos.",
        },
        { status: 400 }
      );
    }

    if (!upstreamData) {
      return NextResponse.json(
        {
          ok: false,
          message: rawText.slice(0, 180) || "Resposta inválida do Apps Script.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: upstreamData?.message || "Fotos enviadas com sucesso.",
      count: upstreamData?.count || photos.length,
    });
  } catch (error) {
    console.error("Photo upload API error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível enviar as fotos agora.",
      },
      { status: 500 }
    );
  }
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as { ok?: boolean; message?: string; count?: number };
  } catch {
    return null;
  }
}
