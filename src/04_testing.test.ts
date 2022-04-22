import { test } from "tap";
import { buildServer } from "./04_testing";

test("server builds without throwing an error", async (t) => {
  await t.resolves(async () => await buildServer());
});

test("requesting / returns a greeting", async (t) => {
  const server = await buildServer();

  t.teardown(() => server.close());

  const response = await server.inject({
    method: "GET",
    url: "/",
  });

  t.equal(response.statusCode, 200);
  t.equal(response.body, "Hello :)");
});

test("requesting /nonexistentroute returns a 404", async (t) => {
  const server = await buildServer();

  t.teardown(() => server.close());

  const response = await server.inject({
    method: "GET",
    url: "/nonexistentroute",
  });

  t.equal(response.statusCode, 404);
});
