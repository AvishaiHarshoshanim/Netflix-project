import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import MovieItem from "../HomePage/components/MovieItem";
import "./SearchPage.css"; 

const SearchPage = ({userId}) => {
  const { query } = useParams(); 
  const [results, setResults] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;

  useEffect(() => {
    setIsLoading(true); 
    fetch(`${API_URL}/movies/search/${query}`)
      .then((res) => {
        if (res.status === 204) {
          setResults(null);
          setError("No matches were found for the search, you should try different keywords");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setResults(data);
          setError(null); 
        }
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setError("Error loading search results");
      })
      .finally(() => setIsLoading(false));
  }, [query, API_URL]);

  return (
    <div>
      <div className="search-background">
        <img src="/images/netflix-like_background.webp" alt="Background" className="background-image" />
      </div>
      <div className="search-page">
        <h1>Search Results for: {query}</h1>
        {isLoading && <p>Loading results...</p>} 
        {error && <p className="error-message">{error}</p>} 
        {results && (
            <ul className="search-results">
                {results.results.map((movie) => (
                    <MovieItem key={movie._id} movie={movie} userId={userId} />
                ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
