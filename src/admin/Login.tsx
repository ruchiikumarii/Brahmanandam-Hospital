import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { signIn } from "@/lib/cms/admin-api";
import { cmsConfigured } from "@/lib/cms/supabase";
import { useAuth } from "./AdminShell";

export default function Login() {
  const { loading, email: signedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && signedIn) return <Navigate to="/admin/blogs" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      window.location.href = "/admin/blogs";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900";

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white">
          <Lock size={19} />
        </span>
        <h1 className="mt-5 text-xl font-bold">Brahmanandam CMS</h1>
        <p className="mt-1 text-[0.8125rem] text-slate-500">
          Sign in to manage the health blog.
        </p>

        {!cmsConfigured ? (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[0.8125rem] text-amber-800">
            Supabase environment variables are not set — see the README.
          </p>
        ) : null}

        <label htmlFor="admin-email" className="mt-6 block text-[0.8125rem] font-semibold">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />

        <label htmlFor="admin-pass" className="mt-4 block text-[0.8125rem] font-semibold">
          Password
        </label>
        <input
          id="admin-pass"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />

        {error ? (
          <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-[0.8125rem] text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !cmsConfigured}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Sign in
        </button>
      </form>
    </div>
  );
}
