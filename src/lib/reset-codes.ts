import { randomInt } from "crypto";

const TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type PendingReset = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const pending = new Map<string, PendingReset>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createResetCode(email: string): string {
  const key = normalizeEmail(email);
  const code = String(randomInt(100000, 999999));
  pending.set(key, {
    code,
    expiresAt: Date.now() + TTL_MS,
    attempts: 0,
  });
  return code;
}

export function verifyResetCode(email: string, code: string): { ok: true } | { ok: false; error: string } {
  const key = normalizeEmail(email);
  const entry = pending.get(key);
  if (!entry) return { ok: false, error: "لم يُطلب رمز لهذا البريد. اطلب رمزاً جديداً." };
  if (Date.now() > entry.expiresAt) {
    pending.delete(key);
    return { ok: false, error: "انتهت صلاحية الرمز. اطلب رمزاً جديداً." };
  }
  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    pending.delete(key);
    return { ok: false, error: "محاولات كثيرة. اطلب رمزاً جديداً." };
  }
  if (entry.code !== code.trim()) {
    return { ok: false, error: "الرمز غير صحيح" };
  }
  pending.delete(key);
  return { ok: true };
}
