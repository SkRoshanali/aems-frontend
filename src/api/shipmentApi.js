import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shipmentApi = createApi({
  reducerPath: 'shipmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/shipments`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Shipment'],
  endpoints: (builder) => ({
    getAllShipments: builder.query({
      query: () => '',
      providesTags: ['Shipment'],
    }),
    getShipmentById: builder.query({
      query: (id) => `/${id}`,
    }),
    getShipmentByOrderId: builder.query({
      query: (orderId) => `/order/${orderId}`,
    }),
    trackShipment: builder.query({
      query: (trackingNumber) => `/tracking/${trackingNumber}`,
    }),
    createShipment: builder.mutation({
      query: (shipment) => ({
        url: '',
        method: 'POST',
        body: shipment,
      }),
      invalidatesTags: ['Shipment', 'Order'],
    }),
    updateShipmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        params: { status },
      }),
      invalidatesTags: ['Shipment', 'Order'],
    }),
  }),
});

export const {
  useGetAllShipmentsQuery,
  useGetShipmentByIdQuery,
  useGetShipmentByOrderIdQuery,
  useTrackShipmentQuery,
  useCreateShipmentMutation,
  useUpdateShipmentStatusMutation,
} = shipmentApi;
