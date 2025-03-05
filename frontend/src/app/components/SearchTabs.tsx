interface SearchTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "albums", label: "Albums" },
    { id: "preferences", label: "Track Preferences" },
  ];

  return (
    <div className="flex border-b border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`p-3 flex-1 text-center ${
            activeTab === tab.id
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
