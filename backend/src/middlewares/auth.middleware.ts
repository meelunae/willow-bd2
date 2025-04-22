import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  userId: string;
  role: string;
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return reply.status(401).send({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }

    request.currentUser = user;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid token" });
  }
}

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.currentUser || request.currentUser.role !== "admin") {
    return reply.status(403).send({ error: "Admin access required" });
  }
}
