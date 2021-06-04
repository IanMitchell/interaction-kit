import type { Snowflake } from "../data/snowflake";

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
