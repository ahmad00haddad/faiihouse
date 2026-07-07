import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time string comparison to avoid leaking secrets via timing.
function timingSafeEqualStr(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const av = enc.encode(a);
  const bv = enc.encode(b);
  const len = Math.max(av.length, bv.length);
  let diff = av.length ^ bv.length;
  for (let i = 0; i < len; i++) {
    diff |= (av[i] ?? 0) ^ (bv[i] ?? 0);
  }
  return diff === 0;
}

const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(200),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) {
      // Fail closed — never allow login with a default/empty password.
      throw new Error("لم يتم إعداد بيانات الادمن على الخادم");
    }
    const userOk = timingSafeEqualStr(data.username, expectedUser);
    const passOk = timingSafeEqualStr(data.password, expectedPass);
    if (!userOk || !passOk) {
      throw new Error("بيانات الدخول غير صحيحة");
    }
    const token = randomToken();
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
    const { error } = await supabaseAdmin
      .from("admin_sessions")
      .insert({ token, expires_at });
    if (error) throw new Error(error.message);
    // Best-effort cleanup
    await supabaseAdmin.from("admin_sessions").delete().lt("expires_at", new Date().toISOString());
    return { token, expires_at };
  });

const tokenSchema = z.object({ token: z.string().min(10).max(200) });

export const adminVerify = createServerFn({ method: "POST" })
  .inputValidator((input) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAdmin
      .from("admin_sessions")
      .select("expires_at")
      .eq("token", data.token)
      .maybeSingle();
    if (!row) return { valid: false };
    if (new Date(row.expires_at).getTime() < Date.now()) return { valid: false };
    return { valid: true };
  });

export const adminLogout = createServerFn({ method: "POST" })
  .inputValidator((input) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("admin_sessions").delete().eq("token", data.token);
    return { ok: true };
  });
