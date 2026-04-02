import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const importApi = createApi({
  reducerPath: 'importApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/import-sources`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Import'],
  endpoints: (builder) => ({
    getAllImportSources: builder.query({
      query: () => '',
      providesTags: ['Import'],
    }),
    getImportSourceById: builder.query({
      query: (id) => `/${id}`,
    }),
    createImportSource: builder.mutation({
      query: (importSource) => ({
        url: '',
        method: 'POST',
        body: importSource,
      }),
      invalidatesTags: ['Import'],
    }),
    updateImportSource: builder.mutation({
      query: ({ id, ...importSource }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: importSource,
      }),
      invalidatesTags: ['Import'],
    }),
  }),
});

export const {
  useGetAllImportSourcesQuery,
  useGetImportSourceByIdQuery,
  useCreateImportSourceMutation,
  useUpdateImportSourceMutation,
} = importApi;
