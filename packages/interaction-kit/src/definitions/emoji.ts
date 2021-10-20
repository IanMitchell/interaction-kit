/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";
import { User } from "./users";

/** @link https://discord.com/developers/docs/resources/emoji#emoji-object-emoji-structure */
// TODO: add in type constraints
export type Emoji = {
	id: Snowflake | null;
	name: string | null;
	roles?: Snowflake[];
	user?: User;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
};
