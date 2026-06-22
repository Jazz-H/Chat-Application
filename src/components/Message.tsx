import Avatar from "./Avatar";
import { formatClockTime } from "../utils/time";
import type { ChatMessage } from "../types";

const style = {
  bubble: `inline-block max-w-full whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] shadow-sm`,
  sent: `bg-blue-600 text-white`,
  received: `bg-slate-800 text-gray-100 ring-1 ring-white/5`,
};

interface MessageProps {
  message: ChatMessage;
  isOwn: boolean;
  startGroup: boolean;
  endGroup: boolean;
}

const Message = ({ message, isOwn, startGroup, endGroup }: MessageProps) => {
  const displayName = message.name || "Guest";

  const tail = endGroup ? (isOwn ? "rounded-br-sm" : "rounded-bl-sm") : "";

  return (
    <div
      className={`flex gap-2 px-3 ${startGroup ? "mt-3" : "mt-0.5"} ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar gutter (received only) — rendered once at the foot of a group. */}
      {!isOwn && (
        <div className="w-8 shrink-0 self-end">
          {endGroup && (
            <Avatar name={displayName} uid={message.uid} size={32} />
          )}
        </div>
      )}

      <div
        className={`flex max-w-[75%] flex-col ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {!isOwn && startGroup && (
          <span className="mb-1 ml-1 text-xs font-medium text-blue-200/70">
            {displayName}
          </span>
        )}

        <div
          className={`${style.bubble} ${isOwn ? style.sent : style.received} ${tail}`}
        >
          {message.text}
        </div>

        {endGroup && (
          <span
            className={`mt-1 text-[10px] text-white/40 ${
              isOwn ? "mr-1" : "ml-1"
            }`}
          >
            {formatClockTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
