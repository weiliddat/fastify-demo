/**
 * https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
 */

import Fastify from "fastify";
import { FromSchema } from "json-schema-to-ts";

const server = Fastify({
  logger: true,
});

const data: Record<string, string> = {
  hello: "world",
  foo: "bar",
  parcel: "lab",
};

interface RequestQueryString {
  search: string;
  limit: number;
}

server.register(
  async (server) => {
    server.get<{ Querystring: RequestQueryString }>("/", async (request) => {
      return {
        data: data[request.query.search].substring(request.query.limit),
      };
    });
  },
  {
    prefix: "/v1",
  },
);

const searchQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    search: {
      type: "string",
    },
    limit: {
      type: "number",
      minimum: 0,
    },
  },
} as const;

server.register(
  async (server) => {
    server.get<{ Querystring: RequestQueryString }>(
      "/",
      {
        schema: { querystring: searchQuerySchema },
      },
      async (request) => {
        return {
          data: request.query,
        };
      },
    );
  },
  {
    prefix: "/v2",
  },
);

server.register(
  async (server) => {
    server.get<{ Querystring: FromSchema<typeof searchQuerySchema> }>(
      "/",
      {
        schema: { querystring: searchQuerySchema },
      },
      async (request) => ({ data: request.query }),
    );
  },
  {
    prefix: "/v3",
  },
);

server.ready((err) => {
  if (err) {
    server.log.error(err);
    throw new Error("server did not start");
  }

  server.listen(8042).catch(server.log.error);
});
