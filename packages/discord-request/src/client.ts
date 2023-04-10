import pkg from "../package.json" assert { type: "json" };
import type { Condense, RequestData, RequestOptions } from "./definitions.js";
import { AUDIT_LOG_LIMIT, RequestMethod } from "./definitions.js";
import { request } from "./request.js";

export type ClientConfig = {
	api: string;
	cdn: string;
	headers: Record<string, string>;
	timeout: number;
	userAgent: string;
	version: number;
};

export type Callbacks = {
	abortSignal: AbortSignal | null | undefined;
	onRequest: ((path: string, init: RequestInit) => void) | undefined;
};

export class Client {
	#token: string | null = null;
	#abortSignal: AbortSignal | null | undefined;
	#config: ClientConfig;
	#callbacks: Partial<Callbacks>;

	/**
	 * Creates a new Client for accessing the Discord API. This will
	 * automatically queue requests and handle rate limits. You **should not**
	 * create multiple instances of this class.
	 * @param options - Configuration options for the Client.
	 * @returns The Client instance.
	 */
	constructor({
		// Request Config
		api,
		version,
		cdn,
		headers,
		userAgent,
		timeout,
		// Manager Options
		abortSignal,
		onRequest,
	}: Partial<ClientConfig> & Partial<Callbacks> = {}) {
		this.#config = {
			api: api ?? "https://discord.com/api",
			version: version ?? 10,
			cdn: cdn ?? "https://cdn.discordapp.com",
			headers: headers ?? {},
			userAgent: userAgent ?? `DiscordBot discord-request v${pkg.version}`,
			timeout: timeout ?? 15 * 1000,
		};

