import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ITrack, Track } from "../models/track.model";
import { IAlbum } from "../models/album.model";

async function routes(fastify: FastifyInstance, options: Object) {
  fastify.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Fetch tracks with populated album info
      const tracks: (ITrack & { album_id: IAlbum })[] =
        await Track.find().populate("album_id");

      if (!tracks.length) {
        return reply.send({ error: "No data available" });
      }

      // Total songs
      const totalSongs = tracks.length;

      // Unique albums based on album_id
      const uniqueAlbums = new Map<string, IAlbum>();
      for (const track of tracks) {
        if (track.album_id && typeof track.album_id === "object") {
          uniqueAlbums.set(track.album_id._id, track.album_id);
        }
      }
      const totalAlbums = uniqueAlbums.size;

      // Total duration in minutes
      const totalDurationMinutes = Math.round(
        tracks.reduce((sum, track) => sum + track.duration_ms, 0) / 60000,
      );

      // Sort albums by release_date to compute years/days metrics
      const sortedAlbums = Array.from(uniqueAlbums.values()).sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );

      const firstAlbumYear = new Date(
        sortedAlbums[0].release_date,
      ).getFullYear();
      const lastAlbumDate = new Date(
        sortedAlbums[sortedAlbums.length - 1].release_date,
      );

      const yearsSinceFirstAlbum = new Date().getFullYear() - firstAlbumYear;
      const daysSinceLastAlbum = Math.floor(
        (Date.now() - lastAlbumDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      reply.send({
        totalSongs,
        totalAlbums,
        totalDurationMinutes,
        yearsSinceFirstAlbum,
        daysSinceLastAlbum,
      });
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

export default routes;
