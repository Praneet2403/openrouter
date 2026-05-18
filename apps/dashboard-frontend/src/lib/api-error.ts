export function apiErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const raw = (data as { message?: unknown }).message;
    if (typeof raw === "string") return raw;
  }
  return fallback;
}
