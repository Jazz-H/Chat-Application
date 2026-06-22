import { useState } from "react";
import { ROOMS } from "../rooms";

interface SidebarNavProps {
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

const SidebarNav = ({ activeRoomId, onSelectRoom }: SidebarNavProps) => {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } relative h-screen shrink-0 bg-slate-700 p-5 pt-8 duration-300`}
    >
      <button
        type="button"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        onClick={() => setOpen(!open)}
        className={`absolute -right-3 top-9 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-700 bg-white text-slate-700 ${
          !open && "rotate-180"
        }`}
      >
        ‹
      </button>

      <div className="flex items-center gap-x-4">
        <span className="text-3xl">💬</span>
        <h1
          className={`origin-left text-2xl font-bold text-white duration-200 ${
            !open && "scale-0"
          }`}
        >
          Chat App
        </h1>
      </div>

      <hr className="mt-6 rounded-md border-2 border-white/30" />

      <p
        className={`mt-4 text-xs font-semibold uppercase tracking-wider text-white/50 ${
          !open && "hidden"
        }`}
      >
        Channels
      </p>

      <ul className="mt-2 space-y-1">
        {ROOMS.map((room) => {
          const isActive = room.id === activeRoomId;
          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelectRoom(room.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full items-center gap-x-4 rounded-md p-2 text-left text-lg font-medium duration-200 ${
                  isActive
                    ? "bg-slate-500 text-white"
                    : "text-gray-200 hover:bg-slate-600"
                }`}
              >
                <span className="w-6 shrink-0 text-center text-xl">
                  {room.icon}
                </span>
                <span className={`${!open && "hidden"}`}>{room.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SidebarNav;
