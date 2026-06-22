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
    <header className="flex shrink-0 items-center justify-between border-b border-blue-500/20 bg-black/40 px-4 py-3 text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="text-xl">{room.icon}</span>
        <div className="leading-tight">
          <h2 className="text-lg font-semibold">{room.name}</h2>
          <p className="text-xs text-blue-200/50">Public channel</p>
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
          className="rounded-lg border border-blue-400/30 px-3 py-1.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/15"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
