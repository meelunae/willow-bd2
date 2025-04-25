import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ITrack, Track } from "../models/track.model";
import { Album } from "../models/album.model";

interface GetTracksQuery {
  page?: string;
  limit?: string;
}

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
          const albumIds = album.split(",");
          filter.album_id = { $in: albumIds };
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
          switch (mood.toLowerCase()) {
            case "happy":
              filter.valence = { $gte: 0.6 };
              filter.energy = { $gte: 0.6 };
              filter.danceability = { $gte: 0.6 };
              break;
            case "sad":
              filter.valence = { $lte: 0.4 };
              filter.energy = { $lte: 0.4 };
              filter.tempo = { $lte: 100 };
              break;
            case "energetic":
              filter.energy = { $gte: 0.7 };
              filter.tempo = { $gte: 120 };
              filter.loudness = { $gte: -10 };
              break;
            case "calm":
              filter.energy = { $lte: 0.4 };
              filter.acousticness = { $gte: 0.6 };
              filter.loudness = { $lte: -15 };
              break;
          }
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

  /**
   * Get all tracks with pagination (admin only)
   */
  server.get<{ Querystring: GetTracksQuery }>(
    "/admin",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{ Querystring: GetTracksQuery }>,
      reply: FastifyReply,
    ) => {
      try {
        const page = parseInt(request.query.page || "1");
        const limit = parseInt(request.query.limit || "10");
        const skip = (page - 1) * limit;

        const [tracks, total] = await Promise.all([
          Track.find()
            .populate('album_id', 'album_name release_date')
            .skip(skip)
            .limit(limit),
          Track.countDocuments(),
        ]);

        reply.send({
          tracks,
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
   * Update track visibility (admin only)
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
        const track = await Track.findByIdAndUpdate(
          request.params.id,
          { is_visible: request.body.is_visible },
          { new: true },
        );

        if (!track) {
          return reply.status(404).send({ error: "Track not found" });
        }

        reply.send(track);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Delete track (admin only)
   */
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const track = await Track.findByIdAndDelete(request.params.id);

        if (!track) {
          return reply.status(404).send({ error: "Track not found" });
        }

        reply.send({ message: "Track deleted successfully" });
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  /**
   * Update track (admin only)
   */
  server.patch<{ 
    Params: { id: string }; 
    Body: { 
      name: string;
      release_date: string;
      popularity: number;
      acousticness: number;
      danceability: number;
      energy: number;
      instrumentalness: number;
      liveness: number;
      loudness: number;
      speechiness: number;
      tempo: number;
      valence: number;
    } 
  }>(
    "/:id",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (request: FastifyRequest<{ 
      Params: { id: string }; 
      Body: { 
        name: string;
        release_date: string;
        popularity: number;
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        speechiness: number;
        tempo: number;
        valence: number;
      } 
    }>, reply: FastifyReply) => {
      try {
        const track = await Track.findByIdAndUpdate(
          request.params.id,
          {
            name: request.body.name,
            release_date: request.body.release_date,
            popularity: request.body.popularity,
            acousticness: request.body.acousticness,
            danceability: request.body.danceability,
            energy: request.body.energy,
            instrumentalness: request.body.instrumentalness,
            liveness: request.body.liveness,
            loudness: request.body.loudness,
            speechiness: request.body.speechiness,
            tempo: request.body.tempo,
            valence: request.body.valence,
          },
          { new: true }
        );

        if (!track) {
          return reply.status(404).send({ error: "Track not found" });
        }

        reply.send(track);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  /**
   * Create track (admin only)
   */
  server.post<{ 
    Body: { 
      name: string;
      album_id: string;
      release_date: string;
      duration_ms: number;
      popularity: number;
      acousticness: number;
      danceability: number;
      energy: number;
      instrumentalness: number;
      liveness: number;
      loudness: number;
      speechiness: number;
      tempo: number;
      valence: number;
    } 
  }>(
    "/",
    { preHandler: [server.authenticate, server.isAdmin] },
    async (request: FastifyRequest<{ 
      Body: { 
        name: string;
        album_id: string;
        release_date: string;
        duration_ms: number;
        popularity: number;
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        speechiness: number;
        tempo: number;
        valence: number;
      } 
    }>, reply: FastifyReply) => {
      try {
        const track = new Track({
          name: request.body.name,
          album_id: request.body.album_id,
          release_date: request.body.release_date,
          duration_ms: request.body.duration_ms,
          popularity: request.body.popularity,
          acousticness: request.body.acousticness,
          danceability: request.body.danceability,
          energy: request.body.energy,
          instrumentalness: request.body.instrumentalness,
          liveness: request.body.liveness,
          loudness: request.body.loudness,
          speechiness: request.body.speechiness,
          tempo: request.body.tempo,
          valence: request.body.valence,
          is_visible: true,
        });

        await track.save();
        const populatedTrack = await Track.findById(track._id).populate('album_id', 'album_name release_date');
        reply.status(201).send(populatedTrack);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = routes;
