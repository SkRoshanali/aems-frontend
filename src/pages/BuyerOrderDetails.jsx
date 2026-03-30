import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../api/orderApi';
import { useGetShipmentByOrderIdQuery } from '../api/shipmentApi';
import { useGetInvoiceByOrderIdQuery } from '../api/invoiceApi';
import Layout from '../components/Layout';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ORDER_STATUS_COLORS, SHIPMENT_STATUS_COLORS } from '../constants/status';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function BuyerOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: order, isLoading: orderLoading, error: orderError } = useGetOrderByIdQuery(orderId);
  const { data: shipment, isLoading: shipmentLoading } = useGetShipmentByOrderIdQuery(orderId, {
    skip: !order || (order.status !== 'SHIPPED' && order.status !== 'DELIVERED')
  });
  const { data: invoice, isLoading: invoiceLoading } = useGetInvoiceByOrderIdQuery(orderId, {
    skip: !order || (order.status !== 'APPROVED' && order.status !== 'SHIPPED' && order.status !== 'DELIVERED')
  });

  if (orderLoading) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (orderError || !order) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <p className="text-danger mb-4">Order not found</p>
          <Link to="/buyer/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/buyer/orders')}
              className="text-primary hover:underline mb-2 flex items-center"
            >
              ← Back to Orders
            </button>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]} text-lg px-4 py-2`}>
            {order.status}
          </span>
        </div>

        {/* Order Details */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Crop</p>
              <p className="font-medium text-lg">{order.stock?.crop?.cropName || 'N/A'}</p>
              <p className="text-sm text-gray-500">{order.stock?.crop?.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Quality</p>
              <p className="font-medium">{order.stock?.quality || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="font-medium text-lg">{order.quantity} {order.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price per Unit</p>
              <p className="font-medium">{formatCurrency(order.pricePerUnit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-semibold text-primary text-2xl">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            {order.approvedAt && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved On</p>
                <p className="font-medium">{formatDateTime(order.approvedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="text-gray-700">
              <p>{order.deliveryAddress}</p>
              <p>{order.deliveryCity}, {order.deliveryState} {order.deliveryZip}</p>
              <p>{order.deliveryCountry}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {order.rejectionReason && (
          <div className="card bg-danger/10 border-danger/20">
            <h2 className="text-xl font-semibold text-danger mb-4">Rejection Reason</h2>
            <p className="text-gray-700">{order.rejectionReason}</p>
          </div>
        )}

        {/* Shipment Tracking */}
        {shipment && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono font-semibold text-lg">{shipment.trackingNumber}</p>
                </div>
                <span className={`badge badge-${SHIPMENT_STATUS_COLORS[shipment.status]} text-lg px-4 py-2`}>
                  {shipment.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Carrier</p>
                  <p className="font-medium">{shipment.carrier || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipped Date</p>
                  <p className="font-medium">{formatDateTime(shipment.shippedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="font-medium">{formatDateTime(shipment.estimatedDelivery)}</p>
                </div>
              </div>

              {shipment.actualDelivery && (
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Delivered On</p>
                  <p className="font-semibold text-success text-lg">
                    {formatDateTime(shipment.actualDelivery)}
                  </p>
                </div>
              )}

              {shipment.notes && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Shipment Notes</p>
                  <p className="text-sm">{shipment.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice */}
        {invoice && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Invoice</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
                  <p className="font-mono font-semibold">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
                  <p className="font-medium">{formatDateTime(invoice.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Due Date</p>
                  <p className="font-medium">{formatDateTime(invoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`badge badge-${invoice.status === 'PAID' ? 'success' : 'warning'}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxPercentage}%)</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/buyer/invoices/${invoice.id}`}
                className="btn btn-primary w-full"
              >
                View Invoice Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BuyerOrderDetails;
