import env from "../config/env";

/** Shape for query params */
type Query = Record<
  string,
  string | number | boolean | string[] | undefined | null
>;
/** Custom typed error for HTTP failures */
export class HttpError extends Error {
  status: number;
  url: string;
  body?: unknown;

  constructor(status: number, message: string, url: string, body?: unknown) {
    super(message);
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

/**
 * Build a full URL using:
 * - base URL from env (TVmaze)
 * - path (e.g. "/shows")
 * - query params (e.g. { page: 1 })
 */
function buildUrl(path: string, params?: Query): string {
  const base = env.TVMAZE_BASE_URL.endsWith("/")
    ? env.TVMAZE_BASE_URL.slice(0, -1)
    : env.TVMAZE_BASE_URL;

  const fullUrl = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  const url = new URL(fullUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(key, String(v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Safely reads the body:
 * - If JSON → returns parsed JSON
 * - If text → returns string
 * - If fails → returns undefined
 */
async function readBodySafe(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      return await res.json();
    }

    const text = await res.text();
    return text || undefined;
  } catch (error) {
    console.error("Error reading body:", error);
    return undefined;
  }
}

/**
 * Main GET wrapper with:
 * - base URL
 * - query params
 * - timeout (AbortController)
 * - safe JSON/text parsing
 * - structured HttpError on failure
 */
export async function httpGet<T>(
  path: string,
  options?: {
    params?: Query;
    timeoutMs?: number;
  }
): Promise<T> {
  const { params, timeoutMs = 8000 } = options || {};

  const url = buildUrl(path, params);

  // Timeout controller
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    const body = await readBodySafe(res);

    // If request failed → throw HttpError with body info
    if (!res.ok) {
      const message =
        typeof body === "string"
          ? body
          : (body as any)?.message ||
            `Request failed with status ${res.status}`;

      throw new HttpError(res.status, message, url, body);
    }

    // Successful → return parsed body as T
    return body as T;
  } catch (err: any) {
    // Timeout → treat as 504
    if (err?.name === "AbortError") {
      throw new HttpError(504, "Request timed out", url);
    }

    // If custom HttpError → rethrow
    if (err instanceof HttpError) throw err;

    // Unknown fetch/network errors
    throw new HttpError(500, err?.message || "Network error", url);
  } finally {
    clearTimeout(timer);
  }
}
