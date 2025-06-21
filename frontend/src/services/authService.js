// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Update with your backend URL

export const login = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async ({ name, email, password }) => {
  const response = await axios.post(`${API_URL}/register`, { 
    name, 
    email, 
    password 
  });
  return response.data;
};

export const logout = async () => {
  // You might want to call your backend logout endpoint here
  // For now, we'll just clear the frontend
  localStorage.removeItem('token');
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};