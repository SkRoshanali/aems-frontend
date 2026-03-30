import { useState } from 'react';
import Layout from '../components/Layout';

function InternalAudit() {
  // Mock audit log data - in production, this would come from an API
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2026-03-27T10:30:00',
      user: 'admin@aems.com',
      action: 'ORDER_APPROVED',
      entity: 'Order',
      entityId: 'ORD-1001',
      details: 'Approved order for 500 KG Rice',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      timestamp: '2026-03-27T09:15:00',
      user: 'manager@aems.com',
      action: 'STOCK_CREATED',
      entity: 'Stock',
      entityId: 'STK-2045',
      details: 'Added new stock entry: 1000 KG Wheat',
      ipAddress: '192.168.1.101',
    },
    {
      id: 3,
      timestamp: '2026-03-27T08:45:00',
      user: 'admin@aems.com',
      action: 'BUYER_APPROVED',
      entity: 'User',
      entityId: 'USR-3012',
      details: 'Approved buyer registration for ABC Trading Co.',
      ipAddress: '192.168.1.100',
    },
    {
      id: 4,
      timestamp: '2026-03-26T16:20:00',
      user: 'employee@aems.com',
      action: 'SHIPMENT_UPDATED',
      entity: 'Shipment',
      entityId: 'SHP-5678',
      details: 'Updated shipment status to IN_TRANSIT',
      ipAddress: '192.168.1.102',
    },
    {
      id: 5,
      timestamp: '2026-03-26T14:10:00',
      user: 'admin@aems.com',
      action: 'FARMER_VERIFIED',
      entity: 'Farmer',
      entityId: 'FRM-4023',
      details: 'Verified farmer: John Doe Farms',
      ipAddress: '192.168.1.100',
    },
  ]);

  const [filters, setFilters] = useState({
    action: '',
    entity: '',
    user: '',
    dateFrom: '',
    dateTo: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATED') || action.includes('APPROVED')) return 'badge-success';
    if (action.includes('UPDATED')) return 'badge-info';
    if (action.includes('DELETED') || action.includes('REJECTED')) return 'badge-error';
    return 'badge-warning';
  };

  const filteredLogs = logs.filter(log => {
    if (filters.action && !log.action.includes(filters.action)) return false;
    if (filters.entity && log.entity !== filters.entity) return false;
    if (filters.user && !log.user.includes(filters.user)) return false;
    if (filters.dateFrom && log.timestamp < filters.dateFrom) return false;
    if (filters.dateTo && log.timestamp > filters.dateTo) return false;
    return true;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">Track all system activities and changes</p>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Actions</option>
              <option value="CREATED">Created</option>
              <option value="UPDATED">Updated</option>
              <option value="DELETED">Deleted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity
            </label>
            <select
              name="entity"
              value={filters.entity}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Entities</option>
              <option value="Order">Order</option>
              <option value="Stock">Stock</option>
              <option value="User">User</option>
              <option value="Farmer">Farmer</option>
              <option value="Shipment">Shipment</option>
              <option value="Invoice">Invoice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <input
              type="text"
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              className="input"
              placeholder="Search user..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.entity} #{log.entityId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No audit logs found matching the filters
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InternalAudit;
