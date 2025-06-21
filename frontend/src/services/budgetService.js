// src/services/budgetService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/budgets'; // Update with your backend URL

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getBudgets = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

export const addBudget = async (token, budget) => {
  const response = await axios.post(API_URL, budget, getAuthHeader(token));
  return response.data;
};

export const updateBudget = async (token, id, budget) => {
  const response = await axios.put(`${API_URL}/${id}`, budget, getAuthHeader(token));
  return response.data;
};

export const deleteBudget = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};