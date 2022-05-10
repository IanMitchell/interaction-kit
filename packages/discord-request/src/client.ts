import { RequestData, RequestOptions, RequestMethod } from "./types";
import { Manager, ManagerArgs } from "./manager";

export default class Client {
	#manager: Manager;

	constructor(options: ManagerArgs = {}) {
		this.#manager = new Manager(options);
	}

	setToken(token: string) {
		this.#manager.setToken(token);
		return this;
	}

	setUserAgent(value: string) {
		this.#manager.config.userAgent = value;
		return this;
	}

	setAbortSignal(signal: AbortSignal) {
		this.#manager.shutdownSignal = signal;
	}

	async get(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Get,
			...options,
		});
	}

	async post(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Post,
			...options,
		});
	}

	async put(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Put,
			...options,
		});
	}

	async patch(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Patch,
			...options,
		});
	}

	async delete(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Delete,
			...options,
		});
	}

	async #request(data: RequestData) {
		return this.#manager.queue(data);
	}
}
