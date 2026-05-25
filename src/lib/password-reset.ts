import bcrypt from "bcryptjs";
import { getSupabase } from "./supabase";
import * as store from "./store";
import { hashPassword } from "./auth";

export async function findAccountByEmail(email: string): Promise<{ email: string } | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return null;

  if (store.useLocalDb()) {
    const user = await store.findUserByEmail(normalized);
    return user ? { email: user.email } : null;
  }

  const { data, error } = await getSupabase()
    .from("users")
    .select("email")
    .eq("email", normalized)
    .maybeSingle();
  if (error || !data) return null;
  return { email: data.email as string };
}

export async function setPasswordByEmail(email: string, newPassword: string) {
  const normalized = email.trim().toLowerCase();
  if (store.useLocalDb()) {
    return store.resetPasswordByEmail(normalized, newPassword);
  }
  const hash = await hashPassword(newPassword);
  const { data, error } = await getSupabase()
    .from("users")
    .update({ password_hash: hash })
    .eq("email", normalized)
    .select("email")
    .maybeSingle();
  if (error || !data) return { error: "لم نعثر على حساب بهذا البريد" };
  return { success: true, email: data.email as string };
}
