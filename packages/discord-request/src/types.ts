import type { Snowflake } from "discord-snowflake";

export const enum RequestMethod {
	Delete = "delete",
	Get = "get",
	Patch = "patch",
	Post = "post",
	Put = "put",
}

export type Route = {
	identifier: string;
	path: string;
};

export interface Attachment {
	id?: Snowflake;
	name: string;
	data: Blob;
}

export interface RequestOptions {
	auth?: boolean;
	authPrefix?: "Bot" | "Bearer";
	formData?: FormData;
	body?: BodyInit | unknown;
	files?: Attachment[] | undefined;
	headers?: Record<string, string>;
	rawBody?: boolean;
	query?: URLSearchParams;
	reason?: string;
	versioned?: boolean;
}

export interface RequestData extends RequestOptions {
	path: string;
	method: RequestMethod;
}

export interface RateLimitData {
	retryAfter: number;
	limit: number;
	bucket: string;
	url: string;
	route: string;
	identifier: string;
	global: boolean;
	method: RequestMethod;
}
