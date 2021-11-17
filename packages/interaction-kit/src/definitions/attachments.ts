/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";

/** @link https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure */
export interface Attachment {
	id: Snowflake;
	filename: string;
	content_type?: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number | null;
	width?: number | null;
	ephemeral?: boolean;
}

export interface PartialAttachment {
	filename: string;
	description?: string;
}