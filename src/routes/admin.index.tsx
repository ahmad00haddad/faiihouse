import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminVerify, adminLogout } from "@/lib/admin-auth.functions";
import { listContactMessages, listJobApplications } from "@/lib/leads.functions";
import { getSiteContent, updateSiteContent } from "@/lib/site-content.functions";
import { uploadImage } from "@/lib/upload.functions";
import { defaultContent, type SiteContent } from "@/data/site";
import { LogOut, Save, Plus, Trash2, Upload, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Faii House — لوحة التحكم" }] }),
});

type Tab = "hero" | "about" | "stats" | "contact" | "services" | "portfolio" | "clients" | "leads";

function AdminPage() {
  const verify = useServerFn(adminVerify);
  const logout = useServerFn(adminLogout);
  const fetchContent = useServerFn(getSiteContent);
  const saveContent = useServerFn(updateSiteContent);
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [tab, setTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("faii_admin_token") : null), []);

  const mergeFromDb = (remote: Partial<SiteContent> | null | undefined): SiteContent => {
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
  };

  useEffect(() => {
    (async () => {
      if (!token) { navigate({ to: "/admin/login" }); return; }
      const v = await verify({ data: { token } });
      if (!v.valid) { localStorage.removeItem("faii_admin_token"); navigate({ to: "/admin/login" }); return; }
      const c = await fetchContent();
      setContent(mergeFromDb(c.data as Partial<SiteContent> | null));
      setReady(true);
    })();
  }, []);


  const onSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await saveContent({ data: { token, data: content } });
      // Re-fetch from DB to confirm persistence and reflect source of truth
      const c = await fetchContent();
      setContent(mergeFromDb(c.data as Partial<SiteContent> | null));
      setSavedAt(new Date().toLocaleTimeString("ar"));

    } catch (e) {
      alert(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };


  const onLogout = async () => {
    if (token) await logout({ data: { token } });
    localStorage.removeItem("faii_admin_token");
    navigate({ to: "/admin/login" });
  };

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل...</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "الهيرو" },
    { id: "about", label: "عن فَيّ" },
    { id: "stats", label: "الإحصائيات" },
    { id: "contact", label: "التواصل" },
    { id: "services", label: "الخدمات" },
    { id: "portfolio", label: "المشاريع" },
    { id: "clients", label: "الشركاء" },
    { id: "leads", label: "الرسائل والطلبات" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl text-primary">لوحة فَيّ هاوس</h1>
          <div className="flex items-center gap-3">
            {savedAt && <span className="text-xs text-muted-foreground">تم الحفظ {savedAt}</span>}
            <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm disabled:opacity-60">
              <Save size={16} /> {saving ? "..." : "حفظ"}
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        {tab === "hero" && <HeroEditor content={content} setContent={setContent} />}
        {tab === "about" && <AboutEditor content={content} setContent={setContent} />}
        {tab === "stats" && <ListEditor items={content.stats} setItems={(stats) => setContent({ ...content, stats })} fields={[{ k: "value", l: "القيمة" }, { k: "label", l: "الوصف" }, { k: "hint", l: "السياق (سطر تفسيري صغير)" }]} blank={{ value: "", label: "", hint: "" }} />}
        {tab === "contact" && <ContactEditor content={content} setContent={setContent} />}
        {tab === "services" && <ListEditor items={content.services} setItems={(services) => setContent({ ...content, services })} fields={[{ k: "title", l: "العنوان" }, { k: "desc", l: "الوصف", textarea: true }]} blank={{ title: "", desc: "" }} />}
        {tab === "portfolio" && <ListEditor items={content.portfolio} setItems={(portfolio) => setContent({ ...content, portfolio: portfolio as SiteContent["portfolio"] })} fields={[{ k: "title", l: "العنوان" }, { k: "image", l: "رابط الصورة" }, { k: "category", l: "التصنيف", options: [{ value: "film", label: "فيلم" }, { value: "documentary", label: "وثائقي" }, { value: "ads", label: "إعلان" }] }, { k: "behance", l: "رابط Behance" }]} blank={{ title: "", image: "", category: "film", behance: "" }} />}
        {tab === "clients" && <ListEditor items={content.clients} setItems={(clients) => setContent({ ...content, clients })} fields={[{ k: "name", l: "الاسم" }, { k: "image", l: "رابط اللوغو" }]} blank={{ name: "", image: "" }} />}
        {tab === "leads" && <LeadsPanel token={token} />}
      </main>
    </div>
  );
}

function Field({ label, value, onChange, textarea, options }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; options?: { value: string; label: string }[] }) {
  const isImage = /صورة|لوغو|logo|image|avatar/i.test(label);
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none focus:border-primary" />
      ) : (
        <div className="flex gap-2 items-stretch">
          <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-card border border-border rounded-lg px-3 py-2 outline-none focus:border-primary" />
          {isImage && <ImageUploadButton onUploaded={onChange} />}
        </div>
      )}
      {isImage && value && (
        <img src={value} alt="" className="mt-1 h-16 w-auto rounded border border-border object-cover" />
      )}
    </label>
  );
}

