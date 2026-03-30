import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config/env';

export const cropApi = createApi({
  reducerPath: 'cropApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiBaseUrl}/crops`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Crop'],
  endpoints: (builder) => ({
    getAllCrops: builder.query({
      query: () => '',
      providesTags: ['Crop'],
    }),
    getCropById: builder.query({
      query: (id) => `/${id}`,
    }),
    getActiveCrops: builder.query({
      query: () => '/active/list',
      providesTags: ['Crop'],
    }),
    createCrop: builder.mutation({
      query: (crop) => ({
        url: '',
        method: 'POST',
        body: crop,
      }),
      invalidatesTags: ['Crop'],
    }),
    updateCrop: builder.mutation({
      query: ({ id, ...crop }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: crop,
      }),
      invalidatesTags: ['Crop'],
    }),
    deactivateCrop: builder.mutation({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Crop'],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useGetCropByIdQuery,
  useGetActiveCropsQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useDeactivateCropMutation,
} = cropApi;
