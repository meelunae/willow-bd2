import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ITrack, Track } from "../models/track.model";
import { Album } from "../models/album.model";

async function routes(server: FastifyInstance, options: Object) {
  /**
   * Homepage: Get top 50 most popular songs
   */
  server.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const tracks: ITrack[] = await Track.find()
        .sort({ popularity: -1 })
        .limit(50)
        .populate({
          path: "album_id",
        });
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
        }).populate("album_id");
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

        // Get album IDs if album names are provided
        if (album) {
          const albumsArray = album.split(",");
          // Find album IDs that match the provided album names
          const matchingAlbums = await Album.find({
            name: { $in: albumsArray.map((name) => new RegExp(name, "i")) },
          });
          const albumIds = matchingAlbums.map((album) => album._id);

          if (albumIds.length) {
            filter.album_id = { $in: albumIds };
          } else {
            // If no matching albums found, return empty result
            return reply.send([]);
          }
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

        // Fetch the filtered tracks and populate the album information
        const tracks: ITrack[] = await Track.find(filter).populate("album_id");
        reply.send(tracks);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );
}

module.exports = routes;
