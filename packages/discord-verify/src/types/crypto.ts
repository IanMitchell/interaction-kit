interface SubtleCryptoHashAlgorithm {
	name: string;
}

interface SubtleCryptoSignAlgorithm {
	name: string;
	hash?: string | SubtleCryptoHashAlgorithm;
	dataLength?: number;
	saltLength?: number;
}

interface CryptoKeyKeyAlgorithm {
	name: string;
}

interface CryptoKeyAesKeyAlgorithm {
	name: string;
	length: number;
}

interface CryptoKeyHmacKeyAlgorithm {
	name: string;
	hash: CryptoKeyKeyAlgorithm;
	length: number;
}

interface CryptoKeyRsaKeyAlgorithm {
	name: string;
	modulusLength: number;
	publicExponent: ArrayBuffer;
	hash?: CryptoKeyKeyAlgorithm;
}

interface CryptoKeyEllipticKeyAlgorithm {
	name: string;
	namedCurve: string;
}

interface CryptoKeyVoprfKeyAlgorithm {
	name: string;
	hash: CryptoKeyKeyAlgorithm;
	namedCurve: string;
}

interface CryptoKeyOprfKeyAlgorithm {
	name: string;
	namedCurve: string;
}

type CryptoKeyAlgorithmVariant =
	| CryptoKeyKeyAlgorithm
	| CryptoKeyAesKeyAlgorithm
	| CryptoKeyHmacKeyAlgorithm
	| CryptoKeyRsaKeyAlgorithm
	| CryptoKeyEllipticKeyAlgorithm
	| CryptoKeyVoprfKeyAlgorithm
	| CryptoKeyOprfKeyAlgorithm;

interface CryptoKey {
	readonly type: string;
	readonly extractable: boolean;
	readonly algorithm: CryptoKeyAlgorithmVariant;
	readonly usages: string[];
}

export interface SubtleCrypto {
	verify(
		algorithm: string | SubtleCryptoSignAlgorithm,
		key: CryptoKey,
		signature: ArrayBuffer | ArrayBufferView,
		data: ArrayBuffer | ArrayBufferView
	): Promise<boolean>;
	importKey(
		format: string,
		keyData: ArrayBuffer,
		algorithm: string | SubtleCryptoImportKeyAlgorithm,
		extractable: boolean,
		keyUsages: string[]
	): Promise<CryptoKey>;
}

interface SubtleCryptoHashAlgorithm {
	name: string;
}

export interface SubtleCryptoImportKeyAlgorithm {
	name: string;
	hash?: string | SubtleCryptoHashAlgorithm;
	length?: number;
	namedCurve?: string;
	compressed?: boolean;
}
