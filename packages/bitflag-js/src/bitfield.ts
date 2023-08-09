export type BitFlags = Record<string, bigint>;

export type BitFlagResolvable =
	| number
	| bigint
	| BitField
	| BitFlagResolvable[];

export class BitField {
	#value: bigint;

	constructor(...value: BitFlagResolvable[]) {
		if (value.length > 0) {
			this.#value = BitField.resolve(value);
		} else {
			this.#value = 0n;
		}
	}

	get value() {
		return this.#value;
	}

	set(flag: BitFlagResolvable, value: boolean) {
		if (value) {
			this.add(flag);
		} else {
			this.remove(flag);
		}

		return this;
	}

	add(...flags: BitFlagResolvable[]) {
		const bit = BitField.resolve(flags);
		this.#value |= bit;
		return this;
	}

	has(...flags: BitFlagResolvable[]) {
		const bit = BitField.resolve(flags);
		return (this.#value & bit) === bit;
	}

	remove(...flags: BitFlagResolvable[]) {
		const bit = BitField.resolve(flags);
		this.#value &= ~bit;
		return this;
	}

	mask(...flags: BitFlagResolvable[]) {
		const mask = BitField.resolve(flags);
		return this.#value & mask;
	}

	*[Symbol.iterator]() {
		let index = 0n;
		let bit = 0n;

		while (this.#value > (bit = 1n << index)) {
			const field = this.#value & bit;

			if (field) {
				yield field;
			}

			index++;
		}
	}

	toJSON() {
		if (this.#value > Number.MAX_SAFE_INTEGER) {
			return this.toString();
		}

		return Number(this.#value);
	}

	toString() {
		return this.#value.toString();
	}

	static resolve(...values: BitFlagResolvable[]): bigint {
		return values.reduce<bigint>((resolved, item) => {
			if (Array.isArray(item)) {
				return resolved | BitField.resolve(...item);
			}

			switch (typeof item) {
				case "bigint":
					return resolved | item;
				case "number":
					return resolved | BigInt(item);
				case "object":
					if (item instanceof BitField) {
						return item.value;
					}

					throw new TypeError("Must use BigInt, BitField, or Number value");
				default:
					throw new TypeError("Must use BigInt, BitField, or Number value");
			}
		}, 0n);
	}
}
