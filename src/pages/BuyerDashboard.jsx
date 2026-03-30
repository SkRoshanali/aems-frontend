import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useGetMyOrdersQuery } from '../api/orderApi';
import Layout from '../components/Layout';

function BuyerDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  const pendingOrders = orders?.filter(o => o.status === 'PENDING').length || 0;
  const approvedOrders = orders?.filter(o => o.status === 'APPROVED').length || 0;
  const shippedOrders = orders?.filter(o => o.status === 'SHIPPED').length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border-l-4 border-warning">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-warning">{pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success/10 to-success/5 border-l-4 border-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Orders</p>
                <p className="text-3xl font-bold text-success">{approvedOrders}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-primary">{shippedOrders}</p>
              </div>
              <div className="text-4xl">🚚</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/storefront"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="text-3xl mr-4">🌾</div>
              <div>
                <h3 className="font-semibold">Browse Crops</h3>
                <p className="text-sm text-gray-600">View available inventory</p>
              </div>
            </Link>

            <Link
              to="/buyer/orders"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="text-3xl mr-4">📦</div>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-gray-600">View order history</p>
              </div>
            </Link>

            <Link
              to="/buyer/invoices"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="text-3xl mr-4">📄</div>
              <div>
                <h3 className="font-semibold">Invoices</h3>
                <p className="text-sm text-gray-600">Download invoices</p>
              </div>
            </Link>

            <Link
              to="/buyer/profile"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="text-3xl mr-4">👤</div>
              <div>
                <h3 className="font-semibold">Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-primary hover:underline text-sm">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.stock?.crop?.cropName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.quantity} {order.unit}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`badge badge-${order.status === 'PENDING' ? 'warning' : order.status === 'APPROVED' ? 'success' : 'primary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link to="/storefront" className="btn btn-primary">
                Browse Crops
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default BuyerDashboard;
