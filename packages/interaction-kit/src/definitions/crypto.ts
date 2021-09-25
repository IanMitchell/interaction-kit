/**
 * These type definitions come from the official Node.js API docs. They should
 * be defined with references back to the documentation section.
 */

declare module "crypto" {
	// https://nodejs.org/api/webcrypto.html#webcrypto_class_aesimportparams
	interface AesImportParams {
		name: "AES-CTR" | "AES-CBC" | "AES-GCM" | "AES-KW";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_ecdsaparams
	interface EcdsaParams {
		hash:
			| "SHA-1"
			| "SHA-256"
			| "SHA-384"
			| "SHA-512"
			| { name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" };
		name: "ECDSA";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_eckeyimportparams
	interface EcKeyImportParams {
		name: "ECDSA" | "ECDH";
		namedCurve:
			| "P-256"
			| "P-384"
			| "P-521"
			| "NODE-ED25519"
			| "NODE-ED448"
			| "NODE-X25519"
			| "NODE-X448";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_hmacparams
	interface HmacParams {
		name: "HMAC";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_hmacimportparams
	interface HmacImportParams {
		hash:
			| "SHA-1"
			| "SHA-256"
			| "SHA-384"
			| "SHA-512"
			| { name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" };
		length?: number;
		name: "HMAC";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_nodedsaimportparams
	interface NodeDsaImportParams {
		hash:
			| "SHA-1"
			| "SHA-256"
			| "SHA-384"
			| "SHA-512"
			| { name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" };
		name: "NODE-DSA";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_nodedhimportparams
	interface NodeDhImportParams {
		name: "NODE-DH";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_nodedsasignparams
	interface NodeDsaSignParams {
		name: "NODE-DSA";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_nodeedkeyimportparams
	interface NodeEdKeyImportParams {
		name: "NODE-ED25519" | "NODE-ED448" | "ECDH";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_nodescryptimportparams
	interface NodeScryptImportParams {
		name: "NODE-SCRYPT";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_pbkdf2importparams
	interface Pbkdf2ImportParams {
		name: "PBKDF2";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_rsahashedimportparams
	interface RsaHashedImportParams {
		hash:
			| "SHA-1"
			| "SHA-256"
			| "SHA-384"
			| "SHA-512"
			| { name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" };
		name: "RSASSA-PKCS1-v1_5" | "RSA-PSS" | "RSA-OAEP";
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_rsapssparams
	interface RsaPssParams {
		name: "RSA-PSS";
		saltLength: number;
	}

	// https://nodejs.org/api/webcrypto.html#webcrypto_class_rsasignparams
	interface RsaSignParams {
		name: "RSASSA-PKCS1-v1_5";
	}

	// https://nodejs.org/api/webcrypto.html
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace webcrypto {
		// https://nodejs.org/api/webcrypto.html#webcrypto_class_cryptokey
		// eslint-disable-next-line @typescript-eslint/no-extraneous-class
		class subtle {
			// https://nodejs.org/api/webcrypto.html#webcrypto_subtle_importkey_format_keydata_algorithm_extractable_keyusages
			static importKey(
				format: string,
				keyData: ArrayBuffer | Int8Array | DataView | Buffer | KeyObject,
				algorithm:
					| RsaHashedImportParams
					| EcKeyImportParams
					| HmacImportParams
					| AesImportParams
					| Pbkdf2ImportParams
					| NodeDsaImportParams
					| NodeDhImportParams
					| NodeScryptImportParams
					| NodeEdKeyImportParams,
				extractable: boolean,
				keyUsages: string[]
			): Promise<CryptoKey>;

			// https://nodejs.org/api/webcrypto.html#webcrypto_subtle_verify_algorithm_key_signature_data
			static verify(
				algorithm:
					| RsaSignParams
					| RsaPssParams
					| EcdsaParams
					| HmacParams
					| NodeDsaSignParams,
				key: CryptoKey,
				signature: ArrayBuffer | Int8Array | DataView | Buffer,
				data: ArrayBuffer | Int8Array | DataView | Buffer
			): Promise<boolean>;
		}
	}
}
