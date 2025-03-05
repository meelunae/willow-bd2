"use client";

import DiscographyAnalyticsComponent from "../components/DiscographyAnalytics";
import Navbar from "../components/Navbar";
import useAnalytics from "../useAnalytics";

const DiscographyAnalyticsPage = () => {
  const { data, loading, error } = useAnalytics();

  if (loading) return <p className="text-white">Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-400">No data available</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a26] to-[#1e4b60] text-white">
      <Navbar />
      <h1 className="text-3xl font-bold pt-10 pl-30 pb-0">
        Discography Analytics
      </h1>
      <DiscographyAnalyticsComponent data={data} />
    </div>
  );
};

export default DiscographyAnalyticsPage;
