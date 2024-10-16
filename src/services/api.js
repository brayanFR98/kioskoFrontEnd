import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Apunta a la URL del backend

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};


export const getFeeds = async (token, page = 1, limit = 10, topic = '', orderBy = 'created_at') => {
  return await axios.get(`${API_URL}/feeds`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, topic, orderBy }  // Enviar los parámetros
  });
};

export const createFeed = async (feedData, token) => {
  return await axios.post(`${API_URL}/feeds`, feedData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateFeed = async (feedId, feedData, token) => {
  return await axios.put(`${API_URL}/feeds/${feedId}`, feedData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteFeed = async (feedId, token) => {
  return await axios.delete(`${API_URL}/feeds/${feedId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

