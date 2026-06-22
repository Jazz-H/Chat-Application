import { useState, type FormEvent } from "react";
import { auth } from "../firebase";
import Logo from "./Logo";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const buttonBase =
  "flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60";

const inputClass =
  "w-full rounded-xl bg-white/5 px-4 py-2.5 text-white placeholder-white/40 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-400";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const GuestIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
  </svg>
);

const eyeProps = {
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const EyeIcon = () => (
  <svg {...eyeProps}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg {...eyeProps}>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
    <path d="M1 1l22 22" />
  </svg>
);

function messageForCode(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/email-already-in-use":
      return "That email is already registered — try signing in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/popup-blocked":
      return "Please allow popups for this site to sign in.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn’t enabled for the project.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const SignIn = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const runSignIn = async (fn: () => Promise<unknown>) => {
    setError("");
    setPending(true);
    try {
      await fn();
      // On success the auth state changes and this screen unmounts.
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code: unknown }).code)
          : "";

      // User simply dismissed the popup — nothing to surface.
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        setPending(false);
        return;
      }

      console.error("Sign-in failed:", err);
      setError(messageForCode(code));
      setPending(false);
    }
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;

    runSignIn(async () => {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Give email users a sensible display name (the part before "@").
        const displayName = email.split("@")[0];
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  // Use popup (not redirect): the app is served from *.web.app while the auth
  // handler lives on *.firebaseapp.com, and browsers block the cross-domain
  // storage that signInWithRedirect depends on, losing the result.
  const googleSignIn = () =>
    runSignIn(() => signInWithPopup(auth, new GoogleAuthProvider()));
  const guestSignIn = () => runSignIn(() => signInAnonymously(auth));

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-6">
          <Logo className="mx-auto mb-3 h-14 w-14 rounded-2xl shadow-lg" />
          <h1 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-3xl font-extrabold uppercase tracking-wide text-transparent">
            Chat App
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {mode === "signup"
              ? "Create an account to start chatting"
              : "Sign in to continue"}
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/80 px-4 py-2 text-sm text-white">
            {error}
          </p>
        )}

        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col gap-3 text-left"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className={inputClass}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-white/50 hover:text-white"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <button
            type="submit"
            disabled={pending}
            className={`${buttonBase} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:opacity-90 focus:ring-blue-400`}
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setError("");
          }}
          className="mt-3 text-sm text-blue-300 hover:underline"
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs uppercase text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          or
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={googleSignIn}
            disabled={pending}
            className={`${buttonBase} bg-white text-gray-700 hover:bg-gray-100 focus:ring-blue-400`}
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={guestSignIn}
            disabled={pending}
            className={`${buttonBase} border border-white/30 bg-white/10 text-white hover:bg-white/20 focus:ring-white/40`}
          >
            <GuestIcon />
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
