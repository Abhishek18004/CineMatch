import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from flask import jsonify

# Initialize Firebase app (only once)
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate('serviceAccountKey.json')  # ✅ Path to your Firebase Service Account JSON
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ----------------- Register User -----------------
def register_user(data):
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        user_record = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=name
        )
        # Create Firestore document for user
        db.collection('users').document(user_record.uid).set({
            'email': email,
            'name': name,
            'solo_liked_ids': []
        })
        return jsonify({"message": "User registered", "user_id": user_record.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------- Login User -----------------
def login_user(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # ❗Firebase Admin SDK (on backend) doesn't support password auth directly.
    # Actual login should happen on the frontend via Firebase Auth JS SDK.
    # This backend endpoint is optional, for hackathon demo we can just accept dummy login

    return jsonify({"message": "Login handled on frontend via Firebase Auth SDK"}), 200

# ----------------- Save Swipe -----------------
def save_swipe(user_id, data):
    movie_id = data.get('movie_id')

    if not user_id or movie_id is None:
        return jsonify({"error": "Missing user_id or movie_id"}), 400

    try:
        user_ref = db.collection('users').document(user_id)
        user_ref.update({
            'solo_liked_ids': firestore.ArrayUnion([movie_id])
        })
        return jsonify({"message": f"Movie {movie_id} saved for user {user_id}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
