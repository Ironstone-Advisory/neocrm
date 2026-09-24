import Fastify from "fastify";
import { DOMAIN_VERSION, supportedPartyKinds } from "@neocrm/domain";

const server = Fastify({
  logger: true
});

server.get("/health", async () => ({
  status: "ok",
  service: "neocrm-api",
  domainVersion: DOMAIN_VERSION
}));

server.get("/v1/meta", async () => ({
  domainVersion: DOMAIN_VERSION,
  supportedPartyKinds
}));

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  await server.listen({ host, port });
}

start().catch((error: unknown) => {
  server.log.error(error);
  process.exitCode = 1;
});

