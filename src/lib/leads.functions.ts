import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(3000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const applicationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  start_when: z.string().trim().max(200).optional().or(z.literal("")),
  portfolio_url: z.string().trim().max(500).optional().or(z.literal("")),
  why: z.string().trim().max(3000).optional().or(z.literal("")),
  skills: z.string().trim().max(3000).optional().or(z.literal("")),
  edge: z.string().trim().max(3000).optional().or(z.literal("")),
});

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((input) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("job_applications").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const tokenSchema = z.object({ token: z.string().min(10).max(200) });

async function requireAdmin(token: string) {
  const { data } = await supabaseAdmin
    .from("admin_sessions")
    .select("expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!data) throw new Error("Unauthorized");
  if (new Date(data.expires_at).getTime() < Date.now()) throw new Error("Session expired");
}

export const listContactMessages = createServerFn({ method: "POST" })
  .inputValidator((input) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { data: rows, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const listJobApplications = createServerFn({ method: "POST" })
  .inputValidator((input) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { data: rows, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });
