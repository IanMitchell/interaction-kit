import type { Snowflake } from "discord-snowflake";
import pkg from "../package.json" assert { type: "json" };

/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object}
 */
export const AUDIT_LOG_LIMIT = 512;

/**
 * @see {@link https://discord.com/developers/docs/reference#user-agent}
 */
export type UserAgent = `DiscordBot (${string}, ${string})${string}`;

export const DEFAULT_USER_AGENT: UserAgent = `DiscordBot (https://github.com/ianmitchell/interaction-kit, v${pkg.version})`;

/**
 * Helpers
 */

export type Prettify<T> = {
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

export interface RequestOptions {
	/**
	 * Whether to use the authorization header.
	 */
	authorization?: boolean;

	/**
	 * The authorization prefix to use.
	 * @defaultValue "Bot"
	 */
	authorizationPrefix?: "Bot" | "Bearer";

	/**
	 * The body to send as form data.
	 */
	formData?: FormData;

	/**
	 * The body to send with the request. If you have defined `formData` or
	 * `files` this will be sent as `payload_json` in the form data.
	 */
	body?: BodyInit | object;

	/**
	 * A list of up to 10 files to upload and send as part of the request
	 */
	files?: Attachment[] | undefined;

	/**
	 * Headers to add to the request.
	 */
	headers?: HeadersInit;

	/**
	 * If true, the body will not be processed before sending to Discord.
	 * @defaultValue false
	 */
	rawBody?: boolean;

	/**
	 * Query parameters to add to the request.
	 */
	query?: URLSearchParams;

	/**
	 * An optional entry to add to the audit log.
	 */
	reason?: string;

	/**
	 * Whether to use the versioned API.
	 */
	versioned?: boolean;
}

export interface RequestData extends RequestOptions {
	path: string;
	method: RequestMethod;
}
