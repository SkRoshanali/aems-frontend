import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/orders',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: '',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    getAllOrders: builder.query({
      query: () => '',
      providesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/my-orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/${id}`,
    }),
    approveOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    rejectOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        params: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
