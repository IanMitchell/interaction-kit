// https://discord.com/developers/docs/topics/rate-limits
import {FastifyRequest} from 'fastify';

// TODO: what is this value set to?
export function isGlobalRateLimit(response: FastifyRequest) {
	return Boolean(response.headers['X-RateLimit-Global']);
}

export function isRatelimited(_response: FastifyRequest) {
	throw new Error('Function not implemented.');
}

export function getRemainingRequests(_response: FastifyRequest) {
	throw new Error('Function not implemented.');
}

export function getRateLimitReset(_response: FastifyRequest) {
	throw new Error('Function not implemented.');
}

export function getRateLimitBucket(_response: FastifyRequest) {
	throw new Error('Function not implemented.');
}
