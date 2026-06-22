import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../firebase";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Upload an image for a room and return its download URL. Stored under
 * rooms/{roomId}/{uid}/{timestamp}_{name} so Storage rules can scope writes
 * to the uploading user.
 */
export async function uploadRoomImage(
  roomId: string,
  file: File
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");

  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const objectRef = ref(storage, `rooms/${roomId}/${uid}/${safeName}`);
  await uploadBytes(objectRef, file);
  return getDownloadURL(objectRef);
}
