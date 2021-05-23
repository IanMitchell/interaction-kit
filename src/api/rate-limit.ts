// https://discord.com/developers/docs/topics/rate-limits
export function isRatelimited(response: Response) {

}

// TODO: what is this value set to?
export function isGlobalRateLimit(response: Response) {
  return response.headers.has('X-RateLimit-Global');
}

export function getRemainingRequests(response: Response) {

}

export function getRateLimitReset(response: Response) {

}

export function getRateLimitBucket(response: Response) {

}
