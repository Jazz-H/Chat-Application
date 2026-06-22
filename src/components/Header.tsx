import { auth } from "../firebase";
import Avatar from "./Avatar";
import type { Room } from "../rooms";

interface HeaderProps {
  room: Room;
}

const Header = ({ room }: HeaderProps) => {
  const user = auth.currentUser;
  const name = user?.displayName || "Guest";

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 py-3 text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="text-xl">{room.icon}</span>
        <div className="leading-tight">
          <h2 className="text-lg font-semibold">{room.name}</h2>
          <p className="text-xs text-white/50">Public channel</p>
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
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
