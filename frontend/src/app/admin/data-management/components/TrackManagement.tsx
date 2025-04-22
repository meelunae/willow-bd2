'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/app/constants';
import { Track as BaseTrack } from '@/app/types';

type Track = BaseTrack & {
  _id: string;
  album_id: {
    _id: string;
    album_name: string;
    release_date: string;
  };
  is_visible: boolean;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  album: string;
  release_date: string;
};

interface EditTrackModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (track: Track) => void;
}

function EditTrackModal({ track, isOpen, onClose, onSave }: EditTrackModalProps) {
  const [formData, setFormData] = useState<Partial<Track>>({});

  useEffect(() => {
    if (track) {
      setFormData({
        name: track.name,
        popularity: track.popularity,
        acousticness: track.acousticness,
        danceability: track.danceability,
        energy: track.energy,
        instrumentalness: track.instrumentalness,
        liveness: track.liveness,
        loudness: track.loudness,
        speechiness: track.speechiness,
        tempo: track.tempo,
        valence: track.valence,
      });
    }
  }, [track]);

  if (!isOpen || !track) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...track, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Track</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Track Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Album</label>
              <input
                type="text"
                value={track.album_id.album_name}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
              <input
                type="text"
                value={formatDate(track.album_id.release_date)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
              <input
                type="text"
                value={formatDuration(track.duration_ms)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Popularity</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.popularity || 0}
                onChange={(e) => setFormData({ ...formData, popularity: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Acousticness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.acousticness || 0}
                onChange={(e) => setFormData({ ...formData, acousticness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Danceability</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.danceability || 0}
                onChange={(e) => setFormData({ ...formData, danceability: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Energy</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.energy || 0}
                onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Instrumentalness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.instrumentalness || 0}
                onChange={(e) => setFormData({ ...formData, instrumentalness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Liveness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.liveness || 0}
                onChange={(e) => setFormData({ ...formData, liveness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Loudness</label>
              <input
                type="number"
                min="-60"
                max="0"
                step="0.1"
                value={formData.loudness || 0}
                onChange={(e) => setFormData({ ...formData, loudness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Speechiness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.speechiness || 0}
                onChange={(e) => setFormData({ ...formData, speechiness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tempo</label>
              <input
                type="number"
                min="0"
                max="250"
                step="0.1"
                value={formData.tempo || 0}
                onChange={(e) => setFormData({ ...formData, tempo: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Valence</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.valence || 0}
                onChange={(e) => setFormData({ ...formData, valence: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (track: Omit<Track, '_id' | 'is_visible' | 'album_id' | 'id' | 'album' | 'release_date'> & { album_id: string }) => void;
  albums: { _id: string; album_name: string; release_date: string }[];
}

function CreateTrackModal({ isOpen, onClose, onSave, albums }: CreateTrackModalProps) {
  const [formData, setFormData] = useState<Omit<Track, '_id' | 'is_visible' | 'album_id' | 'id' | 'album' | 'release_date'> & { album_id: string }>({
    name: '',
    album_id: '',
    duration_ms: 0,
    popularity: 0,
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    liveness: 0,
    loudness: 0,
    speechiness: 0,
    tempo: 0,
    valence: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      album_id: '',
      duration_ms: 0,
      popularity: 0,
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      liveness: 0,
      loudness: 0,
      speechiness: 0,
      tempo: 0,
      valence: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Create New Track</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Track Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Album</label>
              <select
                value={formData.album_id}
                onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              >
                <option value="">Select an album</option>
                {albums.map((album) => (
                  <option key={album._id} value={album._id}>
                    {album.album_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (ms)</label>
              <input
                type="number"
                value={formData.duration_ms}
                onChange={(e) => setFormData({ ...formData, duration_ms: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Popularity</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.popularity}
                onChange={(e) => setFormData({ ...formData, popularity: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Acousticness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.acousticness}
                onChange={(e) => setFormData({ ...formData, acousticness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Danceability</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.danceability}
                onChange={(e) => setFormData({ ...formData, danceability: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Energy</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Instrumentalness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.instrumentalness}
                onChange={(e) => setFormData({ ...formData, instrumentalness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Liveness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.liveness}
                onChange={(e) => setFormData({ ...formData, liveness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Loudness</label>
              <input
                type="number"
                min="-60"
                max="0"
                step="0.1"
                value={formData.loudness}
                onChange={(e) => setFormData({ ...formData, loudness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Speechiness</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.speechiness}
                onChange={(e) => setFormData({ ...formData, speechiness: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tempo</label>
              <input
                type="number"
                min="0"
                max="250"
                step="0.1"
                value={formData.tempo}
                onChange={(e) => setFormData({ ...formData, tempo: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Valence</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.valence}
                onChange={(e) => setFormData({ ...formData, valence: Number(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Create Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function TrackManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [albums, setAlbums] = useState<{ _id: string; album_name: string; release_date: string }[]>([]);

  const fetchTracks = async (page: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracks/admin?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }

      const data = await response.json();
      setTracks(data.tracks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/admin?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      setAlbums(data.albums);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchTracks(currentPage);
    fetchAlbums();
  }, [currentPage]);

  const handleVisibilityToggle = async (trackId: string, currentVisibility: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracks/${trackId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });

      if (!response.ok) {
        throw new Error('Failed to update track visibility');
      }

      // Update local state
      setTracks(tracks.map(track => 
        track._id === trackId 
          ? { ...track, is_visible: !currentVisibility }
          : track
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete track');
      }

      // Remove from local state
      setTracks(tracks.filter(track => track._id !== trackId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = async (updatedTrack: Track) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracks/${updatedTrack._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedTrack.name,
          popularity: updatedTrack.popularity,
          acousticness: updatedTrack.acousticness,
          danceability: updatedTrack.danceability,
          energy: updatedTrack.energy,
          instrumentalness: updatedTrack.instrumentalness,
          liveness: updatedTrack.liveness,
          loudness: updatedTrack.loudness,
          speechiness: updatedTrack.speechiness,
          tempo: updatedTrack.tempo,
          valence: updatedTrack.valence,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update track');
      }

      // Update local state
      setTracks(tracks.map(track => 
        track._id === updatedTrack._id ? updatedTrack : track
      ));
      setEditingTrack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreate = async (newTrack: Omit<Track, '_id' | 'is_visible' | 'album_id' | 'id' | 'album' | 'release_date'> & { album_id: string }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrack),
      });

      if (!response.ok) {
        throw new Error('Failed to create track');
      }

      const createdTrack = await response.json();
      setTracks([createdTrack, ...tracks]);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 bg-[#0a0a26] bg-opacity-30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
        >
          Create New Track
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Album</th>
              <th className="p-2 text-left">Release Date</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Popularity</th>
              <th className="p-2 text-left">Visibility</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track._id} className="border-b border-gray-700">
                <td className="p-2">{track.name}</td>
                <td className="p-2">{track.album}</td>
                <td className="p-2">{formatDate(track.release_date)}</td>
                <td className="p-2">{formatDuration(track.duration_ms)}</td>
                <td className="p-2">{track.popularity}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleVisibilityToggle(track._id, track.is_visible)}
                    className={`px-2 py-1 rounded transition-colors ${
                      track.is_visible 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {track.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setEditingTrack(track)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(track._id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 transition-colors hover:bg-gray-600"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 transition-colors hover:bg-gray-600"
        >
          Next
        </button>
      </div>

      <EditTrackModal
        track={editingTrack}
        isOpen={!!editingTrack}
        onClose={() => setEditingTrack(null)}
        onSave={handleEdit}
      />

      <CreateTrackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        albums={albums}
      />
    </div>
  );
} 