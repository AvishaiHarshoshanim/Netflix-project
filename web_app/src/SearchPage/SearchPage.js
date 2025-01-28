import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // כדי לקבל את ה-query מהנתיב
import Header from "../HomePage/components/Header";
import MovieItem from "../HomePage/components/MovieItem";
import "./SearchPage.css"; // נשתמש בקובץ CSS מאוחר יותר לעיצוב

const SearchPage = () => {
  const { query } = useParams(); // נשלוף את ה-query מהכתובת
  const [results, setResults] = useState(null); // נשמור את תוצאות החיפוש
  const [isLoading, setIsLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(null); // שגיאות אפשריות

  useEffect(() => {
    setIsLoading(true); // מפעילים מצב טעינה
    fetch(`http://localhost:5000/api/movies/search/${query}`)
      .then((res) => {
        if (res.status === 204) {
          // אם אין תוצאות
          setResults(null);
          setError("No matches were found for the search, you should try different keywords");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setResults(data);
          setError(null); // אין שגיאות
        }
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setError("תקלה בטעינת תוצאות החיפוש.");
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <div>
      <Header />
      <div className="search-background">
        <img src="/images/netflix-like_background.webp" alt="Background" className="background-image" />
      </div>
      <div className="search-page">
        <h1>Search Results for: {query}</h1>
        {isLoading && <p>טוען תוצאות...</p>} {/* מצב טעינה */}
        {error && <p className="error-message">{error}</p>} {/* הודעת שגיאה */}
        {results && (
            <ul className="search-results">
                {results.results.map((movie) => (
                    <MovieItem key={movie._id} movie={movie} />
                ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
