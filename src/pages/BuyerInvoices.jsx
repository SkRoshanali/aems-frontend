import { useGetMyOrdersQuery } from '../api/orderApi';
import Layout from '../components/Layout';
import { formatCurrency, formatDate } from '../utils/formatters';

function BuyerInvoices() {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  // Filter orders that have invoices (approved or shipped orders)
  const ordersWithInvoices = orders?.filter(order => 
    order.status === 'APPROVED' || 
    order.status === 'SHIPPED' || 
    order.status === 'DELIVERED'
  );

  const handleDownloadInvoice = (orderId) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const url = `${apiBaseUrl}/invoices/${orderId}/download`;
    const token = localStorage.getItem('token');
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        a.click();
      })
      .catch(error => {
        console.error('Error downloading invoice:', error);
      });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-600 mt-1">Download and view your invoices</p>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        ) : ordersWithInvoices && ordersWithInvoices.length > 0 ? (
          <div className="space-y-4">
            {ordersWithInvoices.map((order) => (
              <div key={order.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invoice for Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order Date: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : 'primary'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Crop</p>
                    <p className="font-medium">{order.stock?.crop?.cropName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                    <p className="font-medium">{order.quantity} {order.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-semibold text-primary text-lg">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="btn btn-primary text-sm"
                  >
                    📥 Download Invoice PDF
                  </button>
                  <button className="btn btn-ghost text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500 mb-4">No invoices available yet</p>
            <p className="text-sm text-gray-400">
              Invoices are generated when your orders are approved
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BuyerInvoices;
