import type { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import {
  Interaction as InteractionBody,
  InteractionType,
  InteractionResponse,
  ApplicationCommandInteractionDataOption,
} from './api/definitions';
import type { Embed } from './components/embed'
import { PermissionFlags } from './data/messages';

export default class Interaction {
  type: InteractionType;
  name: string;
  response: FastifyReply;
  #options: Map<string, ApplicationCommandInteractionDataOption>;

  constructor(request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>, response: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>) {
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
    // embeds,
    // components,
    ephemeral = false,
  }: {
    message: string;
    // embeds?: Embed[];
    // components?: Component[];
    ephemeral: boolean;
  }) {
    console.log('Replying!')
    const payload: InteractionResponse = {
      type: 4,
      data: {
        content: message,
      },
    };

    if (ephemeral && payload?.data != null) {
      payload.data.flags = PermissionFlags.EPHEMERAL;
    }

    return this.response.status(200).send(payload);
  }

  // get options() {
  //   return new Proxy(
  //     {},
  //     {
  //       get: (target, property, receiver) => {
  //         if (this.#options?.has(property)) {
  //           return this.#options.get(property).value;
  //         }

  //         return null;
  //       },
  //     }
  //   );
  }
}
