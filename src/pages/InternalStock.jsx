import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllStocksQuery } from '../api/stockApi';
import Layout from '../components/Layout';
import { formatCurrency, formatNumber } from '../utils/formatters';

function InternalStock() {
  const navigate = useNavigate();
  const { data: stocks, isLoading } = useGetAllStocksQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleAddStock = () => {
    navigate('/internal/stock/add');
  };

  const filteredStocks = stocks?.filter(stock => {
    const matchesSearch = stock.crop?.cropName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = activeFilter === 'ALL' || 
      (activeFilter === 'ACTIVE' && stock.isActive) ||
      (activeFilter === 'INACTIVE' && !stock.isActive);
    return matchesSearch && matchesActive;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Stock Management</h1>
            <p className="text-gray-600 mt-1">Manage inventory and stock levels</p>
          </div>
          <button onClick={handleAddStock} className="btn btn-primary">
            + Add Stock
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stock
              </label>
              <input
                type="text"
                placeholder="Search by crop name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex space-x-2">
                {['ALL', 'ACTIVE', 'INACTIVE'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading stock...</p>
          </div>
        ) : filteredStocks && filteredStocks.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStocks.map((stock) => {
                  const totalValue = stock.quantity * stock.pricePerUnit;
                  return (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {stock.crop?.cropName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {stock.crop?.category || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(stock.quantity)} {stock.unit}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-primary">
                        {formatCurrency(stock.pricePerUnit)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {stock.farmer?.fullName || stock.importSource?.companyName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {stock.quality ? (
                          <span className="badge badge-success">{stock.quality}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`badge ${stock.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {stock.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="text-primary hover:underline">Edit</button>
                          <button className="text-gray-600 hover:underline">View</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">No stock items found</p>
            <button onClick={handleAddStock} className="btn btn-primary">
              Add First Stock
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InternalStock;
