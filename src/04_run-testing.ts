import { buildServer } from "./04_testing";

const server = buildServer();

server.listen(8042, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
