# backend/recommendation.py

import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from firebase_config import get_liked_movie_ids

# ✅ Path to your vectorized movie embeddings
PICKLE_FILE_PATH = r"C:\Users\HP\Documents\Projects\CineMatch\backend\dataset\vectorized_movies.pkl"

with open(PICKLE_FILE_PATH, "rb") as file:
    movie_data = pickle.load(file)

movie_vectors = np.stack(movie_data.values)
movie_ids = list(movie_data.index)

def recommend_movies(user_id, top_n=5):
    liked_movie_ids = get_liked_movie_ids(user_id)
    print(f"[INFO] Generating recommendations for {user_id}, liked: {liked_movie_ids}")

    if not liked_movie_ids:
        print(f"[WARN] No liked movies for user {user_id}")
        return []

    # ✅ Filter liked movie IDs that exist in the dataset
    liked_indices = [i for i, mid in enumerate(movie_ids) if mid in liked_movie_ids]
    if not liked_indices:
        print(f"[WARN] Liked movie IDs not found in vector dataset for user {user_id}")
        return []

    liked_vectors = movie_vectors[liked_indices]
    similarities = cosine_similarity(liked_vectors, movie_vectors)
    avg_similarity = np.mean(similarities, axis=0)

    ranked_indices = np.argsort(avg_similarity)[::-1]  # Descending

    recommendations = []
    for idx in ranked_indices:
        mid = movie_ids[idx]
        if mid not in liked_movie_ids:  # ✅ Don’t recommend what user already liked
            recommendations.append({"movie_id": mid})
        if len(recommendations) == top_n:
            break

    print(f"[INFO] Recommendations for {user_id}: {[r['movie_id'] for r in recommendations]}")
    return recommendations
