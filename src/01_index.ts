/**
 * https://www.fastify.io/docs/latest/Reference/Server/
 */

import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.get("/", async () => "Hello :)");

server.ready(() => {
  server.listen(8042).catch(server.log.error);
});
