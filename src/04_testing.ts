/**
 * https://www.fastify.io/docs/latest/Guides/Testing/
 */

import Fastify from "fastify";

export function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.get("/", async () => "Hello :)");
  return server;
}
