import type { ApplicationCommand} from './api/api'
import Application from './application';
import { Input } from './components/inputs';
import Interaction from './interaction'

type CommandArgs = {
  name: string,
  description: string,
  defaultPermission?: boolean,
  options?: Input[],
  handler: (interaction: Interaction) => unknown
}

export default class Command {
  name: string;
  #description: string;
  #defaultPermission: boolean;
  #options: Map<string, Input>;
  handler: (interaction: Interaction, application: Application) => unknown;

  constructor({ name, description, options, handler, defaultPermission = true }: CommandArgs) {
    this.name = name;
    this.#description = description;
    this.#defaultPermission = defaultPermission;
    this.handler = handler;
    this.#options = new Map();


    options?.forEach(option => this.#options.set(option.name.toLowerCase(), option))
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
    const payload = {
      name: this.name,
      description: this.#description
    }

    if (this.#defaultPermission == false) {
      payload.default_permission = this.#defaultPermission
    }

    if (this.#options.length > 0) {
      // TODO: Implement this
      // ApplicationCommandOption[]
    }

    return payload;
  }
}
