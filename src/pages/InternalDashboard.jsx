import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useGetDashboardStatsQuery } from '../api/reportApi';
import Layout from '../components/Layout';
import { formatCurrency, formatNumber } from '../utils/formatters';

function InternalDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Role: <span className="font-medium text-primary">{user?.role}</span>
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-success/10 to-success/5 border-l-4 border-success">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(stats?.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border-l-4 border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(stats?.monthlyRevenue || 0)}
                    </p>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border-l-4 border-secondary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-secondary">
                      {formatNumber(stats?.totalOrders || 0)}
                    </p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-warning">{stats?.pendingOrders || 0}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Approved Orders</p>
                <p className="text-2xl font-bold text-success">{stats?.approvedOrders || 0}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Completed Orders</p>
                <p className="text-2xl font-bold text-primary">{stats?.completedOrders || 0}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">In Transit</p>
                <p className="text-2xl font-bold text-primary">{stats?.inTransitShipments || 0}</p>
              </div>
            </div>

            {/* Inventory & Users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Stocks</span>
                    <span className="font-semibold">{stats?.totalStocks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Stocks</span>
                    <span className="font-semibold text-success">{stats?.activeStocks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Farmers</span>
                    <span className="font-semibold">{stats?.totalFarmers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verified Farmers</span>
                    <span className="font-semibold text-success">{stats?.verifiedFarmers || 0}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Buyers & Invoices</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Buyers</span>
                    <span className="font-semibold">{stats?.totalBuyers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Buyers</span>
                    <span className="font-semibold text-success">{stats?.activeBuyers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Invoices</span>
                    <span className="font-semibold">{stats?.totalInvoices || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paid Invoices</span>
                    <span className="font-semibold text-success">{stats?.paidInvoices || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overdue Invoices</span>
                    <span className="font-semibold text-danger">{stats?.overdueInvoices || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/internal/orders" className="btn btn-primary">
                  📦 Orders
                </Link>
                <Link to="/internal/stock" className="btn btn-ghost">
                  🌾 Stock
                </Link>
                <Link to="/internal/farmers" className="btn btn-ghost">
                  👨‍🌾 Farmers
                </Link>
                <Link to="/internal/reports" className="btn btn-ghost">
                  📊 Reports
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default InternalDashboard;
