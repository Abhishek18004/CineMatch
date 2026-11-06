// frontend/src/api/recommend.js
import axiosClient from './axiosClient';

/**
 * ✅ Fetch recommendations from Flask backend
 * Sends GET request → /recommend?user_id=xyz
 */
export const getRecommendations = async (user_id) => {
  try {
    const response = await axiosClient.get("/recommend", {
      params: { user_id },
    });

    return response.data;
  } catch (error) {
    console.error("🔥 Error fetching recommendations:", error);
    return [];
  }
};
