"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SearchTabs from "./SearchTabs"; // Import the tab system

const albumCoverMapping: Record<string, string> = {
  "1989": "1989.jpg",
  "1989 (Deluxe)": "1989.jpg",
  "1989 (Taylor's Version)": "1989tv.jpg",
  "1989 (Taylor's Version) [Deluxe]": "1989tvd.jpg",
  "Fearless (International Version)": "f.jpg",
  "Fearless (Platinum Edition)": "ftv.jpg",
  "Fearless (Taylor's Version)": "ftv.jpg",
  "Live From Clear Channel Stripped 2008": "e.jpg",
  Lover: "l.jpg",
  Midnights: "mn.jpg",
  "Midnights (3am Edition)": "mn3am.jpg",
  "Midnights (The Til Dawn Edition)": "mntdv.jpg",
  Red: "r.jpg",
  "Red (Deluxe Edition)": "rd.jpg",
  "Red (Taylor's Version)": "rtv.jpg",
  "Speak Now": "sn.jpg",
  "Speak Now (Deluxe Package)": "sntv.jpg",
  "Speak Now (Taylor's Version)": "sntv.jpg",
  "Speak Now World Tour Live": "sntv.jpg",
  "THE TORTURED POETS DEPARTMENT": "ttpd.jpg",
  "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY": "ttpdta.jpg",
  "Taylor Swift (Deluxe Edition)": "ts.jpg",
  evermore: "e.jpg",
  "evermore (deluxe version)": "e.jpg",
  folklore: "f.jpg",
  "folklore (deluxe version)": "f.jpg",
  "folklore: the long pond studio sessions (from the Disney+ special) [deluxe edition]":
    "ftlpss.jpg",
  reputation: "rep.jpg",
  "reputation Stadium Tour Surprise Song Playlist": "rep.jpg",
};
interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    albums?: string[];
    minDuration?: number;
    maxDuration?: number;
    mood?: string;
    minBPM?: number;
    maxBPM?: number;
  }) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("albums");
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [minBPM, setMinBPM] = useState<number | undefined>(undefined);
  const [maxBPM, setMaxBPM] = useState<number | undefined>(undefined);
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [albums, setAlbums] = useState<string[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tracks/finally",
        );
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    if (isOpen) {
      fetchAlbums();
    }
  }, [isOpen]);

  const toggleAlbumSelection = (album: string) => {
    setSelectedAlbums((prev) =>
      prev.includes(album) ? prev.filter((a) => a !== album) : [...prev, album],
    );
  };

  const applyFilters = () => {
    onApply({
      albums: selectedAlbums,
      minDuration,
      maxDuration,
      minBPM,
      maxBPM,
      mood,
    });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-[#1e4b60] bg-opacity-30 backdrop-blur-lg p-6 rounded-xl shadow-lg text-white w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Advanced Search</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "albums" && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {albums.map((album) => (
                <div
                  key={album}
                  className={`relative cursor-pointer transition ${
                    selectedAlbums.includes(album) ? "" : "grayscale opacity-50"
                  }`}
                  onClick={() => toggleAlbumSelection(album)}
                >
                  <img
                    src={`/covers/${albumCoverMapping[album]}`}
                    alt={album}
                    className="rounded-lg shadow-md"
                  />
                  <p className="text-center text-sm mt-2">{album}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="mt-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Duration
                </h3>
                <div className="flex justify-between gap-4 mt-2">
                  <div className="flex flex-col w-1/2">
                    <label className="text-gray-300 mb-2">
                      Minimum Duration (seconds)
                    </label>
                    <input
                      type="number"
                      value={minDuration || ""}
                      onChange={(e) => setMinDuration(Number(e.target.value))}
                      className="p-2 rounded-md bg-gray-800 text-white border-1 border-gray-500 w-[200px]"
                      placeholder="Min duration"
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-gray-300 mb-2">
                      Maximum Duration (seconds)
                    </label>
                    <input
                      type="number"
                      value={maxDuration || ""}
                      onChange={(e) => setMaxDuration(Number(e.target.value))}
                      className="p-2 rounded-md bg-gray-800 text-white border-1 border-gray-500 w-[200px]"
                      placeholder="Max duration"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-300">BPM</h3>
                <div className="flex justify-between gap-4 mt-2">
                  <div className="flex flex-col w-1/2">
                    <label className="text-gray-300 mb-2">Minimum BPM</label>
                    <input
                      type="number"
                      value={minBPM || ""}
                      onChange={(e) => setMinBPM(Number(e.target.value))}
                      className="p-2 rounded-md bg-gray-800 text-white border-1 border-gray-500 w-[200px]"
                      placeholder="Min BPM"
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-gray-300 mb-2">Maximum BPM</label>
                    <input
                      type="number"
                      value={maxBPM || ""}
                      onChange={(e) => setMaxBPM(Number(e.target.value))}
                      className="p-2 rounded-md bg-gray-800 text-white border-1 border-gray-500 w-[200px]"
                      placeholder="Max BPM"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Mood</h3>
                <div className="flex gap-4 mt-2">
                  {["happy", "sad", "energetic", "calm"].map((option) => (
                    <button
                      key={option}
                      className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                        mood === option
                          ? "bg-blue-500"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                      onClick={() => setMood(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-700 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
