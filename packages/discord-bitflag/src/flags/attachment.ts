import type { BitFlags } from "bitflag-js";

export const AttachmentFlags = Object.freeze({
  IsClip: 1n << 0n,
  IsThumbnail: 1n << 1n,
  IsRemix: 1n << 2n,
  IsSpoiler: 1n << 3n,
  IsAnimated: 1n << 5n,
}) satisfies BitFlags;
