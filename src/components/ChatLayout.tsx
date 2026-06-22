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

  return (
    <div className="flex h-screen overflow-hidden text-white">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header active={active} />
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
