import mongoose, { Document, Schema } from "mongoose";

interface ITrack extends Document {
  name: string;
  album_id: String | any; // Reference to Album document
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
  is_visible: boolean;
}

const trackSchema = new Schema<ITrack>(
  {
    name: { type: String, required: true },
    album_id: {
      type: String,
      ref: "Album",
      required: true,
    },
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
    is_visible: { type: Boolean, default: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        // Include album data in a prettier format in the response if it's populated
        if (ret.album_id && typeof ret.album_id === "object") {
          ret.album = ret.album_id.album_name;
          ret.release_date = ret.album_id.release_date;
          ret.album_id = ret.album_id._id;
        }
        return ret;
      },
    },
  },
);

trackSchema.statics.build = (attr: ITrack) => {
  return new Track(attr);
};

const Track = mongoose.model<ITrack>("Track", trackSchema);

export { ITrack, Track };
