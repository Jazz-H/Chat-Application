import { auth } from "../firebase";

const Header = () => {
  return (
    <header className="flex shrink-0 items-center justify-between bg-slate-200 px-4 py-2 text-black shadow">
      <h1 className="text-2xl font-bold">Messages</h1>
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
