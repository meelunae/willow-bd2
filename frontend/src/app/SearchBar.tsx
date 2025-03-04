"use client";

import { useState } from "react";
import AdvancedSearch from "./AdvancedSearch";
import { Track } from "./types";

interface SearchBarProps {
  setTracks: (tracks: Track[]) => void;
  resetIndex: () => void; // Add this prop
}

const SearchBar: React.FC<SearchBarProps> = ({ setTracks, resetIndex }) => {
  const [searchType, setSearchType] = useState("title"); // Default search type is "title"
  const [query, setQuery] = useState("");
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);

  const handleSearch = async () => {
    // Do not proceed if the search type is "title" and the query is empty
    if (searchType === "title" && query.trim() === "") {
      return; // Don't search if there's no query for title search
    }

    let url = "http://localhost:3000/api/tracks/search/";

    if (searchType === "title") {
      // Search by title
      url += `title?title=${query}`;
    } else if (searchType === "filters") {
      // Search by filters (Advanced Search)
      url += `filters?album=${selectedAlbums.join(",")}`;
      if (minDuration !== undefined) url += `&minDuration=${minDuration}`;
      if (mood) url += `&mood=${mood}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      resetIndex();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setTracks([]);
    }
  };

  // Function to handle filter application from AdvancedSearch
  const handleApplyFilters = (filters: {
    albums?: string[];
    minDuration?: number;
    mood?: string;
  }) => {
    setSelectedAlbums(filters.albums || []);
    setMinDuration(filters.minDuration);
    setMood(filters.mood);
    setSearchType("filters");
  };

  return (
    <div className="flex items-center gap-3  p-2 rounded-lg shadow-md">
      {/* Search by title input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 rounded-md bg-gray-950 text-white border-1 border-gray-500 w-[400px]"
      />

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
      >
        Search
      </button>

      <button
        onClick={() => setAdvancedOpen(true)}
        className="px-4 py-2 bg-[#1e4b60] hover:bg-[#] text-white rounded-md"
      >
        Advanced Query
      </button>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={isAdvancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={handleApplyFilters} // Use the new handler
      />
    </div>
  );
};

export default SearchBar;
