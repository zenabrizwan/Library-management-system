import React from 'react';

const SearchBar = ({ onSearchChange, searchTerm }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by title, author, category, or ISBN"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
