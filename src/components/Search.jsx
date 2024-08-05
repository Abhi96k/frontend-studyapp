import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
    <div className="search-bar flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-md bg-white">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="p-2 w-full border-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-r-lg transition-colors"
      >
        <CiSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
