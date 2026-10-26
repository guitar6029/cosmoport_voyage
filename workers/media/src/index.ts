export interface Env {
  MEDIA_BUCKET: R2Bucket;
  MEDIA_DELIVERY_ENABLED?: string;
}

const ALLOW_HEADER = "GET, HEAD";
const PUBLIC_MEDIA_PREFIXES = ["astro-pop/"];
const MEDIA_TYPES: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
  mp4: "video/mp4", mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
};

type ByteRange = { offset: number; length: number };

function responseFor(request: Request, body: BodyInit | null, init: ResponseInit): Response {
  return new Response(request.method === "HEAD" ? null : body, init);
}

function hasEncodedSeparator(value: string): boolean {
  return /%(?:2f|5c)/i.test(value);
}

function mediaKey(url: URL): string | null {
  const rawKey = url.pathname.slice(1);
  if (!rawKey || rawKey.includes("\0") || hasEncodedSeparator(rawKey)) return null;

  let key: string;
  try { key = decodeURIComponent(rawKey); } catch { return null; }
  if (
    !key || key.includes("\0") || key.includes("\\") || hasEncodedSeparator(key) ||
    /[\u0000-\u001f\u007f]/.test(key) || key.split("/").some((part) => !part || part === "." || part === "..")
  ) return null;

  if (!PUBLIC_MEDIA_PREFIXES.some((prefix) => key.startsWith(prefix))) return "";
  const extension = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return Object.hasOwn(MEDIA_TYPES, extension) ? key : "";
}

function mediaType(key: string): string {
  return MEDIA_TYPES[key.slice(key.lastIndexOf(".") + 1).toLowerCase()];
}

function parseRange(rangeHeader: string, size: number): ByteRange | null {
  if (!rangeHeader.startsWith("bytes=") || rangeHeader.includes(",")) return null;
  const match = /^(\d*)-(\d*)$/.exec(rangeHeader.slice("bytes=".length).trim());
  if (!match || (!match[1] && !match[2])) return null;
  if (match[1]) {
    const offset = Number(match[1]);
    const end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(end) || offset > end || offset >= size) return null;
    return { offset, length: Math.min(end, size - 1) - offset + 1 };
  }
  const suffix = Number(match[2]);
  if (!Number.isSafeInteger(suffix) || suffix <= 0 || size === 0) return null;
  const length = Math.min(suffix, size);
  return { offset: size - length, length };
}

function mediaHeaders(object: R2Object, key: string, length: number): Headers {
  return new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=300, must-revalidate",
    "Content-Length": String(length),
    "Content-Type": mediaType(key),
    ETag: object.httpEtag,
    "X-Content-Type-Options": "nosniff",
  });
}

function unavailable(request: Request): Response {
  return responseFor(request, "Media delivery is unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
}
function invalidPath(request: Request): Response { return responseFor(request, "Invalid media path", { status: 400 }); }
function notFound(request: Request): Response { return responseFor(request, "Not found", { status: 404 }); }
function rangeNotSatisfiable(request: Request, size: number): Response {
  return responseFor(request, "Range not satisfiable", { status: 416, headers: { "Content-Range": `bytes */${size}` } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: ALLOW_HEADER } });
    }
    if (env.MEDIA_DELIVERY_ENABLED !== "true") return unavailable(request);

    const key = mediaKey(new URL(request.url));
    if (key === null) return invalidPath(request);
    if (!key) return notFound(request);

    try {
      if (request.method === "HEAD") {
        const object = await env.MEDIA_BUCKET.head(key);
        return object ? responseFor(request, null, { headers: mediaHeaders(object, key, object.size) }) : notFound(request);
      }
      const rangeHeader = request.headers.get("Range");
      if (rangeHeader) {
        const objectMetadata = await env.MEDIA_BUCKET.head(key);
        if (!objectMetadata) return notFound(request);
        const range = parseRange(rangeHeader, objectMetadata.size);
        if (!range) return rangeNotSatisfiable(request, objectMetadata.size);
        const object = await env.MEDIA_BUCKET.get(key, { range });
        if (!object) return notFound(request);
        const headers = mediaHeaders(object, key, range.length);
        headers.set("Content-Range", `bytes ${range.offset}-${range.offset + range.length - 1}/${objectMetadata.size}`);
        return new Response(object.body, { status: 206, headers });
      }
      const object = await env.MEDIA_BUCKET.get(key);
      return object ? new Response(object.body, { headers: mediaHeaders(object, key, object.size) }) : notFound(request);
    } catch {
      return responseFor(request, "Media delivery failed", { status: 502, headers: { "Cache-Control": "no-store" } });
    }
  },
} satisfies ExportedHandler<Env>;
