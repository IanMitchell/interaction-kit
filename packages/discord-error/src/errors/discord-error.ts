export type ErrorBody = DiscordErrorBody | OAuthErrorBody;

export interface OAuthErrorBody {
	error: string;
	error_description?: string;
}

export interface DiscordErrorBody {
	code: number;
	message: string;
	errors?: APIError;
}

export interface ErrorGroup {
	_errors: APIError[];
}

export interface ErrorField {
	code: string;
	message: string;
}

export type APIError =
	| ErrorGroup
	| ErrorField
	| { [k: string]: APIError }
	| string;

/**
 * Differentiates a Discord error from an OAuth error
 * @param error - the body text of the error to check
 * @returns whether the error is a Discord error
 */
export function isDiscordError(error: ErrorBody): error is DiscordErrorBody {
	return "code" in error;
}

/**
 * Determines whether the value is a group of errors
 * @param error - The record or piece of the record returned by the Discord API to check
 * @returns whether the value contains a group of errors
 */
export function isErrorGroup(error: APIError): error is ErrorGroup {
	if (error === null || typeof error !== "object") {
		return false;
	}

	return "_errors" in error;
}

/**
 * Determines whether the value is an error value
 * @param error - The record or piece of the record returned by the Discord API to check
 * @returns whether the value is an error value
 */
export function isErrorField(error: APIError): error is ErrorField {
	if (error === null || typeof error !== "object") {
		return false;
	}

	return "message" in error;
}

/**
 * Parses the errors returned by the Discord API into an error message string
 * @param error - The record returned by the Discord API
 * @returns The parsed error message
 */
export function getMessage(error: ErrorBody) {
	if (isDiscordError(error)) {
		const stack = [];

		if (error.message) {
			stack.push(error.message);
		}

		if (error.errors) {
			stack.push(...Array.from(parse(error.errors)));
		}

		if (stack.length > 0) {
			return stack.join("\n");
		}

		return "Unknown Error";
	}

	return error.error_description ?? "No Description";
}

function* parse(
	value: APIError,
	key: string | null = null
): IterableIterator<string> {
	if (typeof value === "string") {
		// eslint-disable-next-line no-negated-condition
		return yield `${key != null ? `${key}: ` : ""}${value}`;
	}

	// Handle leaf fields
	if (isErrorField(value)) {
		// eslint-disable-next-line no-negated-condition
		const prefix = key != null ? `${key}[${value.code}]` : `${value.code}`;
		return yield `${prefix}: ${value.message.trim()}`;
	}

	if (isErrorGroup(value)) {
		for (let i = 0; i < value._errors.length; i++) {
			const error = value._errors[i];
			const nextKey = getNextKey(key, i.toString());
			yield* parse(error, nextKey);
		}
	} else {
		// Handle nested fields
		for (const [label, item] of Object.entries(value)) {
			const nextKey = getNextKey(key, label);

			if (typeof item === "string") {
				yield item;
			} else {
				yield* parse(item, nextKey);
			}
		}
	}
}

function getNextKey(key: string | null, label: string) {
	if (label.startsWith("_")) {
		return key;
	}

	if (key != null) {
		if (Number.isNaN(Number(label))) {
			return `${key}.${label}`;
		}

		return `${key}[${label}]`;
	}

	return label;
}

export class DiscordError extends Error {
	/**
	 * The error code returned by the Discord API
	 */
	code: string | number;

	/**
	 * The request that caused the error
	 */
	request: Request;

	/**
	 * The error response
	 */
	response: Response;

	/**
	 * The raw JSON body of the error response. If you are looking at the data
	 * programmatically, use this field in conjunction with the `code` field.
	 */
	raw: ErrorBody;

	/**
	 * Creates a new DiscordError
	 * @param request - The request that caused the error
	 * @param response - The error response
	 * @param code - The error code
	 * @param raw - The raw JSON body of the error response
	 */
	constructor(
		request: Request,
		response: Response,
		code: string | number,
		raw: ErrorBody
	) {
		super(getMessage(raw));
		this.request = request;
		this.response = response;
		this.code = code;
		this.raw = raw;
	}

	/**
	 * The Discord error name and error code
	 */
	get name() {
		return `${DiscordError.name}[${this.code}]`;
	}
}
