// ---- helpers: parse query types safely ----
export function qs(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
export function qn(v: unknown): number | undefined {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function qenum<T extends string>(
  v: unknown,
  allowed: readonly T[]
): T | undefined {
  const s = qs(v);
  return s && (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
}
export function qorder(v: unknown): "asc" | "desc" | undefined {
  const s = qs(v)?.toLowerCase();
  return s === "asc" || s === "desc" ? s : undefined;
}
