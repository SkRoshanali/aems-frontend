import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/invoices`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: () => '',
      providesTags: ['Invoice'],
    }),
    getInvoiceById: builder.query({
      query: (id) => `/${id}`,
    }),
    getInvoiceByOrderId: builder.query({
      query: (orderId) => `/order/${orderId}`,
    }),
    createInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/generate/${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    downloadInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/${invoiceId}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetInvoiceByOrderIdQuery,
  useCreateInvoiceMutation,
  useDownloadInvoiceMutation,
} = invoiceApi;