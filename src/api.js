import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchRatings = async (sortOrder = '') => {
  const response = await axios.get(`${API_URL}/ratings?sortOrder=${sortOrder}`);
  return response.data;
};

export const fetchAverageRating = async () => {
  const response = await axios.get(`${API_URL}/average-rating`);
  return response.data;
};

export const addRating = async (rating, comment) => {
  const response = await axios.post(`${API_URL}/rating`, { rating, comment });
  return response.data;
};
