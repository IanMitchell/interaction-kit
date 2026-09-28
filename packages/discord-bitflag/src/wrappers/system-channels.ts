import { BitField } from "bitflag-js";
import { SystemChannelFlags } from "../flags/system-channel.js";

export class SystemChannelFlagsBitField extends BitField {
  static ALL = BitField.resolve(Object.values(SystemChannelFlags));
}
