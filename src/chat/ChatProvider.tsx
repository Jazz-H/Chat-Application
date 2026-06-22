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

  const openDm = (peerUid: string, peerName: string) => {
    const me = auth.currentUser;
    if (!me || peerUid === me.uid) return;

    const id = dmId(me.uid, peerUid);
    // Upsert the conversation so it shows up in both users' DM lists.
    setDoc(
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
    ).catch(() => undefined);

    setActive({ kind: "dm", id, name: peerName, peerUid });
  };

  return (
    <ChatContext.Provider value={{ active, openRoom, openDm }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
