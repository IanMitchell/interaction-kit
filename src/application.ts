import fastify, {FastifyRequest, FastifyResponse} from 'fastify';
import rawBody from 'fastify-raw-body';
import type Command from './command';
import {
  InteractionType,
  InteractionCallbackType } from './api/api'
  import { validateRequest } from './api/validate'
import Interaction from './interaction'

type ApplicationArgs = {
  applicationID: string,
  publicKey: string,
  token: string,
  port?: number,
}

type ServerCallback = (app) => (request: Request, response: Response) => unknown

export default class Application {
  #applicationID;
  #publicKey;
  #token;
  #commands;
  #port;

  constructor({applicationID, publicKey, token, port }: ApplicationArgs) {
    this.#applicationID = applicationID;
    this.#publicKey = publicKey;
    this.#token = token;
    this.#commands = new Map<string, Command>();
    this.#port = port ?? 3000;
  }

  addCommand(command: Command) {
    if (this.#commands.has(command.name.toLowerCase())) {
      throw new Error(`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`);
    }

    this.#commands.set(command.name.toLowerCase(), command);
  }

  addCommands(...commands: Command[]) {
    commands.forEach(command => this.addCommand(command));
  }

  // loadDirectory(path: string) {
    // TODO: Load all JS files from path
    // TODO: Create map of file/commandData
    // TODO: Create file listener on change
    // TODO: onChange, reload file and maybe emit command change events
  // }

  startServer(callback?: ServerCallback) {
    const server = fastify({
      logger: true,
    });

    server.register(rawBody, {
      runFirst: true,
    });

    server.addHook('preHandler', async (request: FastifyRequest, response: FastifyResponse) => {
      if (request.method === 'POST') {
        if (!validateRequest(request, this.#publicKey)) {
          server.log.info('Invalid Request');
          return response.status(401).send({ error: 'Bad request signature ' });
        }
      }
    });

    server.post('/', async (request: FastifyRequest, response: FastifyResponse) => {
      const interaction = new Interaction(request);

      if (interaction == null || interaction.type === InteractionType.PING) {
        server.log.info('Handling Ping request');
        response.send({
          type: InteractionCallbackType.PONG,
        });
      } else if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        if (this.#commands.has(interaction.name)) {
          return this.#commands.get(interaction.name)?.handler(interaction);
        } else {
          server.log.error('Unknown Type');
          response.status(400).send({ error: 'Unknown Type' });
        }
      } else {
        // TODO:
      }
    });


    if (callback != null) {
      callback(server);
    } else {
      server.listen(3000, async (error, address) => {
        if (error) {
          server.log.error(error);
          process.exit(1);
        }
        server.log.info(`server listening on ${address}`);
      });
    }
  }
}
