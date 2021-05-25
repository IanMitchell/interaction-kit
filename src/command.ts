import type { ApplicationCommand} from './api/api'
import { Input } from './components/inputs';
import Interaction from './interaction'

type CommandArgs = {
  name: string,
  description: string,
  defaultPermission?: boolean,
  options: Input[],
  handler: (interaction: Interaction) => unknown
}

export default class Command {
  name: string;
  #description: string;
  #defaultPermission: boolean;
  #options: Input[];
  handler: (interaction: Interaction) => unknown;

  constructor({ name, description, options, handler, defaultPermission = false }: CommandArgs) {
    this.name = name;
    this.#description = description;
    this.#options = options;
    this.#defaultPermission = defaultPermission;
    this.handler = handler;
  }

  group() {
    throw new Error("Unimplemented");
  }

  subcommand() {
    throw new Error("Unimplemented");
  }

  // TODO: Come up with a better name
  isEqualTo(schema: ApplicationCommand): boolean {
    if (this.name !== schema.name || this.#description !== schema.description || this.#defaultPermission !== schema.default_permission) {
      return false;
    }

    return true;

    // TODO: Check the below
    // return schema.options?.every(option => {
    //   option.name
    //   option.description
    //   option.type
    //   option.required
    //   option.choices
    //   option.options
    // })
  }

  toJSON() {

  }
}
