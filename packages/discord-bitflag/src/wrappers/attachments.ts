import { BitField } from "bitflag-js";
import { AttachmentFlags } from "../flags/attachment.js";

export class AttachmentFlagsBitField extends BitField {
  static ALL = BitField.resolve(Object.values(AttachmentFlags));
}
