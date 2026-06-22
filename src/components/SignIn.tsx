import { useState } from "react";
import { auth } from "../firebase";
import Logo from "./Logo";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  signInAnonymously,
} from "firebase/auth";

const buttonBase =
  "flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
  </svg>
);

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

const SignIn = () => {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const runSignIn = async (fn: () => Promise<unknown>) => {
    setError("");
    setPending(true);
    try {
      await fn();
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Sign-in failed. Please try again.");
      setPending(false);
    }
  };

  const googleSignIn = () =>
    runSignIn(() => signInWithRedirect(auth, new GoogleAuthProvider()));
  const gitHubSignIn = () =>
    runSignIn(() => signInWithRedirect(auth, new GithubAuthProvider()));
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
            Sign in with social media or continue as a guest
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/80 px-4 py-2 text-sm text-white">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={gitHubSignIn}
            disabled={pending}
            className={`${buttonBase} bg-[#1f2328] text-white hover:bg-black focus:ring-white/40`}
          >
            <GitHubIcon />
            Continue with GitHub
          </button>
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
