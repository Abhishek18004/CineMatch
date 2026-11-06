// frontend/src/components/MovieCard.jsx
import React from "react";
import "./MovieCard.css";

function MovieCard({
  title,
  posterUrl,
  releaseDate = "Unknown Year",
  genres = "Unknown Genres",
  duration = "Unknown Duration",
  director = "Unknown Director",
  studio = "Unknown Studio",
  actors = "Unknown Actors",
}) {
  return (
    <div className="movie-card">
      <div className="card-left">
        <img
          src={posterUrl}
          alt={title}
          className="poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png";
          }}
        />
      </div>
      <div className="card-right">
        <h3 className="movie-title">{title}</h3>
        <hr className="divider" />
        <p className="meta">{releaseDate} | {genres}</p>
        <div className="details">
          <p><strong>Duration:</strong> {duration}</p>
          <p><strong>Director:</strong> {director}</p>
          <p><strong>Studio:</strong> {studio}</p>
          <p><strong>Actors:</strong> {actors}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
