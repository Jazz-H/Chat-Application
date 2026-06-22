import { useState } from "react";
import ChatProvider from "../chat/ChatProvider";
import { useChat, chatPathFor } from "../chat/chat";
import SidebarNav from "./SidebarNav";
import Header from "./Header";
import Chat from "./Chat";
import TypingIndicator from "./TypingIndicator";
import SendMessage from "./SendMessage";

const ChatShell = () => {
  const { active } = useChat();
  const chatPath = chatPathFor(active);
  const key = chatPath.join("/");
  const placeholder =
    active.kind === "room"
      ? `Message #${active.name}`
      : `Message ${active.name}`;

  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden text-white">
      <SidebarNav mobileOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Backdrop for the mobile drawer. */}
      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header active={active} onMenu={() => setNavOpen(true)} />
        {/* Remount on conversation change so message/pagination state resets. */}
        <Chat key={key} chatPath={chatPath} />
        <TypingIndicator chatPath={chatPath} />
        <SendMessage chatPath={chatPath} placeholder={placeholder} />
      </div>
    </div>
  );
};

const ChatLayout = () => (
  <ChatProvider>
    <ChatShell />
  </ChatProvider>
);

export default ChatLayout;
