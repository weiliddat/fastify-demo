/**
 * https://www.fastify.io/docs/latest/Reference/Decorators/
 */

import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const server = Fastify({
  logger: true,
});

declare module "fastify" {
  interface FastifyInstance {
    models: {
      user: {
        create: () => any;
        update: () => any;
        list: () => string[];
      };
    };
  }
}

async function modelsPlugin(server: FastifyInstance) {
  server.decorate("models", {
    user: {
      create() {},
      update() {},
      list() {
        return ["john", "jane"];
      },
    },
  });
}

async function baseRoutesPlugin(server: FastifyInstance) {
  server.get("/", async (request, reply) => ({ users: server.models.user.list() }));
}

async function serverV1(server: FastifyInstance) {
  await server.register(fp(modelsPlugin));
  await server.register(fp(baseRoutesPlugin));
}

server.register(serverV1, { prefix: "/v1" });

server.ready(() => {
  server.listen(8042).catch(server.log.error);
});
