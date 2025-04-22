export interface Track {
  id: string;
  _id?: string;
  name: string;
  album: string;
  album_id?: {
    _id: string;
    album_name: string;
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  is_visible?: boolean;
  acousticness?: number;
  danceability?: number;
  energy?: number;
  instrumentalness?: number;
  liveness?: number;
  loudness?: number;
  speechiness?: number;
  tempo?: number;
  valence?: number;
}
