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

  /**
   * Search by Tempo (BPM range)
   */
  server.get(
    "/search/tempo",
    async (
      req: FastifyRequest<{ Querystring: { min: string; max: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const { min, max } = req.query;
        if (!min || !max)
          return reply
            .status(400)
            .send({ error: "Both min and max tempo are required" });

        const tracks: ITrack[] = await Track.find({
          tempo: { $gte: parseFloat(min), $lte: parseFloat(max) },
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
          album?: string;
          min_duration?: string;
          max_duration?: string;
          mood?: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const { album, min_duration, max_duration, mood } = req.query;
        let filter: any = {};

        // Handle album filter
        if (album) {
          const albumsArray = album.split(","); // Assuming album filter can handle multiple albums.
          filter.album = { $in: albumsArray };
        }

        // Handle duration filter (min and max)
        if (min_duration || max_duration) {
          const durationFilter: any = {};
          if (min_duration) durationFilter.$gte = parseInt(min_duration);
          if (max_duration) durationFilter.$lte = parseInt(max_duration);
          filter.duration_ms = durationFilter;
        }

        // Handle mood filter
        if (mood) {
          filter.mood = { $regex: mood, $options: "i" }; // Assuming you store mood as a string in the database
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

  /**
   * Vibe-Based Search: Match songs based on mood parameters
   */
  server.get(
    "/search/vibe",
    async (
      req: FastifyRequest<{ Querystring: { mood: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const { mood } = req.query;
        if (!mood) return reply.status(400).send({ error: "Mood is required" });

        let filter: any = {};
        switch (mood.toLowerCase()) {
          case "happy":
            filter = { danceability: { $gte: 0.6 }, valence: { $gte: 0.6 } };
            break;
          case "sad":
            filter = { danceability: { $lte: 0.4 }, valence: { $lte: 0.4 } };
            break;
          case "energetic":
            filter = { energy: { $gte: 0.7 }, tempo: { $gte: 120 } };
            break;
          case "calm":
            filter = { energy: { $lte: 0.4 }, tempo: { $lte: 100 } };
            break;
          default:
            return reply.status(400).send({
              error:
                "Invalid mood. Available moods: happy, sad, energetic, calm.",
            });
        }

        const tracks: ITrack[] = await Track.find(filter);
        reply.send(tracks);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  server.get(
    "/finally",
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
}
module.exports = routes;
