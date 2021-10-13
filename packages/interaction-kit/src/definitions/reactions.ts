/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Emoji } from "./emoji";

// https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
export type Reaction = {
    count: number;
    me: boolean;
    emoji: Emoji;
}
