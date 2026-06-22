import { useCallback, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// Refresh the typing doc at most this often while actively typing, and clear
// it after this much idle time.
const REFRESH_MS = 2000;
const STOP_MS = 3000;

/**
 * Publishes the current user's "typing" state to
 * rooms/{roomId}/typing/{uid}. Returns `notifyTyping` (call on input) and
 * `clearTyping` (call on send). Automatically clears on room change/unmount.
 */
export function useTyping(roomId: string) {
  const stopTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastWrite = useRef(0);

  const typingDoc = useCallback(() => {
    const uid = auth.currentUser?.uid;
    return uid ? doc(db, "rooms", roomId, "typing", uid) : null;
  }, [roomId]);

  const clearTyping = useCallback(() => {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = undefined;
    }
    lastWrite.current = 0;
    const ref = typingDoc();
    if (ref) deleteDoc(ref).catch(() => undefined);
  }, [typingDoc]);

  const notifyTyping = useCallback(() => {
    const ref = typingDoc();
    const user = auth.currentUser;
    if (!ref || !user) return;

    const now = Date.now();
    if (now - lastWrite.current > REFRESH_MS) {
      lastWrite.current = now;
      setDoc(ref, {
        name: user.displayName || "Guest",
        updatedAt: serverTimestamp(),
      }).catch(() => undefined);
    }

    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(clearTyping, STOP_MS);
  }, [typingDoc, clearTyping]);

  // Clean up the typing doc when switching rooms or unmounting.
  useEffect(() => clearTyping, [clearTyping]);

  return { notifyTyping, clearTyping };
}
