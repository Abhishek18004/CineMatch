// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import GenreSelector from "../components/GenreSelector";
import { getGenres } from "../api/tmdb";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (name.trim() && emoji.trim() && selectedGenres.length > 0) {
      const userId = `guest_${Date.now()}`;
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("emoji", emoji);
      sessionStorage.setItem("genres", JSON.stringify(selectedGenres));
      sessionStorage.setItem("user_id", userId); // ✅ Set user_id
      sessionStorage.setItem("session_id", userId); // ✅ Also set session_id (optional)
      navigate("/swipe");
    } else {
      alert("Please fill in your name, emoji, and select at least one genre.");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to CineMatch</h1>
      <h2>Create your guest profile:</h2>

      <div className="form__group">
        <input
          type="text"
          className="form__field"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="form__label">Name</label>
      </div>

      <div className="emoji-bar" onClick={() => setShowPicker(!showPicker)}>
        {emoji ? (
          <span className="emoji-preview">{emoji}</span>
        ) : (
          <span className="emoji-placeholder">🙂 Pick Emoji</span>
        )}
      </div>

      {showPicker && (
        <div className="picker-container">
          <EmojiPicker
            onEmojiClick={(e) => {
              setEmoji(e.emoji);
              setShowPicker(false);
            }}
            height={350}
          />
        </div>
      )}

      <GenreSelector
        genres={genres}
        selectedGenres={selectedGenres}
        onToggle={toggleGenre}
      />

      <div className="button-container">
        <button className="button" onClick={handleContinue}>
          <span>Start Swiping</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
