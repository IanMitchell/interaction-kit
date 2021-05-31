import type {FastifyRequest} from 'fastify';
import nacl from 'tweetnacl';

export function validateRequest(request: FastifyRequest, publicKey: string) {
	const signature = request.headers['x-signature-ed25519'] as string;
	const timestamp = request.headers['x-signature-timestamp'] as string;
	const body = request.rawBody as string;

	if (!signature || !timestamp || !body) {
		return false;
	}

	return nacl.sign.detached.verify(
		Buffer.from(timestamp + body),
		Buffer.from(signature, 'hex'),
		Buffer.from(publicKey, 'hex')
	);
}
