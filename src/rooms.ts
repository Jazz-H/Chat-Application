export interface Room {
  id: string;
  name: string;
  icon: string;
}

// Fixed set of channels. Kept client-side (rather than a Firestore `rooms`
// collection) since the list is static — simpler, with no extra reads.
export const ROOMS: Room[] = [
  { id: "general", name: "General", icon: "💬" },
  { id: "random", name: "Random", icon: "🎲" },
  { id: "tech", name: "Tech", icon: "💻" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "music", name: "Music", icon: "🎵" },
];

// The channel a new session opens on. Named here, next to the array, so the
// "first room wins" coupling lives in one place rather than as a bare
// ROOMS[0] index at the call site.
export const DEFAULT_ROOM: Room = ROOMS[0];
