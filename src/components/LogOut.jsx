import React from "react";
import { auth } from "../firebase";

const style = {
  button: `bg-black text-white px-6  rounded-md top-2 right-10 absolute hover:bg-gray-600 hover:text-white drop-shadow-lg shadow-white`,
  banner: `bg-pink w-full top-0 h-20 absolute`,
};

const LogOut = () => {
  return (
    <>
      <div className="w-full h-10 top-0 left-0 absolute bg-slate-200">
        <h1 className="p-1 text-2xl text-black font-bold">Messages</h1>
      </div>
      <button onClick={() => auth.signOut()} className={style.button}>
        Logout
      </button>
    </>
  );
};

export default LogOut;
