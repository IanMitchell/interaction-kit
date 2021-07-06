import { Component, ComponentType } from "./definitions";

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Serializable {
	serialize(): unknown;
}

export interface SerializableComponent extends Serializable {
	get id(): Component["custom_id"];
	get type(): ComponentType;
	serialize(): Component;
}
