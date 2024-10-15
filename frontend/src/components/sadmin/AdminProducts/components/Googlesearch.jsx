import React, { useState } from 'react';
import axios from 'axios';

const GoogleImageSearch = ({ onImageSelect }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchImages = async () => {
    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${import.meta.env.VITE_GOOGLE_API_KEY}&cx=YOUR_SEARCH_ENGINE_ID&q=${query}&searchType=image`
      );
      setImages(response.data.items || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="google-image-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for images..."
      />
      <button onClick={searchImages} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="image-results">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.link}
            alt={image.title}
            onClick={() => onImageSelect(image.link)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
};

export default GoogleImageSearch;
