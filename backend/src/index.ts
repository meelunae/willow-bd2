import { fastify, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import mongoose from "mongoose";
import { isAdmin, authenticate } from "./middlewares/auth.middleware";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'] as const;
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Type assertion for required environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

const analyticsRoutes = require("./routes/analytics.routes");
const authRoutes = require("./routes/auth.routes");
const albumRoutes = require("./routes/album.routes");
const trackRoutes = require("./routes/track.routes");

const server = fastify({
  logger: {
    level: "info",
  },
});

server
  .listen({ 
    port: parseInt(process.env.PORT || '3000'), 
    host: process.env.HOST || '0.0.0.0' 
  })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    server.log.error(`Error starting server: ${err}`);
    process.exit(1);
  });

server.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

server.register(jwt, {
  secret: JWT_SECRET,
});
server.decorate("authenticate", authenticate);
server.decorate("isAdmin", isAdmin);
server.register(analyticsRoutes, { prefix: "/api/analytics" });
server.register(authRoutes, { prefix: "/api/auth" });
server.register(trackRoutes, { prefix: "/api/tracks" });
server.register(albumRoutes, { prefix: "/api/albums" });

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .then(() => server.log.info({ actor: "MongoDB" }, "Connected."))
  .catch((err) => {
    server.log.error({ actor: "MongoDB" }, `Error during connection: ${err}`);
    process.exit(1);
  });
