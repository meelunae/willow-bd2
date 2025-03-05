import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ITrack, Track } from "../models/track.model";

async function routes(server: FastifyInstance, options: Object) {
  /**
   * Homepage: Get top 50 most popular songs
   */
  server.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const tracks: ITrack[] = await Track.find()
        .sort({ popularity: -1 })
        .limit(50);
      reply.send(tracks);
    } catch (err) {
      server.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  /**
   * Search by Title: Full title or substring search
   */
  server.get(
    "/search/title",
    async (
      req: FastifyRequest<{ Querystring: { title: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const { title } = req.query;
        if (!title)
          return reply.status(400).send({ error: "Title is required" });

        const tracks: ITrack[] = await Track.find({
          name: { $regex: title, $options: "i" },
        });
        reply.send(tracks);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  server.get(
    "/search/filters",
    async (
      req: FastifyRequest<{
        Querystring: {
          title?: string;
          album?: string;
          minDuration?: string;
          maxDuration?: string;
          minBPM?: string;
          maxBPM?: string;
          mood?: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const { title, album, minDuration, maxDuration, minBPM, maxBPM, mood } =
          req.query;
        let filter: any = {};

        if (title) {
          filter.name = { $regex: title, $options: "i" };
        }
        // Handle album filter
        if (album) {
          const albumsArray = album.split(",");
          filter.album = { $in: albumsArray };
        }

        // Handle duration filter (min and max)
        if (minDuration || maxDuration) {
          const durationFilter: any = {};
          if (minDuration) durationFilter.$gte = parseInt(minDuration);
          if (maxDuration) durationFilter.$lte = parseInt(maxDuration);
          filter.duration_ms = durationFilter;
        }

        if (minBPM || maxBPM) {
          const bpmFilter: any = {};
          if (minBPM) bpmFilter.$gte = parseInt(minBPM);
          if (maxBPM) bpmFilter.$lte = parseInt(maxBPM);
          filter.tempo = bpmFilter;
        }

        // Handle mood filter
        if (mood) {
          filter.mood = { $regex: mood, $options: "i" };
        }

        // Fetch the filtered tracks
        const tracks: ITrack[] = await Track.find(filter);
        reply.send(tracks);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  server.get(
    "/albums",
    async (
      req: FastifyRequest<{ Querystring: { mood: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const tracks: ITrack[] = await Track.collection.distinct(
          "album",
          function (error: any, results: any) {
            console.log(results);
          },
        );
        reply.send(tracks);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Discography Analytics Route
  server.get(
    "/analytics",
    async (_req: FastifyRequest, reply: FastifyReply) => {
      try {
        const tracks: ITrack[] = await Track.find();
        if (!tracks.length) {
          return reply.send({ error: "No data available" });
        }

        // Total songs
        const totalSongs = tracks.length;

        // Total albums (unique count of album names)
        const totalAlbums = new Set(tracks.map((track) => track.album)).size;

        // Total duration (sum of duration_ms in minutes)
        const totalDurationMinutes = Math.round(
          tracks.reduce((sum, track) => sum + track.duration_ms, 0) / 60000,
        );

        // Sorting tracks by release date to find first and last album
        const sortedTracks = tracks.sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime(),
        );

        const firstAlbumYear = new Date(
          sortedTracks[0].release_date,
        ).getFullYear();
        const lastAlbumDate = new Date(
          sortedTracks[sortedTracks.length - 1].release_date,
        );

        const yearsSinceFirstAlbum = new Date().getFullYear() - firstAlbumYear;
        const daysSinceLastAlbum = Math.floor(
          (new Date().getTime() - lastAlbumDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        reply.send({
          totalSongs,
          totalAlbums,
          totalDurationMinutes,
          yearsSinceFirstAlbum,
          daysSinceLastAlbum,
        });
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );
}
module.exports = routes;
