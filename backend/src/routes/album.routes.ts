import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IAlbum, Album } from "../models/album.model";

async function routes(server: FastifyInstance, options: Object) {
  /**
   * Homepage: Get top 50 most popular songs
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
}
module.exports = routes;
