import Bucket from './bucket';
import APIRequest from './request';

export enum Method {
	get = 'GET',
	put = 'PUT',
	post = 'POST',
	delete = 'DELETE',
	patch = 'PATCH',
}

export function getAPIOffset(serverDate: string): number {
	return new Date(serverDate).getTime() - Date.now();
}

export function calculateAPIReset(reset: string, serverDate: string): number {
	return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

export default class APIClient {
	buckets: Map<string, Bucket> = new Map();
	authorization: string;
	globalLimit = 50;
	globalRemaining: number = this.globalLimit;
	globalReset: number | undefined;
	globalDelay: Promise<void> | undefined;

	constructor(token: string) {
		this.authorization = `Bot ${token}`;
	}

	async enqueue(request: APIRequest): Promise<object | Buffer | undefined> {
		if (!this.buckets.has(request.route)) {
			this.buckets.set(request.route, new Bucket(this, request.route));
		}

		return this.buckets.get(request.route)?.push(request);
	}

	async get(path: string): Promise<object | Buffer | undefined> {
		return this.enqueue(
			new APIRequest({
				path,
				method: Method.get,
				headers: {authorization: this.authorization},
			})
		);
	}

	async put(
		path: string,
		body?: unknown
	): Promise<object | Buffer | undefined> {
		return this.enqueue(
			new APIRequest({
				path,
				method: Method.put,
				headers: {authorization: this.authorization},
				body,
			})
		);
	}

	async post(
		path: string,
		body: unknown
	): Promise<object | Buffer | undefined> {
		return this.enqueue(
			new APIRequest({
				path,
				method: Method.post,
				headers: {authorization: this.authorization},
				body,
			})
		);
	}

	async patch(
		path: string,
		body: unknown
	): Promise<object | Buffer | undefined> {
		return this.enqueue(
			new APIRequest({
				path,
				method: Method.patch,
				headers: {authorization: this.authorization},
				body,
			})
		);
	}

	async delete(path: string): Promise<object | Buffer | undefined> {
		return this.enqueue(
			new APIRequest({
				path,
				method: Method.delete,
				headers: {authorization: this.authorization},
			})
		);
	}
}
