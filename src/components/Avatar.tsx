interface AvatarProps {
  name: string;
  uid: string;
  size?: number;
}

// A small, fixed palette so avatar colors stay consistent and on-brand.
const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

// Stable hash so a given uid always maps to the same color.
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic initial-based avatar. Avoids storing photo URLs (and the
 * accompanying schema/security-rule changes) while still giving every user —
 * including anonymous guests — a distinct, consistent identity.
 */
const Avatar = ({ name, uid, size = 36 }: AvatarProps) => {
  const initial = (name.trim().charAt(0) || "?").toUpperCase();
  const background = COLORS[hashString(uid) % COLORS.length];

  return (
    <div
      className="flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: background,
        fontSize: size * 0.45,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
};

export default Avatar;
