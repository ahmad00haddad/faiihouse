// Older saved content may reference hashed build asset paths like
// "/assets/port-film1-BxoW5Po0.webp" which break after a new build.
// Map them back to the current bundled asset by base file name.

const modules = import.meta.glob<string>("@/assets/faii/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const byBaseName = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const file = path.split("/").pop();
  if (file) byBaseName.set(file, url as string);
}

const HASHED = /^\/assets\/(.+)-[A-Za-z0-9_-]{6,}\.(webp|png|jpg|jpeg|svg|avif)$/;

export function resolveAsset(src: string): string {
  if (!src) return src;
  const m = HASHED.exec(src);
  if (!m) return src;
  return byBaseName.get(`${m[1]}.${m[2]}`) ?? src;
}
