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
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	| { [k: string]: APIError }
	| string;

export function isDiscordError(error: ErrorBody): error is DiscordErrorBody {
	return "code" in error;
}

export function isErrorGroup(error: APIError): error is ErrorGroup {
	if (error === null || typeof error !== "object") {
		return false;
	}

	return "_errors" in error;
}

export function isErrorField(error: APIError): error is ErrorField {
	return !isErrorGroup(error);
}

export default class DiscordError extends Error {
	code: string | number;
	request: Request;
	response: Response;
	raw: ErrorBody;

	constructor(
		request: Request,
		response: Response,
		code: string | number,
		raw: ErrorBody
	) {
		super(DiscordError.#getMessage(raw));
		this.request = request;
		this.response = response;
		this.code = code;
		this.raw = raw;
	}

	static #getMessage(error: ErrorBody) {
		if (isDiscordError(error)) {
			const stack = [];

			if (error.message) {
				stack.push(error.message);
			}

			if (error.errors) {
				stack.push(...this.#parse(error.errors));
			}

			if (stack.length > 0) {
				return stack.join("\n");
			}

			return "Unknown Error";
		}

		return error.error_description ?? "No Description";
	}

	static *#parse(
		value: APIError,
		key: string | null = null
	): IterableIterator<string> {
		// Handle leaf fields
		if (isErrorField(value)) {
			// eslint-disable-next-line no-negated-condition
			const prefix = key != null ? `${key}[${value.code}]` : `${value.code}`;
			return yield `${prefix}: ${value.message.trim()}`;
		}

		// Handle nested fields
		for (const [label, item] of Object.entries(value)) {
			const nextKey = DiscordError.#getNextKey(key, label);

			if (typeof item === "string") {
				yield item;
			} else if (isErrorGroup(item)) {
				for (const error of item._errors) {
					yield* this.#parse(error, nextKey);
				}
			} else {
				yield* this.#parse(item, nextKey);
			}
		}
	}

	static #getNextKey(key: string | null, label: string) {
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

	get name() {
		return `${DiscordError.name}[${this.code}]`;
	}
}
