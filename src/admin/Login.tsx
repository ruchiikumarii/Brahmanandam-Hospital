import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { signIn } from "@/lib/cms/admin-api";
import { cmsConfigured } from "@/lib/cms/supabase";
import { useAuth } from "./AdminShell";

export default function Login() {
  const { loading, email: signedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && signedIn) return <Navigate to="/admin/blogs" replace />;

  /*
   * Supabase reports a blocked network and a wrong password through the same
   * `error.message` channel, and its wording ("Failed to fetch") tells you
   * nothing about which one you hit. Say which, so the fix is obvious.
   */
  const explain = (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    if (/failed to fetch|networkerror|load failed|timed? ?out/i.test(message))
      return "Could not reach the server. Check your internet connection, then try again.";
    if (/invalid login credentials/i.test(message))
      return "That email and password do not match an account.";
    if (/email not confirmed/i.test(message))
      return "This account still needs its email confirmed in Supabase before it can sign in.";
    return message || "Sign-in failed";
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Without a deadline a blocked network leaves the button spinning
      // indefinitely, which reads as the form being broken.
      await Promise.race([
        signIn(email.trim(), password),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timed out")), 20000),
        ),
      ]);
      window.location.href = "/admin/blogs";
    } catch (err) {
      setError(explain(err));
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
        <div className="relative">
          <input
            id="admin-pass"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${field} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
            aria-controls="admin-pass"
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1.5 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>

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
