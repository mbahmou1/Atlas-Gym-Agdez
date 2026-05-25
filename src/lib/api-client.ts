export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getErrorMessage(
  err: unknown,
  fallback = "وقع خطأ"
): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

async function parseJsonBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    const data = JSON.parse(text);
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Fetch JSON API routes; throws ApiError when !res.ok or network fails. */
export async function apiJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { credentials: "include", ...init });
  } catch {
    throw new ApiError(
      "ما قدرناش نوصلو للسيرفر. تأكد أن npm run dev خدام، و عاود شغّل المشروع."
    );
  }

  const data = await parseJsonBody(res);
  if (!res.ok) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : res.status === 401
          ? "انتهت الجلسة. سجّل الدخول من جديد."
          : res.status === 500
            ? "خطأ ف السيرفر. أوقف npm run dev، احذف مجلد .next، و عاود شغّل."
            : `خطأ (${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return data as T;
}
