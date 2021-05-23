import { Input } from './components/inputs';
import Interaction from './interaction'

type CommandArgs = {
  name: string,
  description: string,
  options: Input[],
  handler: (interaction: Interaction) => unknown
}

export default class Command {
  name: string;
  #description: string;
  #options: Input[];
  handler: (interaction: Interaction) => unknown;

  constructor({ name, description, options, handler }: CommandArgs) {
    this.name = name;
    this.#description = description;
    this.#options = options;
    this.handler = handler;
  }

  group() {
    throw new Error("Unimplemented");
  }

  subcommand() {
    throw new Error("Unimplemented");
  }
}
