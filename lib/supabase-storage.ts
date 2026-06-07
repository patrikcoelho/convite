export type SupabaseStorageConfig = {
  supabaseUrl: string;
  serviceRoleKey: string;
  bucket: string;
};

export type SupabaseStoredObject = {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  updatedAt: string | null;
};

type SupabaseStorageItem = {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  metadata?: {
    mimetype?: string;
    size?: number;
  } | null;
};

type SupabaseError = {
  message?: string;
  error?: string;
};

export function getSupabaseStorageConfig(): SupabaseStorageConfig | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_PHOTOS_BUCKET || "wedding-photos";

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    return null;
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
    bucket,
  };
}

export async function uploadSupabaseObject({
  config,
  objectPath,
  body,
  contentType,
  upsert = false,
}: {
  config: SupabaseStorageConfig;
  objectPath: string;
  body: BodyInit;
  contentType: string;
  upsert?: boolean;
}) {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${encodePath(config.bucket)}/${encodePath(
      objectPath
    )}`,
    {
      method: "POST",
      headers: supabaseHeaders(config, {
        "Content-Type": contentType,
        "x-upsert": String(upsert),
      }),
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await readSupabaseError(response, "Falha ao salvar arquivo no Supabase."));
  }
}

export async function downloadSupabaseObject(config: SupabaseStorageConfig, objectPath: string) {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${encodePath(config.bucket)}/${encodePath(
      objectPath
    )}`,
    {
      headers: supabaseHeaders(config),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await readSupabaseError(response, "Falha ao baixar arquivo do Supabase."));
  }

  return {
    contentType: response.headers.get("content-type") || "application/octet-stream",
    buffer: Buffer.from(await response.arrayBuffer()),
  };
}

export async function tryDownloadSupabaseObject(
  config: SupabaseStorageConfig,
  objectPath: string
) {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${encodePath(config.bucket)}/${encodePath(
      objectPath
    )}`,
    {
      headers: supabaseHeaders(config),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readSupabaseError(response, "Falha ao baixar arquivo do Supabase."));
  }

  return {
    contentType: response.headers.get("content-type") || "application/octet-stream",
    buffer: Buffer.from(await response.arrayBuffer()),
  };
}

export async function listSupabaseObjects(config: SupabaseStorageConfig, prefix = "") {
  const objects: SupabaseStoredObject[] = [];
  const normalizedPrefix = trimSlashes(prefix);

  await collectSupabaseObjects(config, normalizedPrefix, objects);

  return objects;
}

async function collectSupabaseObjects(
  config: SupabaseStorageConfig,
  prefix: string,
  objects: SupabaseStoredObject[]
) {
  const limit = 100;
  let offset = 0;

  while (true) {
    const response = await fetch(
      `${config.supabaseUrl}/storage/v1/object/list/${encodePath(config.bucket)}`,
      {
        method: "POST",
        headers: supabaseHeaders(config, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          prefix,
          limit,
          offset,
          sortBy: {
            column: "name",
            order: "asc",
          },
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(await readSupabaseError(response, "Falha ao listar fotos no Supabase."));
    }

    const items = (await response.json()) as SupabaseStorageItem[];

    if (!items.length) {
      return;
    }

    for (const item of items) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (itemPath.startsWith(".sync/")) {
        continue;
      }

      if (isFile(item)) {
        objects.push({
          name: item.name,
          path: itemPath,
          size: item.metadata?.size || 0,
          mimeType: item.metadata?.mimetype || "application/octet-stream",
          updatedAt: item.updated_at || null,
        });
      } else {
        await collectSupabaseObjects(config, itemPath, objects);
      }
    }

    if (items.length < limit) {
      return;
    }

    offset += limit;
  }
}

function isFile(item: SupabaseStorageItem) {
  return Boolean(item.id || item.metadata?.size || item.metadata?.mimetype);
}

function supabaseHeaders(
  config: SupabaseStorageConfig,
  extraHeaders?: Record<string, string>
) {
  return {
    Authorization: `Bearer ${config.serviceRoleKey}`,
    apikey: config.serviceRoleKey,
    ...extraHeaders,
  };
}

async function readSupabaseError(response: Response, fallback: string) {
  const rawText = await response.text();
  const data = safeParseJson(rawText);

  return data?.message || data?.error || rawText.slice(0, 180) || fallback;
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as SupabaseError;
  } catch {
    return null;
  }
}

function encodePath(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}
