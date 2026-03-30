import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  modal: {
    show: false,
    title: '',
    content: null,
    onConfirm: null,
  },
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    showModal: (state, action) => {
      state.modal = {
        show: true,
        title: action.payload.title,
        content: action.payload.content,
        onConfirm: action.payload.onConfirm,
      };
    },
    hideModal: (state) => {
      state.modal.show = false;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setLoading, showToast, hideToast, showModal, hideModal, toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;
