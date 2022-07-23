import type { SerializableComponent } from "../interfaces";
import { Button } from "./button";
import Select from "./select";

export type ExecutableComponent = Button | Select;

export function isExecutableComponent(
	component: SerializableComponent
): component is ExecutableComponent {
	if (component instanceof Button) {
		return true;
	}

	if (component instanceof Select) {
		return true;
	}

	return false;
}
