import React from "react";
import "./GenreSelector.css";

function GenreSelector({ genres, selectedGenres, onToggle }) {
  return (
    <div className="genre-selector">
      <h2>Select Your Favorite Genres 🎭</h2>
      <div className="genre-grid">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-btn ${selectedGenres.includes(genre.id) ? "selected" : ""}`}
            onClick={() => onToggle(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreSelector;
