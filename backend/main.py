# backend/main.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_config import get_liked_movie_ids
from recommendation import recommend_movies
import auth

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "🎬 Movie Recommendation API is running!"})

@app.route('/recommend', methods=['GET', 'POST'])
def recommend_endpoint():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get("session_id")
    else:
        user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id or session_id"}), 400

    # ✅ Fetch liked movie IDs from Firestore guests/{user_id}
    liked_movie_ids = get_liked_movie_ids(user_id)
    print(f"[INFO] Liked movies for {user_id}: {liked_movie_ids}")

    if not liked_movie_ids:
        return jsonify({"message": f"No swipes found for user: {user_id}"}), 200

    recommendations = recommend_movies(user_id, top_n=3)
    return jsonify(recommendations)

@app.route('/register', methods=['POST'])
def register():
    return auth.register_user(request.json)

@app.route('/login', methods=['POST'])
def login():
    return auth.login_user(request.json)

@app.route('/swipe', methods=['POST'])
def swipe():
    data = request.json
    user_id = data.get('user_id')
    return auth.save_swipe(user_id, data)

if __name__ == "__main__":
    app.run(debug=True)
