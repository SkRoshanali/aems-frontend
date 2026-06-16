import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendChatQuery } from '../../api/chatService';

// Async thunk for sending messages
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ query }, { rejectWithValue }) => {
    try {
      // Only send query - Spring Boot extracts role from JWT
      const response = await sendChatQuery(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isOpen: false,
    isLoading: false,
    isWakingUp: false,  // Track Render cold start
    error: null,
    userRole: null,
  },
  reducers: {
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    setWakingUp: (state, action) => {
      state.isWakingUp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Add user message immediately
        state.messages.push({
          type: 'user',
          content: action.meta.arg.query,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isWakingUp = false;
        // Add AI response
        state.messages.push({
          type: 'ai',
          content: action.payload.answer,
          sources: action.payload.sources,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        const errorMsg = action.payload;
        
        // Safely check if errorMsg is a string or an object with a message property
        const errorMessageStr = typeof errorMsg === 'string' 
          ? errorMsg 
          : (errorMsg?.message || JSON.stringify(errorMsg) || 'Unknown error');
        
        // Check if it's a cold start timeout
        if (typeof errorMessageStr === 'string' && errorMessageStr.includes('waking up')) {
          state.isWakingUp = true;
          state.messages.push({
            type: 'system',
            content: '⏳ The AI assistant is waking up (Render free tier). This takes ~30 seconds. Please try again in a moment...',
            timestamp: new Date().toISOString(),
          });
        } else {
          state.error = errorMessageStr;
          state.messages.push({
            type: 'error',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date().toISOString(),
          });
        }
      });
  },
});

export const { openChat, closeChat, setUserRole, clearChat, setWakingUp } = chatSlice.actions;
export default chatSlice.reducer;
