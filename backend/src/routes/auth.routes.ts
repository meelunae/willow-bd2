import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/user.model";
import jwt, { SignOptions } from "jsonwebtoken";

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

async function routes(fastify: FastifyInstance, options: Object) {
  fastify.post<{ Body: RegisterBody }>("/register", async (request, reply) => {
    try {
      const { username, email, password } = request.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return reply.status(400).send({
          error: "Email or username already in use",
        });
      }

      const user = new User({
        username,
        email,
        password,
        role: "user",
      });

      await user.save();

      // Generate token with proper typing
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      reply.send({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Login user
  fastify.post<{ Body: LoginBody }>("/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      // Generate token with proper typing
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      reply.send({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Get current user (protected route)
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        // User is already attached to request in authenticate middleware
        const user = request.currentUser;

        reply.send({
          user: {
            id: user!._id,
            username: user!.username,
            email: user!.email,
            role: user!.role,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Internal server error" });
      }
    },
  );
}

export default routes;
