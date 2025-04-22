"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface AnalyticsData {
  totalSongs: number;
  totalAlbums: number;
  totalDurationMinutes: number;
  yearsSinceFirstAlbum: number;
  daysSinceLastAlbum: number;
}

interface DiscographyAnalyticsComponentProps {
  data: AnalyticsData;
}

const DiscographyAnalytics: React.FC<DiscographyAnalyticsComponentProps> = ({
  data,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const cardsPerPage = 6;
  // Analytics data formatted for display
  const metrics = [
    { label: "Total Songs", value: data.totalSongs },
    { label: "Total Albums", value: data.totalAlbums },
    { label: "Total Duration (min)", value: data.totalDurationMinutes },
    { label: "Years Since First Album", value: data.yearsSinceFirstAlbum },
    { label: "Days Since Last Album", value: data.daysSinceLastAlbum },
  ];

  // Slice data for pagination
  const visibleMetrics = metrics.slice(
    selectedIndex,
    selectedIndex + cardsPerPage,
  );

  return (
    <div className="cover-flow-container flex flex-col items-center mt-10">
      {/* Cover Flow Section */}
      <div className="cover-flow flex gap-4">
        {visibleMetrics.map((metric, index) => (
          <div
            key={index}
            className="cover-flow-item flex flex-col items-center p-6 bg-[#1e4b60] bg-opacity-90 rounded-xl shadow-lg w-40 h-40"
          >
            <p className="text-3xl font-bold pt-25">{metric.value}</p>
            <p className="text-lg font-medium opacity-75">{metric.label}</p>
          </div>
        ))}
      </div>
      {/* Navigation Buttons */}
      <div className="cover-flow-buttons mt-4 flex gap-4">
        <button
          onClick={() =>
            setSelectedIndex((prev) => Math.max(prev - cardsPerPage, 0))
          }
          disabled={selectedIndex === 0}
          className={`cover-flow-button ${selectedIndex === 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          onClick={() =>
            setSelectedIndex((prev) =>
              Math.min(prev + cardsPerPage, metrics.length - cardsPerPage),
            )
          }
          disabled={selectedIndex + cardsPerPage >= metrics.length}
          className={`cover-flow-button ${selectedIndex + cardsPerPage >= metrics.length ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default DiscographyAnalytics;
