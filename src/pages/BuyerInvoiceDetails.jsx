import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetInvoiceByIdQuery, useDownloadInvoiceMutation } from '../api/invoiceApi';
import Layout from '../components/Layout';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function BuyerInvoiceDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: invoice, isLoading, error } = useGetInvoiceByIdQuery(invoiceId);
  const [downloadInvoice, { isLoading: downloading }] = useDownloadInvoiceMutation();

  const handleDownload = async () => {
    try {
      const blob = await downloadInvoice(invoiceId).unwrap();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      dispatch(showToast({ message: 'Invoice downloaded successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to download invoice', type: 'error' }));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading invoice...</p>
        </div>
      </Layout>
    );
  }

  if (error || !invoice) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <p className="text-danger mb-4">Invoice not found</p>
          <Link to="/buyer/invoices" className="btn btn-primary">
            Back to Invoices
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'SENT': return 'primary';
      case 'OVERDUE': return 'danger';
      case 'CANCELLED': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/buyer/invoices')}
              className="text-primary hover:underline mb-2 flex items-center"
            >
              ← Back to Invoices
            </button>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Issued on {formatDateTime(invoice.invoiceDate)}
            </p>
          </div>
          <span className={`badge badge-${getStatusColor(invoice.status)} text-lg px-4 py-2`}>
            {invoice.status}
          </span>
        </div>

        {/* Invoice Details */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Invoice Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-mono font-semibold">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Invoice Date</p>
                  <p className="font-medium">{formatDateTime(invoice.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{formatDateTime(invoice.dueDate)}</p>
                </div>
                {invoice.paymentDate && (
                  <div>
                    <p className="text-sm text-gray-600">Payment Date</p>
                    <p className="font-medium text-success">{formatDateTime(invoice.paymentDate)}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{invoice.order?.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crop</p>
                  <p className="font-medium">{invoice.order?.stock?.crop?.cropName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{invoice.order?.quantity} {invoice.order?.unit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Amount Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Tax ({invoice.taxPercentage}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-3">
                <span>Total Amount</span>
                <span className="text-primary">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn btn-primary"
              >
                {downloading ? 'Downloading...' : '📄 Download PDF'}
              </button>
              <Link
                to={`/buyer/orders/${invoice.order?.id}`}
                className="btn btn-ghost"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
          <div className="card bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold mb-3">Payment Instructions</h2>
            <p className="text-gray-700 mb-2">
              Please make payment before the due date to avoid late fees.
            </p>
            <p className="text-sm text-gray-600">
              For payment inquiries, please contact our accounts department.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BuyerInvoiceDetails;
