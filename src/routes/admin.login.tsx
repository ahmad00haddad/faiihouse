import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminLogin } from "@/lib/admin-auth.functions";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({ meta: [{ title: "Faii House — تسجيل دخول الادمن" }] }),
});

function AdminLoginPage() {
  const login = useServerFn(adminLogin);
  const navigate = useNavigate();
  const [username, setU] = useState("admin");
  const [password, setP] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ data: { username: username.trim(), password } });
      localStorage.setItem("faii_admin_token", res.token);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-3 text-primary">
          <Lock size={24} />
          <h1 className="text-2xl font-display">لوحة تحكم فَيّ هاوس</h1>
        </div>
        <p className="text-muted-foreground text-sm">سجّل دخولك للتحكم بمحتوى الموقع.</p>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">اسم المستخدم</label>
          <input value={username} onChange={(e) => setU(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">كلمة المرور</label>
          <input type="password" required value={password} onChange={(e) => setP(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary" />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <button disabled={loading} className="w-full bg-gradient-primary text-primary-foreground rounded-lg py-3 font-medium hover:shadow-glow transition-all disabled:opacity-60">
          {loading ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
