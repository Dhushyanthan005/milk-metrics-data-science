import apiClient from '../config/api';

/**
 * Reusable API Service to interact with the FastAPI backend.
 * Encapsulates endpoints and handles errors consistently.
 */
const apiService = {
  /**
   * Run predictive inference through the XGBoost model
   * @param {Object} payload - Gathers cow and climate features
   * @returns {Promise<Object>} - Predicted yield, timestamp, model version, and confidence msg
   */
  predict: async (payload) => {
    try {
      const response = await apiClient.post('/predict', payload);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error during predict API service execution:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Prediction request failed.',
      };
    }
  },

  /**
   * Fetch aggregated analytics computed from stored farm observations
   * @returns {Promise<Object>} - Averages of yield, temperature, feed, and distribution counts
   */
  getAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error during getAnalytics API service execution:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch analytics summaries.',
      };
    }
  },

  /**
   * Fetch relative feature importance (gain) rankings from the XGBoost model
   * @returns {Promise<Object>} - Chart.js formatted labels and dataset percentages
   */
  getFeatureImportance: async () => {
    try {
      const response = await apiClient.get('/feature-importance');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error during getFeatureImportance API service execution:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch feature rankings.',
      };
    }
  },

  /**
   * Fetch prediction audit logs stored in the local repository
   * @returns {Promise<Array>} - List of recent prediction history items
   */
  getHistory: async () => {
    try {
      const response = await apiClient.get('/history');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error during getHistory API service execution:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch prediction logs.',
      };
    }
  },
  
  /**
   * Health check ping to inspect connection state
   * @returns {Promise<boolean>}
   */
  pingHealth: async () => {
    try {
      const response = await apiClient.get('/');
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }
};

export default apiService;
