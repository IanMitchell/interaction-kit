import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  Interaction as InteractionBody,
  InteractionType,
  InteractionResponse,
  ApplicationCommandInteractionDataOption,
} from './api/api';
import type { Embed } from './components/embed'

export default class Interaction {
  type: InteractionType;
  name: string;
  response: FastifyReply;
  #options: Map<string, ApplicationCommandInteractionDataOption>;

  constructor(request: FastifyRequest, response: FastifyReply) {
    this.response = response;
    this.type = request.body.type;
    this.name = request.body?.data?.name?.toLowerCase();
    this.#options = new Map();

    request.body?.data?.options?.forEach(option => {
      this.#options.set(option.name.toLowerCase(), option);
    });
  }

  reply({
    message,
    embeds,
    ephemeral = false,
  }: {
    message: string;
    embeds?: Embed[];
    ephemeral: boolean;
  }) {
    const payload: InteractionResponse = {
      type: 4,
      data: {
        content: message,
      },
    };

    if (ephemeral && payload?.data != null) {
      payload.data.flags = 64;
    }

    return this.response.status(200).send(payload);
  }

  get options() {
    return new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (this.#options?.has(property)) {
            return this.#options.get(property).value;
          }

          return null;
        },
      }
    );
  }
}
