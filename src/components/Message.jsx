import React from "react";
import { auth } from "../firebase";
import { formatRelativeTime } from "../utils/time";

const style = {
  row: `flex flex-col mx-4 my-3`,
  meta: `mb-1 text-xs text-white/70`,
  bubble: `inline-block max-w-[80%] break-words py-2 px-4 shadow-md rounded-2xl`,
  sent: `self-end items-end bg-cyan-400 text-black rounded-br-sm`,
  received: `self-start items-start bg-gray-200 text-black rounded-bl-sm`,
};

const Message = ({ message }) => {
  // auth.currentUser can briefly be null during the auth redirect / sign-out,
  // so guard against dereferencing it.
  const isSent = message.uid === auth.currentUser?.uid;
  const displayName = message.name || "Guest";

  return (
    <div className={`${style.row} ${isSent ? "items-end" : "items-start"}`}>
      <span className={style.meta}>
        {displayName} · {formatRelativeTime(message.timestamp)}
      </span>
      <div className={`${style.bubble} ${isSent ? style.sent : style.received}`}>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
