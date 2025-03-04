import mongoose from "mongoose";

interface ITrack {
  name: string;
  album: string;
  release_date: Date;
  track_number: number;
  id: string;
  uri: string;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  popularity: number;
  duration_ms: number;
}

const trackSchema = new mongoose.Schema<ITrack>({
  name: { type: String, required: true },
  album: { type: String, required: true },
  release_date: { type: Date, required: true },
  track_number: { type: Number, required: true },
  id: { type: String, required: true, unique: true },
  uri: { type: String, required: true },
  acousticness: { type: Number, required: true },
  danceability: { type: Number, required: true },
  energy: { type: Number, required: true },
  instrumentalness: { type: Number, required: true },
  liveness: { type: Number, required: true },
  loudness: { type: Number, required: true },
  speechiness: { type: Number, required: true },
  tempo: { type: Number, required: true },
  valence: { type: Number, required: true },
  popularity: { type: Number, required: true },
  duration_ms: { type: Number, required: true },
});

const Track = mongoose.model<ITrack>("Track", trackSchema);

trackSchema.statics.build = (attr: ITrack) => {
  return new Track(attr);
};

export { ITrack, Track };
