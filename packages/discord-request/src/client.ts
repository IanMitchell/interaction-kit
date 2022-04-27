import { RequestData, RequestOptions, RequestMethod } from "./types";
import { Manager } from "./manager";

export default class Client {
	#manager: Manager;

	constructor(options = {}) {
		this.#manager = new Manager(options);
	}

	setToken(token: string) {
		this.#manager.setToken(token);
		return this;
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
