import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const emergencyAPI = {
  // Report new emergency
  reportEmergency: async (emergencyData) => {
    try {
      const response = await api.post('/emergencies', emergencyData);
      return response.data;
    } catch (error) {
      console.error('Error reporting emergency:', error);
      throw error;
    }
  },

  // Get user's emergencies
  getUserEmergencies: async (phoneNumber) => {
    try {
      const response = await api.get(`/emergencies/user/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error getting emergencies:', error);
      throw error;
    }
  },
};

export const authAPI = {
  // Register user
  registerUser: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Verify phone
  verifyPhone: async (phoneNumber, code) => {
    try {
      const response = await api.post('/auth/verify-phone', { phoneNumber, code });
      return response.data;
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  },
};
