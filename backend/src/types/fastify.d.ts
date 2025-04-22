import { FastifyRequest, FastifyReply } from "fastify";
import { IUser } from "../models/user.model";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    isAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  export interface FastifyRequest {
    user?: IUser;
  }

  interface FastifyRequest {
    currentUser: IUser | undefined;
  }
}
