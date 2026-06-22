import { useState } from "react";
import SidebarNav from "./SidebarNav";
import Header from "./Header";
import Chat from "./Chat";
import SendMessage from "./SendMessage";
import TypingIndicator from "./TypingIndicator";
import { ROOMS, DEFAULT_ROOM_ID } from "../rooms";

/**
 * Two-pane application shell for signed-in users: a collapsible room list
 * alongside a column containing the header, the scrollable message list, and
 * the message composer. The active room scopes both reads and writes.
 */
const ChatLayout = () => {
  const [activeRoomId, setActiveRoomId] = useState(DEFAULT_ROOM_ID);
  const activeRoom = ROOMS.find((room) => room.id === activeRoomId) ?? ROOMS[0];

  return (
    <div className="flex h-screen overflow-hidden text-white">
      <SidebarNav activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header room={activeRoom} />
        {/* Remount on room change so message/pagination state resets cleanly. */}
        <Chat key={activeRoomId} roomId={activeRoomId} />
        <TypingIndicator roomId={activeRoomId} />
        <SendMessage roomId={activeRoomId} />
      </div>
    </div>
  );
};

export default ChatLayout;
