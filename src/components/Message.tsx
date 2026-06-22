import { useState, type FormEvent } from "react";
import { auth } from "../firebase";
import { formatClockTime } from "../utils/time";
import Avatar from "./Avatar";
import {
  toggleReaction,
  deleteMessage,
  editMessage,
} from "../lib/messageActions";
import ConfirmDialog from "./ConfirmDialog";
import type { ChatMessage } from "../types";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "😮", "😢"];

const style = {
  bubble: `inline-block max-w-full whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] shadow-sm`,
  sent: `bg-blue-600 text-white`,
  received: `bg-slate-800 text-gray-100 ring-1 ring-white/5`,
  action: `rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white`,
};

const SmileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

interface MessageProps {
  message: ChatMessage;
  isOwn: boolean;
  startGroup: boolean;
  endGroup: boolean;
  roomId: string;
}

const Message = ({
  message,
  isOwn,
  startGroup,
  endGroup,
  roomId,
}: MessageProps) => {
  const uid = auth.currentUser?.uid;
  const displayName = message.name || "Guest";
  const tail = endGroup ? (isOwn ? "rounded-br-sm" : "rounded-bl-sm") : "";

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [picker, setPicker] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const react = (emoji: string) => {
    if (uid) {
      toggleReaction(roomId, message.id, emoji, message.reactions, uid).catch(
        () => undefined
      );
    }
    setPicker(false);
  };

  const remove = () => setConfirmOpen(true);

  const confirmDelete = () => {
    deleteMessage(roomId, message.id).catch(() => undefined);
    setConfirmOpen(false);
  };

  const saveEdit = (e: FormEvent) => {
    e.preventDefault();
    const text = editText.trim();
    if (text && text !== message.text) {
      editMessage(roomId, message.id, text).catch(() => undefined);
    }
    setEditing(false);
  };

  const reactions = message.reactions ?? {};
  const hasReactions = Object.keys(reactions).length > 0;

  return (
    <div
      className={`group flex gap-2 px-3 ${startGroup ? "mt-3" : "mt-0.5"} ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
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
          className={`relative flex items-center gap-1 ${
            isOwn ? "flex-row-reverse" : ""
          }`}
        >
          {editing ? (
            <form onSubmit={saveEdit} className="flex flex-col gap-1">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditing(false);
                }}
                autoFocus
                maxLength={500}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-[15px] text-white outline-none ring-1 ring-blue-400"
              />
              <div className="flex gap-3 text-xs">
                <button type="submit" className="text-blue-300 hover:underline">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditText(message.text);
                    setEditing(false);
                  }}
                  className="text-white/50 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div
              className={`flex flex-col gap-1 ${
                isOwn ? "items-end" : "items-start"
              }`}
            >
              {message.imageUrl && (
                <a href={message.imageUrl} target="_blank" rel="noreferrer">
                  <img
                    src={message.imageUrl}
                    alt="Shared attachment"
                    loading="lazy"
                    className="max-h-64 max-w-[16rem] rounded-xl object-cover"
                  />
                </a>
              )}
              {message.text && (
                <div
                  className={`${style.bubble} ${isOwn ? style.sent : style.received} ${tail}`}
                >
                  {message.text}
                  {message.editedAt && (
                    <span className="ml-1 align-baseline text-[10px] opacity-60">
                      (edited)
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {!editing && (
            <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                aria-label="Add reaction"
                onClick={() => setPicker((v) => !v)}
                className={style.action}
              >
                <SmileIcon />
              </button>
              {isOwn && (
                <>
                  <button
                    type="button"
                    aria-label="Edit message"
                    onClick={() => {
                      setEditText(message.text);
                      setEditing(true);
                    }}
                    className={style.action}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete message"
                    onClick={remove}
                    className={`${style.action} hover:text-red-300`}
                  >
                    <TrashIcon />
                  </button>
                </>
              )}
            </div>
          )}

          {picker && (
            <div
              className={`absolute top-full z-10 mt-1 flex gap-1 rounded-full border border-white/10 bg-slate-800 p-1 shadow-lg ${
                isOwn ? "right-0" : "left-0"
              }`}
            >
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => react(emoji)}
                  className="rounded-full px-1.5 text-lg hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasReactions && (
          <div
            className={`mt-1 flex flex-wrap gap-1 ${isOwn ? "justify-end" : ""}`}
          >
            {Object.entries(reactions).map(([emoji, uids]) => {
              const mine = !!uid && uids.includes(uid);
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => react(emoji)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    mine
                      ? "bg-blue-500/30 ring-1 ring-blue-400/50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{uids.length}</span>
                </button>
              );
            })}
          </div>
        )}

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

      {confirmOpen && (
        <ConfirmDialog
          title="Delete message"
          message="This message will be permanently deleted."
          confirmLabel="Delete"
          destructive
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default Message;
