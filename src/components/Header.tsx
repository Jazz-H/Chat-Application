import { auth } from "../firebase";
import Avatar from "./Avatar";
import type { ActiveChat } from "../chat/chat";

interface HeaderProps {
  active: ActiveChat;
}

const Header = ({ active }: HeaderProps) => {
  const user = auth.currentUser;
  const name = user?.displayName || "Guest";

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-blue-400/25 bg-gradient-to-r from-blue-900/70 to-blue-800/50 px-4 py-3 text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        {active.kind === "room" ? (
          <span className="text-xl">{active.icon}</span>
        ) : (
          <Avatar name={active.name} uid={active.peerUid} size={28} />
        )}
        <div className="leading-tight">
          <h2 className="text-lg font-semibold">{active.name}</h2>
          <p className="text-xs text-blue-100/60">
            {active.kind === "room" ? "Public channel" : "Direct message"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={name} uid={user.uid} size={32} />
            <span className="max-w-[10rem] truncate text-sm text-white/80">
              {name}
            </span>
          </div>
        )}
        <button
          onClick={() => auth.signOut()}
          className="rounded-lg border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
