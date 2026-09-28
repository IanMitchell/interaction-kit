import { BitField } from "bitflag-js";
import { SKUFlags } from "../flags/sku.js";

export class SKUFlagsBitField extends BitField {
  static ALL = BitField.resolve(Object.values(SKUFlags));
}
