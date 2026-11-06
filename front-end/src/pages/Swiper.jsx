// frontend/src/pages/Swiper.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getMoviesByGenres, fetchMovieDetails } from "../api/tmdb";
import { saveGuestSwipe } from "../firebase/firestoreUtils";
import "./Swiper.css";

function Swiper() {
  const [moviesToSwipe, setMoviesToSwipe] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const navigate = useNavigate();

  const name = sessionStorage.getItem("name") || "Guest";
  const emoji = sessionStorage.getItem("emoji") || "🎬";
  const selectedGenres = JSON.parse(sessionStorage.getItem("genres")) || [];
  const userId = sessionStorage.getItem("user_id") || "guest_fallback";

  useEffect(() => {
    const fetchMoviesWithDetails = async () => {
      const baseMovies = await getMoviesByGenres(selectedGenres);
      const detailed = await Promise.all(
        baseMovies.map(async (movie) => {
          const details = await fetchMovieDetails(movie.id);
          return details ? { id: movie.id, ...details } : null;
        })
      );
      setMoviesToSwipe(detailed.filter(Boolean));
    };

    fetchMoviesWithDetails();
  }, []);

  const handleSwipe = async (action) => {
    const currentMovie = moviesToSwipe[currentIndex];

    if (action === "like") {
      setLikedMovies((prev) => [...prev, currentMovie.id]);
      await saveGuestSwipe(userId, currentMovie.id);
    }

    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);

    if (newSwipeCount >= 10 || currentIndex + 1 >= moviesToSwipe.length) {
      sessionStorage.setItem("liked", JSON.stringify(likedMovies));
      navigate("/results");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (moviesToSwipe.length === 0) return <p>Loading movies...</p>;

  return (
    <div className="swiper-container">
      <div className="user-label">
        Name: {name} {emoji}
      </div>

      <div className="movie-section">
        <button className="swipe-btn skip" onClick={() => handleSwipe("skip")}>
          Skip
        </button>

        <MovieCard {...moviesToSwipe[currentIndex]} />

        <button className="swipe-btn like" onClick={() => handleSwipe("like")}>
          Like
        </button>
      </div>
    </div>
  );
}

export default Swiper;
