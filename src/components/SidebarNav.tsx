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
      } flex h-screen shrink-0 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl duration-300`}
    >
      <div
        className={`flex items-center gap-2 border-b border-white/10 p-4 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg shadow-lg">
              💬
            </div>
            <h1 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-lg font-bold text-transparent">
              Chat App
            </h1>
          </div>
        )}
        <button
          type="button"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-lg leading-none text-white/70 hover:bg-white/10 hover:text-white"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {open && (
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
            Channels
          </p>
        )}
        <ul className="space-y-1">
          {ROOMS.map((room) => {
            const isActive = room.id === activeRoomId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  aria-current={isActive ? "page" : undefined}
                  title={room.name}
                  className={`flex w-full items-center rounded-xl p-2.5 text-sm font-medium transition ${
                    open ? "gap-3" : "justify-center"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-white ring-1 ring-inset ring-white/10"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{room.icon}</span>
                  {open && <span className="truncate">{room.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNav;
