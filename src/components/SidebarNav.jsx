import { useState } from "react";
const SidebarNav = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    {
      title: "Inbox",
      src: "https://img.icons8.com/cotton/50/000000/secured-letter--v2.png",
      gap: true,
    },
    {
      title: "Account",
      src: "https://img.icons8.com/cotton/50/null/web-account.png",
      gap: true,
    },
    {
      title: "Forums ",
      src: "https://img.icons8.com/cotton/50/000000/filled-chat--v1.png",
      gap: true,
    },
    {
      title: "Search",
      src: "https://img.icons8.com/color/50/000000/search--v1.png",
      gap: true,
    },
    {
      title: "Setting",
      src: "https://img.icons8.com/cotton/50/null/settings--v1.png",
      gap: true,
    },
  ];

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-slate-600 h-full p-5  top-10 left-0 absolute duration-300`}
      >
        <img
          src="https://img.icons8.com/cotton/30/000000/circled-left--v2.png"
          alt="Toggle sidebar"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src="https://img.icons8.com/external-sbts2018-outline-color-sbts2018/48/null/external-active-basic-ui-elements-2.3-sbts2018-outline-color-sbts2018.png"
            alt="Chat App logo"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-bold text-4xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Chat App
          </h1>
        </div>
        <hr class="mt-6 border-2 rounded-md text-white" />
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-slate-700 text-gray-300 text-2xl font-bold items-center gap-x-6
              ${Menu.gap ? "mt-12" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <img src={`${Menu.src}`} alt={Menu.title} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default SidebarNav;
