// frontend/src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { getRecommendations } from "../api/recommend";
import { fetchMovieDetails } from "../api/tmdb";
import "./Results.css";

function Results() {
  const userId = sessionStorage.getItem("user_id") || "guest_fallback";
  const name = sessionStorage.getItem("name") || "Guest";

  const [rawRecs, setRawRecs] = useState(null);
  const [detailedRecs, setDetailedRecs] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recs = await getRecommendations(userId);
      if (Array.isArray(recs)) {
        setRawRecs(recs);
      } else {
        console.warn("Backend message:", recs.message || "Unexpected response");
        setRawRecs([]);
      }
    };
    fetchRecommendations();
  }, [userId]);

  useEffect(() => {
    const fetchMovieDetailsBatch = async () => {
      if (!rawRecs || rawRecs.length === 0) return;

      try {
        const detailed = await Promise.all(
          rawRecs.map(async (rec) => {
            const data = await fetchMovieDetails(rec.movie_id);
            return data
              ? {
                  movie_id: rec.movie_id,
                  title: data.title,
                  genres: data.genres,
                  duration: data.duration,
                  director: data.director,
                  studio: data.studio,
                  actors: data.actors,
                  posterUrl: data.posterUrl,
                }
              : null;
          })
        );
        setDetailedRecs(detailed.filter(Boolean));
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setDetailedRecs([]);
      }
    };

    fetchMovieDetailsBatch();
  }, [rawRecs]);

  if (rawRecs === null) {
    return (
      <div className="results-container">
        <h1>🎯 We’ve found you a Match, {name}!</h1>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  if (detailedRecs.length === 0) {
    return (
      <div className="results-container">
        <h1>🎯 We’ve found you a Match, {name}!</h1>
        <p>No recommendations available yet. Try swiping again!</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="return-button"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1>🎯 We’ve found you a Match!</h1>

      <div className="recommend-layout">
        {/* Top Pick */}
        <div className="top-pick-card">
          <div className="top-pick-left">
            <img
              src={detailedRecs[0]?.posterUrl}
              alt={detailedRecs[0]?.title}
              className="top-pick-image"
            />
          </div>
          <div className="top-pick-right">
            <h2 className="top-title">{detailedRecs[0]?.title}</h2>
            <hr className="top-divider" />
            <p className="top-genres">{detailedRecs[0]?.genres}</p>
            <p className="top-info"><strong>Duration:</strong> {detailedRecs[0]?.duration}</p>
            <p className="top-info"><strong>Director:</strong> {detailedRecs[0]?.director}</p>
            <p className="top-info"><strong>Studio:</strong> {detailedRecs[0]?.studio}</p>
            <p className="top-info"><strong>Actors:</strong> {detailedRecs[0]?.actors}</p>
          </div>
        </div>

        {/* Side Picks */}
        <div className="side-picks-container">
          {detailedRecs.slice(1, 3).map((movie, idx) => (
            <div key={idx} className="side-pick-card">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="side-pick-image"
              />
              <h4 className="side-pick-title">{movie.title}</h4>
              <p className="side-pick-genres">{movie.genres}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="return-button"
      >
        Return to Homepage
      </button>
    </div>
  );
}

export default Results;
