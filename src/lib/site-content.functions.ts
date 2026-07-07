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

const heroSchema = z.object({
  kicker: z.string().max(200),
  title1: z.string().max(200),
  titleHighlight: z.string().max(200),
  tagline: z.string().max(300),
  subtitle: z.string().max(1000),
});

const aboutSchema = z.object({
  title: z.string().max(300),
  body: z.string().max(3000),
  goals: z.string().max(2000),
  ambition: z.string().max(2000),
});

const contactSchema = z.object({
  phone: z.string().max(50),
  email: z.string().max(200),
  address: z.string().max(300),
  instagram: z.string().max(500),
  facebook: z.string().max(500),
  linkedin: z.string().max(500),
  behance: z.string().max(500),
});

const statSchema = z.object({
  value: z.string().max(50),
  label: z.string().max(200),
  hint: z.string().max(500).optional(),
});

const serviceSchema = z.object({
  title: z.string().max(200),
  desc: z.string().max(1000),
});

const portfolioItemSchema = z.object({
  image: z.string().max(2000),
  title: z.string().max(300),
  category: z.enum(["film", "documentary", "ads"]),
  behance: z.string().max(500),
});

const clientSchema = z.object({
  name: z.string().max(200),
  image: z.string().max(2000),
});

const siteContentSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  stats: z.array(statSchema).max(20),
  contact: contactSchema,
  showreelUrl: z.string().max(500),
  services: z.array(serviceSchema).max(30),
  portfolio: z.array(portfolioItemSchema).max(200),
  clients: z.array(clientSchema).max(200),
});

const updateSchema = z.object({
  token: z.string().min(10).max(200),
  data: siteContentSchema,
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
