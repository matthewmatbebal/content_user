import React, { useState, useEffect, useRef } from 'react';
import ContentCard from './ContentCard';

interface SearchResult {
  Title: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Genre: string;
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
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved search term and results from localStorage
    const savedSearchTerm = localStorage.getItem('searchTerm');
    const savedSearchResults = localStorage.getItem('searchResults');

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }

    if (savedSearchResults) {
      setSearchResults(JSON.parse(savedSearchResults));
    }
  }, []);

  useEffect(() => {
    // Save search term and results to localStorage whenever they change
    localStorage.setItem('searchTerm', searchTerm);
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
  }, [searchTerm, searchResults]);

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
    if (searchButtonRef.current) {
      searchButtonRef.current.classList.add('shake');
      setTimeout(() => {
        if (searchButtonRef.current) {
          searchButtonRef.current.classList.remove('shake');
        }
      }, 500);
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=e55bdc80`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: OmdbApiResponse = await response.json();

      setSearchPerformed(true);

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter movie title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          ref={searchButtonRef}
          className='search-button'
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="search-results">
        {searchPerformed && searchResults.length === 0 ? (
          <p>No content found for your search.</p>
        ) : searchResults.length > 0 ? (
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
