import type { Snowflake } from "discord-snowflake";

/**
 * @see https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object
 */
export const AUDIT_LOG_LIMIT = 512;

/**
 * Helpers
 */

export type Condense<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * Request Structures
 */

export enum RequestMethod {
	Delete = "DELETE",
	Get = "GET",
	Patch = "PATCH",
	Post = "POST",
	Put = "PUT",
}

export interface Attachment {
	id?: Snowflake;
	name: string;
	data: Blob;
}

// TODO: Document and refine
export interface RequestOptions {
	authorization?: boolean;
	authorizationPrefix?: "Bot" | "Bearer";
	formData?: FormData;
	body?: BodyInit | object;
	files?: Attachment[] | undefined;
	headers?: HeadersInit;
	rawBody?: boolean;
	query?: URLSearchParams;
	reason?: string;
	versioned?: boolean;
}

export interface RequestData extends RequestOptions {
	path: string;
	method: RequestMethod;
}