		this.#callbacks = {
			onRequest,
		};

		this.#abortSignal = abortSignal;
	}

	/**
	 * Sets the Client's Bot Token.
	 * @param token - The Discord Bot Token.
	 * @returns The Client instance
	 */
	setToken(token: string | null): this {
		this.#token = token;
		return this;
	}

	/**
	 * Get the Client's current User Agent.
	 */
	get userAgent(): string {
		return this.#config.userAgent;
	}

	/**
	 * Sets the Client's User Agent. This needs to include information about
	 * the library and version being used to access the Discord API.
	 */
	set userAgent(value: string) {
		this.#config.userAgent = `DiscordBot ${value}, discord-request v${pkg.version}`;
	}

	/**
	 * Get the Client's current abort signal. If this signal triggers, all
	 * pending requests will be aborted.
	 */
	get abortSignal(): AbortSignal | null | undefined {
		return this.#abortSignal;
	}

	/**
	 * Sets the Client's abort signal. If this signal triggers, all pending
	 * requests will be aborted.
	 */
	set abortSignal(signal: AbortSignal | null | undefined) {
		this.#abortSignal = signal;
	}

	/**
	 * Get the Client's current Discord API configuration. This includes the API
	 * URL, the API Version, and the CDN URL.
	 */
	get api(): { api: string; version: number; cdn: string } {
		return {
			api: this.#config.api,
			version: this.#config.version,
			cdn: this.#config.cdn,
		};
	}

	/**
	 * Sets the Client's Discord API configuration.
	 */
	set api({
		api,
		version,
		cdn,
	}: {
		api: string;
		version: number;
		cdn: string;
	}) {
		this.#config.api = api;
		this.#config.version = version;
		this.#config.cdn = cdn;
	}

	/**
	 * Get the current default headers that are sent with every request.
	 */
	get headers(): Record<string, string> {
		return this.#config.headers;
	}

	/**
	 * Sets the default headers to be sent with every request.
	 */
	set headers(headers: Record<string, string>) {
		this.#config.headers = headers;
	}

	/**
	 * Get the current default timeout for requests.
	 */
	get timeout(): number {
		return this.#config.timeout;
	}

	/**
	 * Sets the default timeout for requests.
	 */
	set timeout(value: number) {
		this.#config.timeout = value;
	}

	/**
	 * Get the current onRequest callback.
	 */
	get onRequest(): Callbacks["onRequest"] | undefined {
		return this.#callbacks.onRequest;
	}

	/**
	 * Sets the onRequest callback. This callback will be called before every
	 * request is sent.
	 */
	set onRequest(callback: Callbacks["onRequest"] | undefined) {
		this.#callbacks.onRequest = callback;
	}

	/**
	 * Sends an HTTP GET request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async get(
		path: string,
		options: Condense<RequestOptions> = {}
	): Promise<unknown> {
		return this.#request({
			method: RequestMethod.Get,
			path,
			...options,
		});
	}

	/**
	 * Sends an HTTP POST request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async post(
		path: string,
		options: Condense<RequestOptions> = {}
	): Promise<unknown> {
		return this.#request({
			method: RequestMethod.Post,
			path,
			...options,
		});
	}

	/**
	 * Sends an HTTP PUT request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async put(
		path: string,
		options: Condense<RequestOptions> = {}
	): Promise<unknown> {
		return this.#request({
			method: RequestMethod.Put,
			path,
			...options,
		});
	}

	/**
	 * Sends an HTTP PATCH request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async patch(
		path: string,
		options: Condense<RequestOptions> = {}
	): Promise<unknown> {
		return this.#request({
			method: RequestMethod.Patch,
			path,
			...options,
		});
	}

	/**
	 * Sends an HTTP DELETE request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async delete(
		path: string,
		options: Condense<RequestOptions> = {}
	): Promise<unknown> {
		return this.#request({
			method: RequestMethod.Delete,
			path,
			...options,
		});
	}

	async #request(data: RequestData) {
		const { path, init } = this.#getRequest(data);
		return request(this, path, init, this.#abortSignal);
	}

	#getRequest(data: RequestData) {
		const url = this.#getRequestURL(data);
		const headers = this.#getRequestHeaders(data);
		let body: RequestInit["body"];

		if (data.files != null) {
			headers.set("Content-Type", "multipart/form-data");
			const formData = new FormData();

			for (const [index, file] of data.files.entries()) {
				let { data } = file;

				if (!(data instanceof Blob)) {
					data = new Blob(data);
				}

				formData.append(`files[${file.id ?? index}]`, data, file.name);
			}

			if (data.formData != null) {
				for (const [key, value] of data.formData.entries()) {
					if (typeof value === "string") {
						formData.append(key, value);
					} else {
						formData.append(key, value, value.name);
					}
				}
			}

			if (data.body != null) {
				formData.append("payload_json", JSON.stringify(data.body));
			}

			body = formData;
		} else if (data.body != null) {
			if (data.rawBody) {
				body = data.body as BodyInit;
			} else {
				headers.set("Content-Type", "application/json");
				body = JSON.stringify(data.body);
			}
		}

		const fetchOptions: RequestInit = {
			method: data.method,
			headers,
			body: body ?? null,
		};

		return {
			path: url,
			init: fetchOptions,
		};
	}

	#getRequestURL(data: RequestData) {
		let url = this.#config.api;

		if (data.versioned !== false) {
			url += `/v${this.#config.version}`;
		}

		url += data.path;

		const query = data.query?.toString();
		if (query && query !== "") {
			url += `?${query}`;
		}

		return url;
	}

	#getRequestHeaders(data: RequestData) {
		const headers = new Headers(this.#config.headers);
		headers.set("User-Agent", this.#config.userAgent.trim());

		if (data.authorization !== false) {
			if (!this.#token) {
				throw new Error(
					"Expected token to be set for this request, but none was present"
				);
			}

			headers.set(
				"Authorization",
				`${data.authorizationPrefix ?? "Bot"} ${this.#token}`
			);
		}

		if (data.reason != null) {
			headers.set(
				"X-Audit-Log-Reason",
				encodeURIComponent(data.reason.substring(0, AUDIT_LOG_LIMIT))
			);
		}

		return headers;
	}
}
