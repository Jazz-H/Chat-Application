interface LogoProps {
  className?: string;
}

/**
 * Chat App logo — a chat bubble badge in the app's blue gradient. Kept inline
 * (rather than an <img>) so it scales crisply and matches public/logo.svg,
 * which is reused as the favicon.
 */
const Logo = ({ className }: LogoProps) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    role="img"
    aria-label="Chat App logo"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="chatLogoGradient"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#chatLogoGradient)" />
    <rect x="14" y="18" width="36" height="22" rx="8" fill="#fff" />
    <path d="M24 38 L24 50 L34 40 Z" fill="#fff" />
    <circle cx="25" cy="29" r="2.6" fill="#2563eb" />
    <circle cx="32" cy="29" r="2.6" fill="#2563eb" />
    <circle cx="39" cy="29" r="2.6" fill="#2563eb" />
  </svg>
);

export default Logo;
