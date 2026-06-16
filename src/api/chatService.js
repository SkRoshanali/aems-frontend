import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

/**
 * Send chat query to Spring Boot backend
 * 
 * SECURITY: Always go through Spring Boot, never call Python RAG directly!
 * Spring Boot extracts role from verified JWT and forwards to Python.
 * This prevents role spoofing attacks where a buyer could claim to be admin.
 */
export const sendChatQuery = async (query) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/query`,
      { query },  // Only send query, NOT role - Spring Boot gets role from JWT
      {
        timeout: 40000, // 40 seconds - generous for Render cold start + RAG pipeline
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Chat query failed:', error);
    
    // Handle timeout (Render cold start)
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('The assistant is waking up, please try again in a moment...');
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server. Please check your connection.');
    }
    
    throw error;
  }
};

/**
 * Warm up both Spring Boot AND Python RAG service
 * Render free tier spins down both services independently
 * Call this on app load to reduce initial chat latency
 */
export const wakeUpBackend = async () => {
  try {
    // Wake up Spring Boot + Python in one call
    await axios.get(`${API_BASE_URL}/chat/warmup`, { 
      timeout: 5000,
      // No auth needed for warmup endpoint
    });
  } catch (error) {
    // Ignore errors - this is best-effort ping
    console.log('Backend wake-up ping sent (may timeout, but still wakes services)');
  }
};
