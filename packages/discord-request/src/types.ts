import type { Snowflake } from "discord-snowflake";

export const enum RequestMethod {
	Delete = "delete",
	Get = "get",
	Patch = "patch",
	Post = "post",
	Put = "put",
}

export interface RawFile {
	id?: Snowflake;
	name: string;
	data: string | number | boolean | Buffer;
}

export interface RequestOptions {
	auth?: boolean;
	authPrefix?: "Bot" | "Bearer";
	formData?: FormData;
	body?: BodyInit | unknown;
	files?: RawFile[] | undefined;
	headers?: Record<string, string>;
	passThroughBody?: boolean;
	query?: URLSearchParams;
	reason?: string;
	versioned?: boolean;
}

export interface RequestData extends RequestOptions {
	path: string;
	method: RequestMethod;
}

export type Route = {
	identifier: string;
	path: string;
};

export interface RateLimitData {
	/**
	 * The time, in milliseconds, until the request-lock is reset
	 */
	timeToReset: number;
	/**
	 * The amount of requests we can perform before locking requests
	 */
	limit: number;
	/**
	 * The HTTP method being performed
	 */
	method: RequestMethod;
	/**
	 * The bucket hash for this request
	 */
	hash: string;
	/**
	 * The full URL for this request
	 */
	url: string;
	/**
	 * The route being hit in this request
	 */
	route: string;
	/**
	 * The major parameter of the route
	 *
	 * For example, in `/channels/x`, this will be `x`.
	 * If there is no major parameter (e.g: `/bot/gateway`) this will be `global`.
	 */
	majorParameter: string;
	/**
	 * Whether the rate limit that was reached was the global limit
	 */
	global: boolean;
}
