"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrows for navigation

interface Track {
  id: string;
  name: string;
  album: string;
  release_date: string;
  duration: number;
  popularity: number;
}

interface CoverFlowProps {
  tracks: Track[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

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

const primaryColors: Record<string, string> = {
  "1989": "#2d7f95",
  Fearless: "#f5b8b4",
  Lover: "#eec6ca",
  Midnights: "#0d1839",
  Red: "#d11c2d",
  "Speak Now": "#5c3369",
  "Taylor Swift (Deluxe Edition)": "#ab6f71",
  evermore: "#4e4e4e",
  folklore: "#8f8f8f",
  reputation: "#282828",
};

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
            <img
              src={`/covers/${albumCoverMapping[track.album]}`}
              alt={track.album}
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
                {new Date(track.release_date).toISOString().split("T")[0]}
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
