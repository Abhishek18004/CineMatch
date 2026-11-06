from firebase_config import get_liked_movie_ids

# Change to a document ID you already created in Firestore
session_id = "test_user123"

liked_movies = get_liked_movie_ids(session_id)
print(f"Liked movies for {session_id}: {liked_movies}")
