import { auth } from "../firebase";
import type { Room } from "../rooms";

interface HeaderProps {
  room: Room;
}

const Header = ({ room }: HeaderProps) => {
  return (
    <header className="flex shrink-0 items-center justify-between bg-slate-200 px-4 py-2 text-black shadow">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <span>{room.icon}</span>
        {room.name}
      </h1>
      <button
        onClick={() => auth.signOut()}
        className="rounded-md bg-black px-4 py-1 text-white drop-shadow-lg hover:bg-gray-700"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
