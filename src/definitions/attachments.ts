/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";

export interface Attachment {
	id: Snowflake;
	filename: string;
	content_type?: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number | null;
	width?: number | null;
}
