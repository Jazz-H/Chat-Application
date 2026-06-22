import { auth } from "../firebase";
import { formatRelativeTime } from "../utils/time";
import Avatar from "./Avatar";
import type { ChatMessage } from "../types";

const style = {
  bubble: `inline-block max-w-full break-words rounded-2xl px-4 py-2 shadow-md`,
  sent: `bg-cyan-400 text-black rounded-br-sm`,
  received: `bg-gray-200 text-black rounded-bl-sm`,
};

interface MessageProps {
  message: ChatMessage;
}

const Message = ({ message }: MessageProps) => {
  // auth.currentUser can briefly be null during the auth redirect / sign-out,
  // so guard against dereferencing it.
  const isSent = message.uid === auth.currentUser?.uid;
  const displayName = message.name || "Guest";

  return (
    <div
      className={`flex items-end gap-2 px-2 py-1.5 ${
        isSent ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar name={displayName} uid={message.uid} />
      <div
        className={`flex max-w-[75%] flex-col ${
          isSent ? "items-end" : "items-start"
        }`}
      >
        <span className="mb-1 text-xs text-white/70">
          {displayName} · {formatRelativeTime(message.timestamp)}
        </span>
        <div
          className={`${style.bubble} ${isSent ? style.sent : style.received}`}
        >
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
