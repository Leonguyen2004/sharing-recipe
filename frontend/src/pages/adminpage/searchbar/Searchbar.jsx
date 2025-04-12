import React from 'react';
import { Search } from 'lucide-react';
import './Searchbar.css';

const Searchbar = ({ placeholder, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <form className="adpage-search-bar" onSubmit={handleSubmit}>
      <div className="adpage-search-input-wrapper">
        <Search size={18} className="adpage-search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          className="adpage-search-input"
        />
      </div>
    </form>
  );
};

export default Searchbar;