import { Camera, Download, ImageOff } from "lucide-react";
import { FloralCorner, OrnamentalDivider } from "@/components/DecorativeSvgs";
import { getPhotoOwner, isGalleryAuthorized, listGalleryPhotos } from "@/lib/photo-gallery";

type PhotosPageProps = {
  searchParams: Promise<{
    secret?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SentPhotosPage({ searchParams }: PhotosPageProps) {
  const { secret } = await searchParams;
  const isAuthorized = isGalleryAuthorized(secret || null);
  const photos = isAuthorized ? await listGalleryPhotos() : [];
  const query = secret ? `?secret=${encodeURIComponent(secret)}` : "";

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <FloralCorner className="absolute -left-12 -top-8" />
        <FloralCorner className="absolute -bottom-10 -right-12 rotate-180" />
      </div>

      <section className="relative mx-auto max-w-6xl">
        <div className="lux-card px-6 py-8 sm:px-10 sm:py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ivory/85">
              <Camera className="h-5 w-5 text-gold" strokeWidth={1.5} />
            </div>
            <OrnamentalDivider className="mx-auto mt-4" />
            <p className="mt-4 text-xs uppercase tracking-[0.34em] text-gold-muted">
              Galeria dos convidados
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Fotos enviadas
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Veja os registros recebidos pelo QR Code e baixe as fotos quando quiser.
            </p>
          </div>

          {!isAuthorized ? (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-red-200 bg-red-50 px-5 py-5 text-center text-red-700">
              Acesso não autorizado. Confira o link da galeria ou configure o segredo correto.
            </div>
          ) : (
            <>
              <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-gold/25 bg-ivory/75 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-gold-muted">
                    Total recebido
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-ink">
                    {photos.length} foto(s)
                  </p>
                </div>

                <a
                  href={`/api/photos/download${query}`}
                  className={`btn-primary ${photos.length ? "" : "pointer-events-none opacity-50"}`}
                >
                  <Download className="mr-2 h-5 w-5" strokeWidth={1.7} />
                  Baixar todas
                </a>
              </div>

              {photos.length ? (
                <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => {
                    const fileQuery = new URLSearchParams({
                      path: photo.path,
                      ...(secret ? { secret } : {}),
                    }).toString();

                    return (
                      <li
                        key={photo.path}
                        className="group overflow-hidden rounded-3xl border border-gold/20 bg-white/75 shadow-[0_18px_44px_-36px_rgba(0,0,0,0.35)]"
                      >
                        <a
                          href={`/api/photos/file?${fileQuery}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/photos/file?${fileQuery}`}
                            alt=""
                            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </a>
                        <div className="space-y-2 px-4 py-3">
                          <p className="truncate text-base font-semibold capitalize text-ink">
                            {getPhotoOwner(photo.path)}
                          </p>
                          <a
                            href={`/api/photos/file?${fileQuery}`}
                            download
                            className="inline-flex text-sm font-semibold text-gold-deep hover:text-ink"
                          >
                            Baixar foto
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-gold/35 bg-ivory/70 px-5 py-12 text-center">
                  <ImageOff className="h-10 w-10 text-gold" strokeWidth={1.4} />
                  <h2 className="mt-4 text-3xl font-semibold text-ink">
                    Nenhuma foto enviada ainda
                  </h2>
                  <p className="mt-2 max-w-md text-lg leading-relaxed text-ink-soft">
                    Assim que os convidados enviarem fotos pela página do QR Code, elas aparecerão aqui.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
