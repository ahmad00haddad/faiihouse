import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, type SiteContent } from "@/data/site";

const KEY = ["site-content"];

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

async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("[site-content] fetch error", error);
    return defaultContent;
  }
  return mergeContent(data?.data as Partial<SiteContent> | null);
}

export function useSiteContent(): SiteContent {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: KEY,
    queryFn: fetchSiteContent,
    staleTime: 10_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    placeholderData: defaultContent,
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