function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const upload = useServerFn(uploadImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const onPick = async (file: File) => {
    const token = localStorage.getItem("faii_admin_token");
    if (!token) return;
    if (file.size > 8 * 1024 * 1024) { alert("الحد الأقصى 8MB"); return; }
    setBusy(true);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      const base64 = btoa(bin);
      const res = await upload({ data: { token, filename: file.name, contentType: file.type || "image/jpeg", base64 } });
      onUploaded(res.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 rounded-lg border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-60">
        <Upload size={14} /> {busy ? "..." : "رفع"}
      </button>
    </>
  );
}

function HeroEditor({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const h = content.hero;
  const set = (p: Partial<SiteContent["hero"]>) => setContent({ ...content, hero: { ...h, ...p } });
  return (
    <div className="space-y-3 bg-card/40 border border-border rounded-xl p-5">
      <Field label="نص علوي صغير (Kicker)" value={h.kicker} onChange={(v) => set({ kicker: v })} />
      <Field label="السطر الأول" value={h.title1} onChange={(v) => set({ title1: v })} />
      <Field label="الكلمة المُبرَزة" value={h.titleHighlight} onChange={(v) => set({ titleHighlight: v })} />
      <Field label="السطر الثاني (التاغ لاين)" value={h.tagline ?? ""} onChange={(v) => set({ tagline: v })} />
      <Field label="الوصف" value={h.subtitle} onChange={(v) => set({ subtitle: v })} textarea />
      <Field label="رابط الشوريل (YouTube)" value={content.showreelUrl} onChange={(v) => setContent({ ...content, showreelUrl: v })} />
    </div>
  );
}

function AboutEditor({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const a = content.about;
  const set = (p: Partial<SiteContent["about"]>) => setContent({ ...content, about: { ...a, ...p } });
  return (
    <div className="space-y-3 bg-card/40 border border-border rounded-xl p-5">
      <Field label="العنوان" value={a.title} onChange={(v) => set({ title: v })} />
      <Field label="النبذة" value={a.body} onChange={(v) => set({ body: v })} textarea />
      <Field label="أهدافنا" value={a.goals} onChange={(v) => set({ goals: v })} textarea />
      <Field label="طموحنا" value={a.ambition} onChange={(v) => set({ ambition: v })} textarea />
    </div>
  );
}

function ContactEditor({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const c = content.contact;
  const set = (p: Partial<SiteContent["contact"]>) => setContent({ ...content, contact: { ...c, ...p } });
  return (
    <div className="grid md:grid-cols-2 gap-3 bg-card/40 border border-border rounded-xl p-5">
      <Field label="الهاتف" value={c.phone} onChange={(v) => set({ phone: v })} />
      <Field label="الإيميل" value={c.email} onChange={(v) => set({ email: v })} />
      <Field label="العنوان" value={c.address} onChange={(v) => set({ address: v })} />
      <Field label="Instagram" value={c.instagram} onChange={(v) => set({ instagram: v })} />
      <Field label="Facebook" value={c.facebook} onChange={(v) => set({ facebook: v })} />
      <Field label="LinkedIn" value={c.linkedin} onChange={(v) => set({ linkedin: v })} />
      <Field label="Behance" value={c.behance} onChange={(v) => set({ behance: v })} />
    </div>
  );
}

type FieldDef<T> = { k: keyof T & string; l: string; textarea?: boolean; options?: { value: string; label: string }[] };

function SortableRow<T extends Record<string, string>>({
  id, item, idx, fields, onChange, onRemove,
}: {
  id: string;
  item: T;
  idx: number;
  fields: FieldDef<T>[];
  onChange: (k: keyof T & string, v: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="bg-card/40 border border-border rounded-xl p-4 space-y-2 relative">
      <div className="flex items-center gap-2 mb-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="سحب لإعادة الترتيب"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary p-1.5 rounded hover:bg-primary/10 touch-none"
        >
          <GripVertical size={16} />
        </button>
        <span className="text-xs text-muted-foreground">#{idx + 1}</span>
        <button onClick={onRemove}
          className="ms-auto text-destructive/70 hover:text-destructive p-1.5 rounded hover:bg-destructive/10">
          <Trash2 size={16} />
        </button>
      </div>
      {fields.map((f) => (
        <Field key={f.k} label={f.l} value={String(item[f.k] ?? "")} textarea={f.textarea} options={f.options}
          onChange={(v) => onChange(f.k, v)} />
      ))}
    </div>
  );
}

function ListEditor<T extends Record<string, string>>({
  items, setItems, fields, blank,
}: {
  items: T[];
  setItems: (v: T[]) => void;
  fields: FieldDef<T>[];
  blank: T;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map((_, i) => `row-${i}`);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground px-1">اسحب من المقبض <GripVertical size={12} className="inline" /> لإعادة الترتيب، ثم اضغط "حفظ" أعلى الصفحة.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((it, idx) => (
            <SortableRow
              key={ids[idx]}
              id={ids[idx]}
              item={it}
              idx={idx}
              fields={fields}
              onChange={(k, v) => {
                const next = [...items];
                next[idx] = { ...next[idx], [k]: v };
                setItems(next);
              }}
              onRemove={() => setItems(items.filter((_, i) => i !== idx))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button onClick={() => setItems([...items, { ...blank }])}
        className="w-full border border-dashed border-border rounded-xl py-4 text-muted-foreground hover:text-primary hover:border-primary inline-flex items-center justify-center gap-2">
        <Plus size={16} /> إضافة عنصر
      </button>
    </div>
  );
}
