import { useState, type ReactNode } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROOMS, type Room } from "../rooms";
import { ChatContext, dmId, type ActiveChat } from "./chat";

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<ActiveChat>(() => {
    const room = ROOMS[0];
    return { kind: "room", id: room.id, name: room.name, icon: room.icon };
  });

  const openRoom = (room: Room) =>
    setActive({ kind: "room", id: room.id, name: room.name, icon: room.icon });

  const openDm = async (peerUid: string, peerName: string) => {
    const me = auth.currentUser;
    if (!me || peerUid === me.uid) return;

    const id = dmId(me.uid, peerUid);
    // Upsert the conversation FIRST so it exists before the message listener
    // attaches (the membership security rule reads this doc). Otherwise the
    // first load of a brand-new DM races the create and is denied.
    try {
      await setDoc(
        doc(db, "conversations", id),
        {
          members: [me.uid, peerUid],
          memberInfo: {
            [me.uid]: { name: me.displayName || "Guest" },
            [peerUid]: { name: peerName },
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to open conversation:", err);
    }

    setActive({ kind: "dm", id, name: peerName, peerUid });
  };

  return (
    <ChatContext.Provider value={{ active, openRoom, openDm }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
