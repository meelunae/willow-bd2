"use client";

import { useEffect, useState } from "react";
import CoverFlow from "./CoverFlow";
import SearchBar from "./SearchBar";

interface Track {
  id: string;
  name: string;
  album: string;
  release_date: string;
  duration: number;
  popularity: number;
}

const TopTracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0); // Track the index for pagination

  useEffect(() => {
    // Fetch initial tracks
    fetch("http://localhost:3000/api/tracks")
      .then((res) => res.json())
      .then((data: Track[]) => setTracks(data.slice(0, 50)))
      .catch((err) => console.error("Error fetching tracks:", err));
  }, []);

  const resetSelectedIndex = () => {
    setSelectedIndex(0); // Reset to first page when new data is fetched
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a26] to-[#1e4b60] text-white">
      <nav className="bg-[#0a0a26] p-4 flex justify-between items-center shadow-md shadow-blue-500/30">
        <div className="flex items-center gap-2">
          <img
            src="/willow_logo.png"
            alt="Logo"
            className="max-w-[100px] w-full h-auto filter dark:invert"
          />
          <h1 className="text-2xl font-semibold tracking-wide text-gray-300">
            Willow
          </h1>
        </div>
        <SearchBar setTracks={setTracks} resetIndex={resetSelectedIndex} />
      </nav>

      <div className="px-4 py-10">
        <CoverFlow
          tracks={tracks}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </div>
    </div>
  );
};

export default TopTracks;
