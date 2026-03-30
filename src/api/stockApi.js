import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config/env';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stock'],
  endpoints: (builder) => ({
    getPublicStocks: builder.query({
      query: () => '/public/stocks',
      providesTags: ['Stock'],
    }),
    getPublicStockById: builder.query({
      query: (id) => `/public/stocks/${id}`,
    }),
    getAllStocks: builder.query({
      query: () => '/stocks',
      providesTags: ['Stock'],
    }),
    getStockById: builder.query({
      query: (id) => `/stocks/${id}`,
    }),
    createStock: builder.mutation({
      query: (stock) => ({
        url: '/stocks',
        method: 'POST',
        body: stock,
      }),
      invalidatesTags: ['Stock'],
    }),
    updateStock: builder.mutation({
      query: ({ id, ...stock }) => ({
        url: `/stocks/${id}`,
        method: 'PUT',
        body: stock,
      }),
      invalidatesTags: ['Stock'],
    }),
    deactivateStock: builder.mutation({
      query: (id) => ({
        url: `/stocks/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Stock'],
    }),
  }),
});

export const {
  useGetPublicStocksQuery,
  useGetPublicStockByIdQuery,
  useGetAllStocksQuery,
  useGetStockByIdQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeactivateStockMutation,
} = stockApi;
