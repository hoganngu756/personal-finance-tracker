// src/services/transactionService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/transactions'; // Update with your backend URL

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getTransactions = async (token, params = {}) => {
  const response = await axios.get(API_URL, {
    ...getAuthHeader(token),
    params,
  });
  return response.data;
};

export const addTransaction = async (token, transaction) => {
  const response = await axios.post(API_URL, transaction, getAuthHeader(token));
  return response.data;
};

export const updateTransaction = async (token, id, transaction) => {
  const response = await axios.put(`${API_URL}/${id}`, transaction, getAuthHeader(token));
  return response.data;
};

export const deleteTransaction = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};