export interface Env {
  MEDIA_BUCKET: R2Bucket;
}

const NOT_FOUND = "Not found";
const METHOD_NOT_ALLOWED = "Method not allowed";

export default {
  fetch(request: Request, _env: Env): Response {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(METHOD_NOT_ALLOWED, {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    return new Response(request.method === "HEAD" ? null : NOT_FOUND, {
      status: 404,
    });
  },
} satisfies ExportedHandler<Env>;
