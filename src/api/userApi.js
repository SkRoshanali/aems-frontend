import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Buyer'],
  endpoints: (builder) => ({
    getPendingBuyers: builder.query({
      query: () => '/buyers/pending',
      providesTags: ['Buyer'],
    }),
    registerBuyer: builder.mutation({
      query: (buyerData) => ({
        url: '/public/register-buyer',
        method: 'POST',
        body: buyerData,
      }),
    }),
    approveBuyer: builder.mutation({
      query: (id) => ({
        url: `/buyers/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Buyer'],
    }),
    rejectBuyer: builder.mutation({
      query: (id) => ({
        url: `/buyers/${id}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: ['Buyer'],
    }),
  }),
});

export const {
  useGetPendingBuyersQuery,
  useRegisterBuyerMutation,
  useApproveBuyerMutation,
  useRejectBuyerMutation,
} = userApi;
