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

export const DEFAULT_ROOM_ID = ROOMS[0].id;
