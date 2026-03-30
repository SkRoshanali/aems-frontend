import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../api/orderApi';
import Layout from '../components/Layout';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ORDER_STATUS_COLORS } from '../constants/status';

function BuyerOrders() {
  const { data: orders, isLoading } = useGetMyOrdersQuery();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders?.filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  );

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'REJECTED', 'CANCELLED'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">View and track all your orders</p>
          </div>
          <Link to="/storefront" className="btn btn-primary">
            + New Order
          </Link>
        </div>

        {/* Filter */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Crop</p>
                    <p className="font-medium">{order.stock?.crop?.cropName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                    <p className="font-medium">{order.quantity} {order.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price per Unit</p>
                    <p className="font-medium">{formatCurrency(order.pricePerUnit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-semibold text-primary text-lg">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                    <p className="text-sm">
                      {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState} {order.deliveryZip}
                    </p>
                    <p className="text-sm">{order.deliveryCountry}</p>
                  </div>
                )}

                {order.rejectionReason && (
                  <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                    <p className="text-sm font-medium text-danger mb-1">Rejection Reason</p>
                    <p className="text-sm text-gray-700">{order.rejectionReason}</p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Link
                    to={`/buyer/orders/${order.id}`}
                    className="btn btn-ghost text-sm"
                  >
                    View Details
                  </Link>
                  {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                    <Link
                      to={`/buyer/orders/${order.id}`}
                      className="btn btn-primary text-sm"
                    >
                      Track Shipment
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">
              {statusFilter === 'ALL' 
                ? 'No orders yet' 
                : `No ${statusFilter.toLowerCase()} orders`}
            </p>
            <Link to="/storefront" className="btn btn-primary">
              Browse Crops
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BuyerOrders;
