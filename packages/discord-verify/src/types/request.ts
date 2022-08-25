interface Body {
	text(): Promise<string>;
}

interface Headers {
	get(name: string): string | null;
}

export interface Request extends Body {
	readonly headers: Headers;
	clone(): Request;
}
