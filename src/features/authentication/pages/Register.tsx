import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "@/shared/context/AuthContext";
import { AuthShell, AuthField } from "../components/AuthShell";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const { isAuthenticated } = useAuth();
  const reduce = useReducedMotion();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });
      // The new account is logged in immediately; reload so AuthContext
      // re-reads the session cookies and routes into the empty workspace.
      window.location.assign("/");
    } catch (err) {
      setError("Sign up failed. Please check your details and try again.");
    }
  };

  const pending = registerMutation.isPending;

  return (
    <AuthShell
      lines={["Plan.", "Build.", "Manage."]}
      blurb="Set up your workspace and start with the project you are running this week — projects, workforce, payroll and costs in one place."
    >
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to home
      </Link>

      <h1 className="display-tight text-[1.75rem] font-extrabold text-ink-900">
        Create your workspace
      </h1>
      <p className="mt-2 text-[14px] text-slate-500">
        A few details and you are in.
      </p>

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            role="alert"
            initial={reduce ? false : { opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3">
              <AlertCircle className="mt-px h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <p className="text-[13px] leading-relaxed text-rose-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <AuthField
          id="full_name"
          label="Full name"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
          placeholder="Your name"
          disabled={pending}
          required
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@company.com"
          disabled={pending}
          required
        />

        <AuthField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use at least 8 characters."
          disabled={pending}
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="rounded-md p-1 text-slate-400 transition-colors hover:text-ink-900"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          }
        />

        <AuthField
          id="confirm_password"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Repeat your password"
          disabled={pending}
          required
        />

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 text-[15px] font-bold text-ink-900 transition-all duration-200 ease-out hover:bg-amber-400 hover:shadow-[0_8px_20px_-8px_rgba(245,158,11,.8)] active:translate-y-px disabled:pointer-events-none disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[13.5px] text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-ink-900 underline decoration-amber-400 decoration-2 underline-offset-4 transition-colors hover:text-amber-600"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
