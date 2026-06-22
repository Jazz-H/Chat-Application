import SidebarNav from "./SidebarNav";
import Header from "./Header";
import Chat from "./Chat";
import SendMessage from "./SendMessage";

/**
 * Two-pane application shell for signed-in users: a collapsible sidebar
 * alongside a column containing the header, the scrollable message list, and
 * the message composer pinned to the bottom.
 */
const ChatLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden text-white">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <Chat />
        <SendMessage />
      </div>
    </div>
  );
};

export default ChatLayout;
