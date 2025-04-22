'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/app/constants';

interface Album {
  _id: string;
  album_name: string;
  release_date: string;
  is_visible: boolean;
}

interface EditAlbumModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (album: Album) => void;
}

function EditAlbumModal({ album, isOpen, onClose, onSave }: EditAlbumModalProps) {
  const [formData, setFormData] = useState<Partial<Album>>({});

  useEffect(() => {
    if (album) {
      setFormData({
        album_name: album.album_name,
        release_date: new Date(album.release_date).toISOString().split('T')[0],
      });
    }
  }, [album]);

  if (!isOpen || !album) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...album, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Album</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Album Name</label>
            <input
              type="text"
              value={formData.album_name || ''}
              onChange={(e) => setFormData({ ...formData, album_name: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
            <input
              type="date"
              value={formData.release_date || ''}
              onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
            />
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

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (album: Omit<Album, '_id' | 'is_visible'>) => void;
}

function CreateAlbumModal({ isOpen, onClose, onSave }: CreateAlbumModalProps) {
  const [formData, setFormData] = useState<Omit<Album, '_id' | 'is_visible'>>({
    album_name: '',
    release_date: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ album_name: '', release_date: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Create New Album</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Album Name</label>
            <input
              type="text"
              value={formData.album_name}
              onChange={(e) => setFormData({ ...formData, album_name: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
            <input
              type="date"
              value={formData.release_date}
              onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
            />
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
              Create Album
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

export default function AlbumManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAlbums = async (page: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/admin?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      setAlbums(data.albums);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(currentPage);
  }, [currentPage]);

  const handleVisibilityToggle = async (albumId: string, currentVisibility: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${albumId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });

      if (!response.ok) {
        throw new Error('Failed to update album visibility');
      }

      // Update local state
      setAlbums(albums.map(album => 
        album._id === albumId 
          ? { ...album, is_visible: !currentVisibility }
          : album
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (albumId: string) => {
    if (!confirm('Are you sure you want to delete this album?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete album');
      }

      // Remove from local state
      setAlbums(albums.filter(album => album._id !== albumId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = async (updatedAlbum: Album) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${updatedAlbum._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          album_name: updatedAlbum.album_name,
          release_date: updatedAlbum.release_date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update album');
      }

      // Update local state
      setAlbums(albums.map(album => 
        album._id === updatedAlbum._id ? updatedAlbum : album
      ));
      setEditingAlbum(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreate = async (newAlbum: Omit<Album, '_id' | 'is_visible'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum),
      });

      if (!response.ok) {
        throw new Error('Failed to create album');
      }

      const createdAlbum = await response.json();
      setAlbums([createdAlbum, ...albums]);
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
          Create New Album
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Release Date</th>
              <th className="p-2 text-left">Visibility</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album._id} className="border-b border-gray-700">
                <td className="p-2">{album.album_name}</td>
                <td className="p-2">{formatDate(album.release_date)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleVisibilityToggle(album._id, album.is_visible)}
                    className={`px-2 py-1 rounded transition-colors ${
                      album.is_visible 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {album.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setEditingAlbum(album)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(album._id)}
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

      <EditAlbumModal
        album={editingAlbum}
        isOpen={!!editingAlbum}
        onClose={() => setEditingAlbum(null)}
        onSave={handleEdit}
      />

      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
} 