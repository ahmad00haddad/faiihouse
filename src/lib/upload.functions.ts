import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(10).max(200),
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  base64: z.string().min(1),
});

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
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

    const buf = Buffer.from(data.base64, "base64");
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const { error } = await supabaseAdmin.storage
      .from("site-images")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    const { data: pub } = supabaseAdmin.storage.from("site-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });
