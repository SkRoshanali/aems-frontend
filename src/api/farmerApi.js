import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const farmerApi = createApi({
  reducerPath: 'farmerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/farmers`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Farmer'],
  endpoints: (builder) => ({
    getAllFarmers: builder.query({
      query: () => '',
      providesTags: ['Farmer'],
    }),
    getFarmerById: builder.query({
      query: (id) => `/${id}`,
    }),
    createFarmer: builder.mutation({
      query: (farmer) => ({
        url: '',
        method: 'POST',
        body: farmer,
      }),
      invalidatesTags: ['Farmer'],
    }),
    updateFarmer: builder.mutation({
      query: ({ id, ...farmer }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: farmer,
      }),
      invalidatesTags: ['Farmer'],
    }),
    verifyFarmer: builder.mutation({
      query: (id) => ({
        url: `/${id}/verify`,
        method: 'PUT',
      }),
      invalidatesTags: ['Farmer'],
    }),
    deactivateFarmer: builder.mutation({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Farmer'],
    }),
  }),
});

export const {
  useGetAllFarmersQuery,
  useGetFarmerByIdQuery,
  useCreateFarmerMutation,
  useUpdateFarmerMutation,
  useVerifyFarmerMutation,
  useDeactivateFarmerMutation,
} = farmerApi;
