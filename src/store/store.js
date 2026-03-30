import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { authApi } from '../api/authApi';
import { stockApi } from '../api/stockApi';
import { orderApi } from '../api/orderApi';
import { farmerApi } from '../api/farmerApi';
import { importApi } from '../api/importApi';
import { reportApi } from '../api/reportApi';
import { userApi } from '../api/userApi';
import { shipmentApi } from '../api/shipmentApi';
import { cropApi } from '../api/cropApi';
import { invoiceApi } from '../api/invoiceApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [farmerApi.reducerPath]: farmerApi.reducer,
    [importApi.reducerPath]: importApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
    [cropApi.reducerPath]: cropApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      stockApi.middleware,
      orderApi.middleware,
      farmerApi.middleware,
      importApi.middleware,
      reportApi.middleware,
      userApi.middleware,
      shipmentApi.middleware,
      cropApi.middleware,
      invoiceApi.middleware
    ),
});
