"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrows for navigation
import { albumCoverMapping, primaryColors } from "../constants";
import Image from "next/image";
import { Track } from "../types";

interface CoverFlowProps {
  tracks: Track[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const CoverFlow: React.FC<CoverFlowProps> = ({
  tracks,
  selectedIndex,
  setSelectedIndex,
}) => {
  const cardsPerPage = 10;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prevIndex) => prevIndex - cardsPerPage);
    }
  };

  const handleNext = () => {
    if (selectedIndex + cardsPerPage < tracks.length) {
      setSelectedIndex((prevIndex) => prevIndex + cardsPerPage);
    }
  };

  const visibleTracks = tracks.slice(
    selectedIndex,
    selectedIndex + cardsPerPage,
  );

  return (
    <div className="cover-flow-container flex justify-center mt-10">
      {/* Cover flow section with horizontal scroll */}
      <div className="cover-flow">
        {visibleTracks.map((track) => (
          <div key={track.id} className="cover-flow-item">
            <Image
              src={`/covers/${albumCoverMapping[track.album]}`}
              alt={track.album}
              width={200}
              height={200}
              className="cover-image w-full h-full object-cover rounded-t-lg"
            />

            <div
              className="cover-flow-item-info p-4 rounded-b-lg"
              style={{
                backgroundColor: primaryColors[track.album] || "#000",
              }}
            >
              <h3 className="font-bold text-xl">{track.name}</h3>
              <p className="text-lg font-semibold">{track.album}</p>
              <p className="text-sm font-normal opacity-65">
                {track.album_id?.release_date ? new Date(track.album_id.release_date).toISOString().split("T")[0] : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="cover-flow-buttons">
        <button
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          className={`cover-flow-button ${selectedIndex === 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={selectedIndex + cardsPerPage >= tracks.length}
          className={`cover-flow-button ${selectedIndex + cardsPerPage >= tracks.length ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CoverFlow;
