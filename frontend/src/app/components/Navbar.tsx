import Link from "next/link";
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction } from "react";

interface Track {
  id: string;
  name: string;
  album: string;
  release_date: string;
  duration: number;
  popularity: number;
}

interface NavbarProps {
  setTracks?: Dispatch<SetStateAction<Track[]>>;
  resetIndex?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setTracks, resetIndex }) => {
  return (
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
        <div className="flex gap-4">
          <Link href="/" className="text-white">
            Top Tracks
          </Link>
          <Link href="/discography-analytics" className="text-white">
            Discography Analytics
          </Link>
        </div>
      </div>
      {setTracks && resetIndex && (
        <SearchBar setTracks={setTracks} resetIndex={resetIndex} />
      )}
    </nav>
  );
};

export default Navbar;
