import type { FastifyRequest } from "fastify";
import nacl from "tweetnacl";

export function validateRequest(request: FastifyRequest, publicKey: string) {
  const signature = request.headers["x-signature-ed25519"];
  const timestamp = request.headers["x-signature-timestamp"];
  const body = request.rawBody;

  if (signature == null || timestamp == null || body == null) {
    return false;
  }

  return nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(publicKey, "hex")
  );
}
