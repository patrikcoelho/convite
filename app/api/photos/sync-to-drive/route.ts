import { NextResponse } from "next/server";
import {
  downloadSupabaseObject,
  getSupabaseStorageConfig,
  listSupabaseObjects,
  tryDownloadSupabaseObject,
  uploadSupabaseObject,
  type SupabaseStoredObject,
} from "@/lib/supabase-storage";

const MANIFEST_PATH = ".sync/drive-manifest.json";
const DEFAULT_BATCH_SIZE = 2;
const MAX_BATCH_SIZE = 4;

type DriveSyncManifest = {
  version: number;
  updatedAt: string;
  syncedPaths: string[];
};

type AppsScriptResponse = {
  ok?: boolean;
  message?: string;
  count?: number;
};

export async function GET(request: Request) {
  return syncPhotosToDrive(request);
}

export async function POST(request: Request) {
  return syncPhotosToDrive(request);
}

async function syncPhotosToDrive(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Não autorizado.",
        },
        { status: 401 }
      );
    }

    const supabaseConfig = getSupabaseStorageConfig();
    const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

    if (!supabaseConfig || !appsScriptUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Configuração de Supabase ou Apps Script incompleta.",
        },
        { status: 500 }
      );
    }

    const manifest = await loadManifest(supabaseConfig);
    const syncedPathSet = new Set(manifest.syncedPaths);
    const pendingObjects = (await listSupabaseObjects(supabaseConfig))
      .filter((object) => isImageObject(object))
      .filter((object) => !syncedPathSet.has(object.path))
      .sort((a, b) => a.path.localeCompare(b.path));
    const batchSize = getBatchSize();
    const currentBatch = pendingObjects.slice(0, batchSize);

    if (!currentBatch.length) {
      return NextResponse.json({
        ok: true,
        message: "Nenhuma foto pendente para sincronizar.",
        synced: 0,
        pending: 0,
      });
    }

    const photos = [];

    for (const object of currentBatch) {
      const file = await downloadSupabaseObject(supabaseConfig, object.path);

      photos.push({
        fileName: getDriveFileName(object.path),
        mimeType: normalizeMimeType(file.contentType, object.mimeType),
        data: file.buffer.toString("base64"),
      });
    }

    const appsScriptData = await sendPhotosToDrive(appsScriptUrl, {
      guestName: "supabase",
      photos,
    });

    if (appsScriptData.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: appsScriptData.message || "Apps Script recusou a sincronização.",
        },
        { status: 502 }
      );
    }

    currentBatch.forEach((object) => syncedPathSet.add(object.path));

    await saveManifest(supabaseConfig, {
      version: 1,
      updatedAt: new Date().toISOString(),
      syncedPaths: Array.from(syncedPathSet).sort(),
    });

    return NextResponse.json({
      ok: true,
      message: `${currentBatch.length} foto(s) sincronizadas com o Drive.`,
      synced: currentBatch.length,
      pending: Math.max(0, pendingObjects.length - currentBatch.length),
    });
  } catch (error) {
    console.error("Photo Drive sync error", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível sincronizar fotos com o Drive.",
      },
      { status: 500 }
    );
  }
}

async function loadManifest(config: NonNullable<ReturnType<typeof getSupabaseStorageConfig>>) {
  const file = await tryDownloadSupabaseObject(config, MANIFEST_PATH);

  if (!file) {
    return createEmptyManifest();
  }

  try {
    const manifest = JSON.parse(file.buffer.toString("utf8")) as Partial<DriveSyncManifest>;

    return {
      version: 1,
      updatedAt: manifest.updatedAt || new Date().toISOString(),
      syncedPaths: Array.isArray(manifest.syncedPaths) ? manifest.syncedPaths : [],
    };
  } catch {
    return createEmptyManifest();
  }
}

async function saveManifest(
  config: NonNullable<ReturnType<typeof getSupabaseStorageConfig>>,
  manifest: DriveSyncManifest
) {
  await uploadSupabaseObject({
    config,
    objectPath: MANIFEST_PATH,
    body: JSON.stringify(manifest),
    contentType: "application/json",
    upsert: true,
  });
}

async function sendPhotosToDrive(
  appsScriptUrl: string,
  payload: {
    guestName: string;
    photos: Array<{
      fileName: string;
      mimeType: string;
      data: string;
    }>;
  }
) {
  const response = await fetch(appsScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "photoUpload",
      ...payload,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  const data = safeParseJson(rawText);

  if (!response.ok) {
    throw new Error(data?.message || rawText.slice(0, 180) || "Falha no Apps Script.");
  }

  if (!data) {
    throw new Error(rawText.slice(0, 180) || "Resposta inválida do Apps Script.");
  }

  return data;
}

function isAuthorized(request: Request) {
  const secret = process.env.PHOTOS_SYNC_SECRET || process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const authorization = request.headers.get("authorization");
  const url = new URL(request.url);

  return authorization === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

function createEmptyManifest(): DriveSyncManifest {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    syncedPaths: [],
  };
}

function isImageObject(object: SupabaseStoredObject) {
  return object.mimeType.startsWith("image/");
}

function getBatchSize() {
  const parsed = Number(process.env.PHOTOS_DRIVE_SYNC_BATCH_SIZE || DEFAULT_BATCH_SIZE);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_BATCH_SIZE;
  }

  return Math.max(1, Math.min(MAX_BATCH_SIZE, Math.floor(parsed)));
}

function getDriveFileName(path: string) {
  return path.replace(/\//g, "-") || "foto.jpg";
}

function normalizeMimeType(primaryMimeType: string, fallbackMimeType: string) {
  if (primaryMimeType.startsWith("image/")) {
    return primaryMimeType;
  }

  if (fallbackMimeType.startsWith("image/")) {
    return fallbackMimeType;
  }

  return "image/jpeg";
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as AppsScriptResponse;
  } catch {
    return null;
  }
}
