/**
 * https://www.fastify.io/docs/latest/Reference/Encapsulation/
 * https://www.fastify.io/docs/latest/Guides/Plugins-Guide/
 */

import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const server = Fastify({
  logger: true,
});

async function baseRoutesPlugin(server: FastifyInstance) {
  server.get("/", async () => ({ foo: "bar!" }));
}

async function wrapResponsePlugin(server: FastifyInstance) {
  server.addHook("preSerialization", async (request, reply, payload) => {
    return {
      success: true,
      data: payload,
    };
  });
}

async function serverV1(server: FastifyInstance) {
  await server.register(fp(baseRoutesPlugin));
}

server.register(serverV1, { prefix: "/v1" });

async function serverV2(server: FastifyInstance) {
  await server.register(fp(wrapResponsePlugin));

  await server.register(fp(baseRoutesPlugin));
}

server.register(serverV2, { prefix: "/v2" });

server.ready(() => {
  server.listen(8042).catch(server.log.error);
});
