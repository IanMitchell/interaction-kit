import type { SerializableComponent } from "../interfaces.js";
import { Button } from "./button.js";
import Select from "./select.js";

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
