import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getSupabase } from "./supabase";
import * as store from "./store";
import type { User } from "./types";

const COOKIE_NAME = "atlasgym_session";

/** على HTTP (localhost / IP الشبكة) لا نستعمل Secure وإلا ما كيتسجّلش الدخول */
function shouldUseSecureSessionCookie(): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.VERCEL === "1";
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET must be at least 16 characters");
  return new TextEncoder().encode(secret);
}

export async function createSession(user: User) {
  const token = await new SignJWT({ id: user.id, email: user.email, name: user.name, phone: user.phone ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: shouldUseSecureSessionCookie(),
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      phone: (payload.phone as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export async function verifyLogin(email: string, password: string): Promise<User | null> {
  if (store.useLocalDb()) return store.verifyLogin(email, password);
  const identifier = email.trim().toLowerCase();
  const normalizedPhone = identifier.replace(/\D/g, "");
  const supabase = getSupabase();
  const byEmail = identifier.includes("@");
  let query = supabase.from("users").select("id, email, name, phone, password_hash");
  query = byEmail ? query.eq("email", identifier) : query.eq("phone", normalizedPhone);
  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  if (!(await bcrypt.compare(password, data.password_hash))) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    phone: (data.phone as string | null) ?? null,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
