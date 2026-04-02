import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/reports`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStockReport: builder.query({
      query: (params) => ({
        url: '/stocks',
        params,
      }),
    }),
    getSalesReport: builder.query({
      query: (params) => ({
        url: '/sales',
        params,
      }),
    }),
    getRevenueReport: builder.query({
      query: (params) => ({
        url: '/revenue',
        params,
      }),
    }),
    getDashboardStats: builder.query({
      query: () => '/dashboard',
    }),
  }),
});

export const {
  useGetStockReportQuery,
  useGetSalesReportQuery,
  useGetRevenueReportQuery,
  useGetDashboardStatsQuery,
} = reportApi;
