import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("data, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("getSiteContent error", error);
    return { data: null, updated_at: null };
  }
  return {
    data: (data?.data ?? null) as Json | null,
    updated_at: data?.updated_at ?? null,
  };
});

const updateSchema = z.object({
  token: z.string().min(10).max(200),
  data: z.any(),
});

export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: session, error: sErr } = await supabaseAdmin
      .from("admin_sessions")
      .select("expires_at")
      .eq("token", data.token)
      .maybeSingle();
    if (sErr || !session) throw new Error("Unauthorized");
    if (new Date(session.expires_at).getTime() < Date.now()) {
      throw new Error("Session expired");
    }

    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, data: data.data as Json, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
