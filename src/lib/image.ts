// Client-side image handling so images can be shared without Firebase Storage
// (which now requires a billing plan). Images are downscaled and JPEG-encoded
// to a data URL that's stored directly on the Firestore message, kept small
// enough to stay well under the 1 MB document limit.

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // accepted source size
const MAX_DIMENSION = 1024;
const TARGET_BYTES = 800_000; // ~800 KB data-URL ceiling

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

/** Downscale + compress an image file to a JPEG data URL. */
export async function compressImageToDataUrl(file: File): Promise<string> {
  const img = await loadImage(await readAsDataUrl(file));

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.7;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > TARGET_BYTES && quality > 0.3) {
    quality -= 0.15;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}
