import type { Snowflake } from "discord-snowflake";

export enum RequestMethod {
	Delete = "DELETE",
	Get = "GET",
	Patch = "PATCH",
	Post = "POST",
	Put = "PUT",
}

export interface Route {
	identifier: string;
	path: string;
}

export interface Attachment {
	id?: Snowflake;
	name: string;
	data: Blob;
}

type JSONValue =
	| string
	| number
	| boolean
	| { [x: string]: JSONValue }
	| undefined
	| null
	| JSONValue[];

export interface RequestOptions {
	auth?: boolean;
	authPrefix?: "Bot" | "Bearer";
	formData?: FormData;
	body?: BodyInit | unknown;
	files?: Attachment[] | undefined;
	headers?: HeadersInit;
	rawBody?: boolean;
	query?: URLSearchParams;
	reason?: string;
	versioned?: boolean;
	ignoreGlobalLimit?: boolean;
}

export interface RequestData extends RequestOptions {
	path: string;
	method: RequestMethod;
}

export interface RateLimitData {
	retryAfter: number;
	limit: number | null;
	bucket: string;
	url: string;
	route: string;
	identifier: string;
	global: boolean;
	method: RequestMethod;
}
