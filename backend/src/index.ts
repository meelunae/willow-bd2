import { fastify, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";

const trackRoutes = require("./routes/track.routes");

const server = fastify({
  logger: {
    level: "info",
  },
});

server
  .listen({ port: 3000, host: "0.0.0.0" })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    server.log.error(`Error starting server: ${err}`);
    process.exit(1);
  });
server.register(fastifyCors);
server.register(trackRoutes, { prefix: "/api/tracks" });

mongoose
  .connect("mongodb://mongo:27017/willow")
  .then(() => console.log("MongoDB connected"))
  .then(() => server.log.info({ actor: "MongoDB" }, "Connected."))
  .catch((err) => {
    server.log.error({ actor: "MongoDB" }, `Error during connection: ${err}`);
    process.exit(1);
  });
