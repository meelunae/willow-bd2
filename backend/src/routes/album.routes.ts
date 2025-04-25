import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IAlbum, Album } from "../models/album.model";
import { Track } from "../models/track.model";

interface GetAlbumsQuery {
  page?: string;
  limit?: string;
}

async function routes(server: FastifyInstance, options: Object) {
  /**
   * Get all albums (public)
   */
  server.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const albums: IAlbum[] = await Album.find();
      reply.send(albums);
    } catch (err) {
      server.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  /**
   * Get all albums with pagination (admin only)
   */
  server.get<{ Querystring: GetAlbumsQuery }>(
    "/admin",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{ Querystring: GetAlbumsQuery }>,
      reply: FastifyReply,
    ) => {
      try {
        const page = parseInt(request.query.page || "1");
        const limit = parseInt(request.query.limit || "10");
        const skip = (page - 1) * limit;

        const [albums, total] = await Promise.all([
          Album.find().skip(skip).limit(limit),
          Album.countDocuments(),
        ]);

        reply.send({
          albums,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total,
        });
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Update album visibility (admin only)
   */
  server.patch<{ Params: { id: string }; Body: { is_visible: boolean } }>(
    "/:id/visibility",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { is_visible: boolean };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const album = await Album.findByIdAndUpdate(
          request.params.id,
          { is_visible: request.body.is_visible },
          { new: true },
        );

        if (!album) {
          return reply.status(404).send({ error: "Album not found" });
        }

        reply.send(album);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Delete album (admin only)
   */
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        // First, delete all tracks associated with this album
        await Track.deleteMany({ album_id: request.params.id });

        // Then delete the album
        const album = await Album.findByIdAndDelete(request.params.id);

        if (!album) {
          return reply.status(404).send({ error: "Album not found" });
        }

        reply.send({ 
          message: "Album and associated tracks deleted successfully",
          deletedTracks: await Track.countDocuments({ album_id: request.params.id })
        });
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Update album (admin only)
   */
  server.patch<{
    Params: { id: string };
    Body: { album_name: string; release_date: string };
  }>(
    "/:id",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { album_name: string; release_date: string };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const album = await Album.findByIdAndUpdate(
          request.params.id,
          {
            album_name: request.body.album_name,
            release_date: request.body.release_date,
          },
          { new: true },
        );

        if (!album) {
          return reply.status(404).send({ error: "Album not found" });
        }

        reply.send(album);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Create album (admin only)
   */
  server.post<{ Body: { album_name: string; release_date: string } }>(
    "/",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{
        Body: { album_name: string; release_date: string };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const album = new Album({
          album_name: request.body.album_name,
          release_date: request.body.release_date,
          is_visible: true,
        });

        await album.save();
        reply.status(201).send(album);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );
}

module.exports = routes;
