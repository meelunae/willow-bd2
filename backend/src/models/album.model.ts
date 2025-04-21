import mongoose from "mongoose";

interface IAlbum {
  _id: string;
  album_name: string;
  release_date: Date;
}

const albumSchema = new mongoose.Schema<IAlbum>({
  _id: { type: String, required: true, unique: true },
  album_name: { type: String, required: true },
  release_date: { type: Date, required: true },
});

const Album = mongoose.model<IAlbum>("Album", albumSchema);

albumSchema.statics.build = (attr: IAlbum) => {
  return new Album(attr);
};

export { IAlbum, Album };
