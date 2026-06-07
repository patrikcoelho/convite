import { NextResponse } from "next/server";
import { getPhotoOwner, isGalleryAuthorized, listGalleryPhotos } from "@/lib/photo-gallery";

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

    const photos = await listGalleryPhotos();

    return NextResponse.json({
      ok: true,
      count: photos.length,
      photos: photos.map((photo) => ({
        path: photo.path,
        name: photo.name,
        owner: getPhotoOwner(photo.path),
        size: photo.size,
        updatedAt: photo.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Photo list error", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Não foi possível listar as fotos.",
      },
      { status: 500 }
    );
  }
}
