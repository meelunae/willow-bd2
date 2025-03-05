import { useState, useEffect } from "react";

interface AnalyticsData {
  totalSongs: number;
  totalAlbums: number;
  totalDurationMinutes: number;
  yearsSinceFirstAlbum: number;
  daysSinceLastAlbum: number;
}

const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tracks/analytics",
        );
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const jsonData: AnalyticsData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("Error loading analytics data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading, error };
};

export default useAnalytics;
