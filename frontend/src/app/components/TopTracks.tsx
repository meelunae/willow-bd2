"use client";

import { useEffect } from "react";
import CoverFlow from "../components/CoverFlow";
import { Track } from "../types";

interface TopTracksProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TopTracks: React.FC<TopTracksProps> = ({
  tracks,
  setTracks,
  selectedIndex,
  setSelectedIndex,
}) => {
  useEffect(() => {
    // Fetch initial tracks if no tracks are present
    if (tracks.length === 0) {
      fetch("http://localhost:3000/api/tracks")
        .then((res) => res.json())
        .then((data: Track[]) => setTracks(data.slice(0, 50)))
        .catch((err) => console.error("Error fetching tracks:", err));
    }
  }, [tracks.length, setTracks]);

  return (
    <div className="px-4 py-4">
      <CoverFlow
        tracks={tracks}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
};

export default TopTracks;
