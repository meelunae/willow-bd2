"use client";

import Navbar from "./components/Navbar";
import TopTracks from "./components/TopTracks";
import { useState } from "react";

interface Track {
  id: string;
  name: string;
  album: string;
  release_date: string;
  duration: number;
  popularity: number;
}

const HomePage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resetSelectedIndex = () => {
    setSelectedIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a26] to-[#1e4b60] text-white">
      <Navbar setTracks={setTracks} resetIndex={resetSelectedIndex} />
      <h1 className="text-3xl font-bold pt-10 pl-30 pb-0">
        Current Top Tracks
      </h1>
      <TopTracks
        tracks={tracks}
        setTracks={setTracks}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
};

export default HomePage;
