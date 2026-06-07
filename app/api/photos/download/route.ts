import { NextResponse } from "next/server";
import {
  getSafeDownloadName,
  isGalleryAuthorized,
  listGalleryPhotos,
} from "@/lib/photo-gallery";
import { createZip } from "@/lib/zip";
import { downloadSupabaseObject, getSupabaseStorageConfig } from "@/lib/supabase-storage";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    if (!isGalleryAuthorized(url.searchParams.get("secret"))) {
      return NextResponse.json(
        {
          ok: false,
          message: "Não autorizado.",
        },
        { status: 401 }
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

    const photos = await listGalleryPhotos();

    if (!photos.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nenhuma foto encontrada.",
        },
        { status: 404 }
      );
    }

    const entries = [];

    for (const photo of photos) {
      const file = await downloadSupabaseObject(config, photo.path);

      entries.push({
        name: getSafeDownloadName(photo.path),
        data: file.buffer,
      });
    }

    const zip = createZip(entries);

    return new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="fotos-casamento.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Photo download error", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Não foi possível baixar as fotos.",
      },
      { status: 500 }
    );
  }
}
