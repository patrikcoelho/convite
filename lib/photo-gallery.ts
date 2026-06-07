import { getSupabaseStorageConfig, listSupabaseObjects } from "@/lib/supabase-storage";

export function isGalleryAuthorized(secret: string | null) {
  const expectedSecret = process.env.PHOTOS_GALLERY_SECRET;

  if (!expectedSecret) {
    return true;
  }

  return secret === expectedSecret;
}

export async function listGalleryPhotos() {
  const config = getSupabaseStorageConfig();

  if (!config) {
    throw new Error("Configuração do Supabase incompleta.");
  }

  const photos = (await listSupabaseObjects(config))
    .filter((object) => object.mimeType.startsWith("image/"))
    .sort((a, b) => b.path.localeCompare(a.path));

  return photos;
}

export function getPhotoOwner(path: string) {
  const [, owner] = path.split("/");

  if (!owner) {
    return "convidado";
  }

  return owner.replace(/-/g, " ");
}

export function getSafeDownloadName(path: string) {
  return path.replace(/\//g, "-").replace(/[^a-zA-Z0-9._-]+/g, "-") || "foto.jpg";
}
