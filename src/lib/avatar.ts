/**
 * Avatar image pipeline.
 *
 * A profile photo is stored as a data URL in the demo account, so it must be
 * small: `localStorage` allows roughly 5 MB per origin and the account record
 * holds a password digest too. Files are validated, then downscaled and
 * re-encoded in the browser before anything is persisted.
 *
 * No upload happens anywhere — the canvas never leaves this device.
 */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
/** Output edge length. 256px covers a 128px avatar on a 2x screen. */
const OUTPUT_SIZE = 256;
const OUTPUT_QUALITY = 0.82;

export type AvatarErrorCode = 'type' | 'size' | 'decode' | 'unknown';

export type AvatarResult =
  | { ok: true; dataUrl: string }
  | { ok: false; code: AvatarErrorCode };

function isAcceptedType(file: File): boolean {
  return (ACCEPTED_TYPES as readonly string[]).includes(file.type);
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('decode-failed'));
    image.src = dataUrl;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('read-failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate, downscale, and compress an uploaded image.
 *
 * The centre square is cropped rather than squashed, so a portrait or a
 * landscape both produce a usable avatar without distortion.
 */
export async function prepareAvatar(file: File): Promise<AvatarResult> {
  if (!isAcceptedType(file)) return { ok: false, code: 'type' };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, code: 'size' };

  try {
    const source = await readAsDataUrl(file);
    const image = await loadImage(source);

    const side = Math.min(image.naturalWidth, image.naturalHeight);
    if (!side) return { ok: false, code: 'decode' };

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext('2d');
    if (!context) return { ok: false, code: 'unknown' };

    context.imageSmoothingQuality = 'high';
    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );

    // JPEG keeps photographic avatars far smaller than PNG. Anything already
    // tiny is left as-is by the encoder.
    const dataUrl = canvas.toDataURL('image/jpeg', OUTPUT_QUALITY);
    return { ok: true, dataUrl };
  } catch {
    return { ok: false, code: 'decode' };
  }
}
