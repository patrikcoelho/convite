import { NextResponse } from "next/server";
import { getSafeDownloadName, isGalleryAuthorized } from "@/lib/photo-gallery";
import { downloadSupabaseObject, getSupabaseStorageConfig } from "@/lib/supabase-storage";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path");

    if (!isGalleryAuthorized(url.searchParams.get("secret"))) {
      return NextResponse.json(
        {
          ok: false,
          message: "Não autorizado.",
        },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        {
          ok: false,
          message: "Foto não informada.",
        },
        { status: 400 }
      );
    }

    const config = getSupabaseStorageConfig();

    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          message: "Configuração do Supabase incompleta.",
        },
        { status: 500 }
      );
    }

    const file = await downloadSupabaseObject(config, path);

    return new Response(file.buffer, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename="${getSafeDownloadName(path)}"`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("Photo file error", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Não foi possível abrir a foto.",
      },
      { status: 500 }
    );
  }
}
