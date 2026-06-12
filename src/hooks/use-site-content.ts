import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, type SiteContent } from "@/data/site";

const KEY = ["site-content"];
const LS_KEY = "faii_site_content_cache_v1";

function mergeContent(remote: Partial<SiteContent> | null | undefined): SiteContent {
  if (!remote) return defaultContent;
  return {
    hero: { ...defaultContent.hero, ...(remote.hero ?? {}) },
    about: { ...defaultContent.about, ...(remote.about ?? {}) },
    contact: { ...defaultContent.contact, ...(remote.contact ?? {}) },
    showreelUrl: remote.showreelUrl || defaultContent.showreelUrl,
    stats: remote.stats?.length ? remote.stats : defaultContent.stats,
    services: remote.services?.length ? remote.services : defaultContent.services,
    portfolio: remote.portfolio?.length ? remote.portfolio : defaultContent.portfolio,
    clients: remote.clients?.length ? remote.clients : defaultContent.clients,
  };
}

function readCache(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return null;
  }
}

function writeCache(c: SiteContent) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(c)); } catch { /* noop */ }
}

async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("[site-content] fetch error", error);
    return readCache() ?? defaultContent;
  }
  const merged = mergeContent(data?.data as Partial<SiteContent> | null);
  writeCache(merged);
  return merged;
}

export function useSiteContent(): SiteContent {
  const qc = useQueryClient();
  const initial = readCache() ?? defaultContent;
  const { data } = useQuery({
    queryKey: KEY,
    queryFn: fetchSiteContent,
    staleTime: 10_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    placeholderData: initial,
    initialData: typeof window !== "undefined" ? (readCache() ?? undefined) : undefined,
    initialDataUpdatedAt: 0,
  });


  useEffect(() => {
    const channel = supabase
      .channel(`site-content-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => qc.invalidateQueries({ queryKey: KEY }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return data ?? defaultContent;
}
