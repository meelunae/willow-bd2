import mongoose from "mongoose";

interface IAlbum {
  _id: string;
  album_name: string;
  release_date: Date;
  is_visible: boolean;
}

const albumSchema = new mongoose.Schema<IAlbum>({
  _id: { type: String, required: true, unique: true },
  album_name: { type: String, required: true },
  release_date: { type: Date, required: true },
  is_visible: { type: Boolean, default: true },
});

const Album = mongoose.model<IAlbum>("Album", albumSchema);

albumSchema.statics.build = (attr: IAlbum) => {
  return new Album(attr);
};

export { IAlbum, Album };
