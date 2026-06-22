import { useState } from "react";

interface MenuItem {
  title: string;
  src: string;
}

const MENUS: MenuItem[] = [
  {
    title: "Inbox",
    src: "https://img.icons8.com/cotton/50/000000/secured-letter--v2.png",
  },
  {
    title: "Account",
    src: "https://img.icons8.com/cotton/50/null/web-account.png",
  },
  {
    title: "Forums",
    src: "https://img.icons8.com/cotton/50/000000/filled-chat--v1.png",
  },
  {
    title: "Search",
    src: "https://img.icons8.com/color/50/000000/search--v1.png",
  },
  {
    title: "Setting",
    src: "https://img.icons8.com/cotton/50/null/settings--v1.png",
  },
];

const SidebarNav = () => {
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

      <ul className="pt-6">
        {MENUS.map((menu) => (
          <li
            key={menu.title}
            className="mt-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-lg font-medium text-gray-200 hover:bg-slate-600"
          >
            <img src={menu.src} alt={menu.title} className="h-6 w-6 shrink-0" />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {menu.title}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarNav;
