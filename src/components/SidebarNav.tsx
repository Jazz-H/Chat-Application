import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROOMS } from "../rooms";
import { useChat } from "../chat/chat";
import Logo from "./Logo";
import Avatar from "./Avatar";

interface Conversation {
  id: string;
  peerUid: string;
  peerName: string;
  updatedAt: number;
}

const SidebarNav = () => {
  const [open, setOpen] = useState(true);
  const [dms, setDms] = useState<Conversation[]>([]);
  const { active, openRoom, openDm } = useChat();
  const myUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!myUid) return;
    const q = query(
      collection(db, "conversations"),
      where("members", "array-contains", myUid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Conversation[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as {
            members: string[];
            memberInfo?: Record<string, { name?: string }>;
            updatedAt?: Timestamp | null;
          };
          const peerUid = data.members.find((m) => m !== myUid);
          if (!peerUid) return;
          list.push({
            id: docSnap.id,
            peerUid,
            peerName: data.memberInfo?.[peerUid]?.name || "Unknown",
            updatedAt: data.updatedAt?.toMillis() ?? 0,
          });
        });
        list.sort((a, b) => b.updatedAt - a.updatedAt);
        setDms(list);
      },
      () => undefined
    );
    return () => unsubscribe();
  }, [myUid]);

  const itemClass = (isActive: boolean) =>
    `flex w-full items-center rounded-xl p-2.5 text-sm font-medium transition ${
      open ? "gap-3" : "justify-center"
    } ${
      isActive
        ? "bg-gradient-to-r from-blue-600/40 to-blue-500/20 text-white ring-1 ring-inset ring-blue-400/30"
        : "text-white/60 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } flex h-screen shrink-0 flex-col border-r border-blue-500/20 bg-slate-950/85 backdrop-blur-xl duration-300`}
    >
      <div
        className={`flex items-center gap-2 border-b border-blue-500/20 p-4 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Logo className="h-9 w-9 shrink-0 rounded-xl shadow-lg shadow-blue-500/30" />
            <h1 className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-lg font-bold text-transparent">
              Chat App
            </h1>
          </div>
        )}
        <button
          type="button"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-lg leading-none text-blue-200/70 hover:bg-blue-500/10 hover:text-white"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {open && (
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
            Channels
          </p>
        )}
        <ul className="space-y-1">
          {ROOMS.map((room) => {
            const isActive = active.kind === "room" && active.id === room.id;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => openRoom(room)}
                  aria-current={isActive ? "page" : undefined}
                  title={room.name}
                  className={itemClass(isActive)}
                >
                  <span className="text-lg">{room.icon}</span>
                  {open && <span className="truncate">{room.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {dms.length > 0 && (
          <>
            {open && (
              <p className="mb-2 mt-5 px-2 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                Direct Messages
              </p>
            )}
            <ul className="mt-2 space-y-1">
              {dms.map((dm) => {
                const isActive = active.kind === "dm" && active.id === dm.id;
                return (
                  <li key={dm.id}>
                    <button
                      type="button"
                      onClick={() => openDm(dm.peerUid, dm.peerName)}
                      aria-current={isActive ? "page" : undefined}
                      title={dm.peerName}
                      className={itemClass(isActive)}
                    >
                      <Avatar name={dm.peerName} uid={dm.peerUid} size={22} />
                      {open && <span className="truncate">{dm.peerName}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
};

export default SidebarNav;
