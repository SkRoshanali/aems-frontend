import { useState } from 'react';
import { useGetStockReportQuery, useGetSalesReportQuery, useGetRevenueReportQuery } from '../api/reportApi';
import Layout from '../components/Layout';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

function InternalReports() {
  const [reportType, setReportType] = useState('stock');
  const [activeOnly, setActiveOnly] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data: stockReport, isLoading: stockLoading } = useGetStockReportQuery(
    { activeOnly },
    { skip: reportType !== 'stock' }
  );

  const { data: salesReport, isLoading: salesLoading } = useGetSalesReportQuery(
    {},
    { skip: reportType !== 'sales' }
  );

  const { data: revenueReport, isLoading: revenueLoading } = useGetRevenueReportQuery(
    { year, month },
    { skip: reportType !== 'revenue' }
  );

  const handleExportStock = () => {
    const url = `http://localhost:8080/api/reports/stocks/excel?activeOnly=${activeOnly}`;
    const token = localStorage.getItem('token');
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stock-report.xlsx';
        a.click();
      });
  };

  const handleExportSales = () => {
    const url = `http://localhost:8080/api/reports/sales/excel`;
    const token = localStorage.getItem('token');
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales-report.xlsx';
        a.click();
      });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and export business reports</p>
        </div>

        {/* Report Type Selector */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Report:</label>
            <div className="flex space-x-2">
              {['stock', 'sales', 'revenue'].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    reportType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type} Report
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Report */}
        {reportType === 'stock' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeOnly}
                      onChange={(e) => setActiveOnly(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Active stocks only</span>
                  </label>
                </div>
                <button onClick={handleExportStock} className="btn btn-primary">
                  📥 Export to Excel
                </button>
              </div>
            </div>

            {stockLoading ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Loading stock report...</p>
              </div>
            ) : stockReport && stockReport.length > 0 ? (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer/Source</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stockReport.map((item) => (
                      <tr key={item.stockId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{item.cropName}</td>
                        <td className="px-4 py-3 text-sm">{item.category}</td>
                        <td className="px-4 py-3 text-sm">{item.farmerName || item.importSourceName}</td>
                        <td className="px-4 py-3 text-sm">{item.country}</td>
                        <td className="px-4 py-3 text-sm">{formatNumber(item.quantity)} {item.unit}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(item.pricePerUnit)}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(item.totalValue)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="badge badge-success">{item.qualityGrade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No stock data available</p>
              </div>
            )}
          </div>
        )}

        {/* Sales Report */}
        {reportType === 'sales' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sales Report</h2>
                <button onClick={handleExportSales} className="btn btn-primary">
                  📥 Export to Excel
                </button>
              </div>
            </div>

            {salesLoading ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Loading sales report...</p>
              </div>
            ) : salesReport && salesReport.length > 0 ? (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salesReport.map((sale) => (
                      <tr key={sale.orderId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{sale.orderNumber}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(sale.orderDate)}</td>
                        <td className="px-4 py-3 text-sm">{sale.buyerName}</td>
                        <td className="px-4 py-3 text-sm">{sale.cropName}</td>
                        <td className="px-4 py-3 text-sm">{formatNumber(sale.quantity)} {sale.unit}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(sale.totalAmount)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`badge badge-${sale.status === 'DELIVERED' ? 'success' : 'primary'}`}>
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        )}

        {/* Revenue Report */}
        {reportType === 'revenue' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="input w-32"
                      min="2020"
                      max="2030"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="input w-40"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {revenueLoading ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Loading revenue report...</p>
              </div>
            ) : revenueReport ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Revenue Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period:</span>
                      <span className="font-semibold">{revenueReport.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-semibold">{revenueReport.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Orders:</span>
                      <span className="font-semibold text-success">{revenueReport.completedOrders}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-bold text-primary text-lg">
                        {formatCurrency(revenueReport.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tax (18%):</span>
                      <span className="font-semibold">{formatCurrency(revenueReport.totalTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Revenue:</span>
                      <span className="font-bold text-success text-lg">
                        {formatCurrency(revenueReport.netRevenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(revenueReport.averageOrderValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Top Selling Crop</p>
                      <p className="text-xl font-semibold">🌾 {revenueReport.topCrop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Top Buyer</p>
                      <p className="text-xl font-semibold">👤 {revenueReport.topBuyer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No revenue data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InternalReports;
