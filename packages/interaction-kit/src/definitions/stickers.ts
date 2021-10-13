import { User } from "./users";
import { Snowflake } from "./snowflakes";

// https://discord.com/developers/docs/resources/sticker#sticker-item-object-sticker-item-structure
export type StickerItem = {
    id: Snowflake;
    name: string;
    format_type: StickerFormatType;
};

// https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
export enum StickerFormatType {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
};

// https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-structure
export type Sticker = {
    id: Snowflake;
    pack_id?: Snowflake;
    name: string;
    description: string | null;
    tags: string;
    asset: string;
    type: StickerType;
    format_type: StickerFormatType;
    available?: boolean;
    guild_id?: Snowflake;
    user?: User;
    sort_value?: number;
};


export enum StickerType {
    STANDARD = 1,
    GUILD = 2
}