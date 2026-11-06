import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_liked_movie_ids(user_id):
    """
    Fetches the list of liked movie IDs from Firestore for the given user.
    """
    doc_ref = db.collection('guests').document(user_id)
    doc = doc_ref.get()

    if doc.exists and 'liked' in doc.to_dict():
        return doc.to_dict()['liked']  # ✅ changed from 'solo_liked_ids' to 'liked'
    else:
        return []

def save_swipe_to_firestore(user_id, movie_id):
    """
    Adds movie_id to 'liked' array for given user in Firestore.
    Creates the user document if it doesn't exist.
    """
    user_ref = db.collection('guests').document(user_id)
    doc = user_ref.get()

    if doc.exists:
        user_ref.update({
            'liked': firestore.ArrayUnion([movie_id])  # ✅ updated field name
        })
    else:
        user_ref.set({
            'liked': [movie_id]  # ✅ updated field name
        })
