/**
 * https://www.fastify.io/docs/latest/Reference/Lifecycle/
 * https://www.fastify.io/docs/latest/Reference/Hooks/
 */

import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const server = Fastify({
  logger: true,
});

async function authPlugin(server: FastifyInstance) {
  server.addHook("onRequest", async (request, reply) => {
    if (request.headers['token'] !== '12345') {
      reply.status(401).send('Invalid auth!')
    }
  })
}

async function baseRoutesPlugin(server: FastifyInstance) {
  server.get("/", async () => ({ foo: "bar!" }));
}

async function serverV1(server: FastifyInstance) {
  await server.register(fp(authPlugin));
  await server.register(fp(baseRoutesPlugin));
}

server.register(serverV1, { prefix: "/v1" });

server.ready(() => {
  server.listen(8042).catch(server.log.error);
});
