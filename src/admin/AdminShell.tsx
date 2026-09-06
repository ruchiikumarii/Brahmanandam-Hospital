import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
} from "lucide-react";
import { currentUser, onAuthChange, signOut } from "@/lib/cms/admin-api";
import { cmsConfigured } from "@/lib/cms/supabase";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/blogs", label: "Blogs", icon: FileText, end: false },
  { to: "/admin/media", label: "Media", icon: ImageIcon, end: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, end: false },
];

export function useAuth() {
  const [state, setState] = useState<{ loading: boolean; email: string | null }>({
    loading: true,
    email: null,
  });

  useEffect(() => {
    let alive = true;
    const sync = () =>
      currentUser().then((u) => {
        if (alive) setState({ loading: false, email: u?.email ?? null });
      });
    sync();
    const off = onAuthChange(sync);
    return () => {
      alive = false;
      off();
    };
  }, []);

  return state;
}

function NotConfigured() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-lg font-bold text-slate-900">CMS not configured</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Set <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="rounded bg-slate-100 px-1">
            VITE_SUPABASE_PUBLISHABLE_KEY
          </code>{" "}
          in your env, then restart. The public site keeps working without them.
        </p>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, email } = useAuth();
  const loc = useLocation();

  if (!cmsConfigured) return <NotConfigured />;
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }
  if (!email) {
    return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  }
  return <>{children}</>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { email } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-[0.9375rem] font-bold">
              Brahmanandam <span className="text-slate-400">CMS</span>
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {NAV.map((n) => {
                const active = n.end
                  ? pathname === n.to
                  : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[0.8125rem] font-semibold ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <n.icon size={14} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden text-[0.75rem] font-semibold text-slate-500 hover:text-slate-900 md:inline"
            >
              View site
            </a>
            <span className="hidden text-[0.75rem] text-slate-500 lg:inline">
              {email}
            </span>
            <button
              type="button"
              onClick={() =>
                signOut().then(() => {
                  window.location.href = "/admin/login";
                })
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[0.75rem] font-semibold hover:bg-slate-100"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-slate-200 px-4 py-2 sm:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[0.8125rem] font-semibold text-slate-600 hover:bg-slate-100"
            >
              <n.icon size={14} />
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
    </div>
  );
}
