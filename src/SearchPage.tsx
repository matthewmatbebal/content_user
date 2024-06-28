import React, { useState } from 'react';
import ContentCard from './ContentCard';

interface SearchResult {
  Title: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Genre: string; // Добавлено поле для жанра
}

interface OmdbApiResponse {
  Search: {
    Title: string;
    Poster: string;
    imdbRating: string;
    imdbID: string;
  }[];
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const fetchGenreAndRating = async (imdbID: string) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=e55bdc80`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return {
        Genre: data.Genre || 'Unknown',
        imdbRating: data.imdbRating || 'N/A'
      };
    } catch (error) {
      console.error('Error fetching genre and rating:', error);
      return {
        Genre: 'Unknown',
        imdbRating: 'N/A'
      };
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=e55bdc80`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: OmdbApiResponse = await response.json();

      if (data.Search) {
        const results: SearchResult[] = await Promise.all(
          data.Search.map(async (result) => {
            const { Genre, imdbRating } = await fetchGenreAndRating(result.imdbID);
            return {
              Title: result.Title,
              Poster: result.Poster,
              imdbRating: imdbRating,
              imdbID: result.imdbID,
              Genre: Genre
            };
          })
        );

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter movie title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='search-button' onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {searchResults.length > 0 ? (
          <div>
            <h2>Search Results:</h2>
            <div className="content-cards">
              {searchResults.map((result, index) => (
                <ContentCard key={index} content={result} />
              ))}
            </div>
          </div>
        ) : (
          <p>Enter content title</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
