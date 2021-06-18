import { Component, ComponentType } from "./definitions";

export interface Serializable {
	serialize(): unknown;
}

export interface SerializableComponent extends Serializable {
	get type(): ComponentType;
	serialize(): Component;
}
