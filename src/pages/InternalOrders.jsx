import { useState } from 'react';
import { useGetAllOrdersQuery, useApproveOrderMutation, useRejectOrderMutation } from '../api/orderApi';
import { useCreateShipmentMutation } from '../api/shipmentApi';
import { useCreateInvoiceMutation } from '../api/invoiceApi';
import Layout from '../components/Layout';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ORDER_STATUS_COLORS } from '../constants/status';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function InternalOrders() {
  const { data: orders, isLoading, refetch } = useGetAllOrdersQuery();
  const [approveOrder] = useApproveOrderMutation();
  const [rejectOrder] = useRejectOrderMutation();
  const [createShipment] = useCreateShipmentMutation();
  const [createInvoice] = useCreateInvoiceMutation();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  });
  const dispatch = useDispatch();

  const filteredOrders = orders?.filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  );

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'REJECTED'];

  const handleApprove = async (orderId) => {
    try {
      await approveOrder(orderId).unwrap();
      dispatch(showToast({ message: 'Order approved successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ 
        message: error.data?.message || 'Failed to approve order', 
        type: 'error' 
      }));
    }
  };

  const handleRejectClick = (order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      dispatch(showToast({ message: 'Please provide a rejection reason', type: 'error' }));
      return;
    }

    try {
      await rejectOrder({ id: selectedOrder.id, reason: rejectionReason }).unwrap();
      dispatch(showToast({ message: 'Order rejected successfully', type: 'success' }));
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedOrder(null);
    } catch (error) {
      dispatch(showToast({ 
        message: error.data?.message || 'Failed to reject order', 
        type: 'error' 
      }));
    }
  };

  const handleCreateShipment = (order) => {
    if (order.status !== 'APPROVED') {
      dispatch(showToast({ 
        message: `Cannot create shipment. Order status is ${order.status}`, 
        type: 'error' 
      }));
      return;
    }
    
    setSelectedOrder(order);
    setShipmentForm({
      carrier: '',
      trackingNumber: '',
      estimatedDelivery: '',
      notes: ''
    });
    setShowShipmentModal(true);
  };

  const handleShipmentSubmit = async () => {
    if (!shipmentForm.carrier || !shipmentForm.trackingNumber) {
      dispatch(showToast({ 
        message: 'Please fill in carrier name and tracking number', 
        type: 'error' 
      }));
      return;
    }

    try {
      // Format the date properly for LocalDateTime
      let estimatedDelivery = null;
      if (shipmentForm.estimatedDelivery) {
        // Convert date string to LocalDateTime format (YYYY-MM-DDTHH:MM:SS)
        estimatedDelivery = shipmentForm.estimatedDelivery + 'T00:00:00';
      }

      await createShipment({
        orderId: selectedOrder.id,
        carrier: shipmentForm.carrier,
        trackingNumber: shipmentForm.trackingNumber,
        estimatedDelivery: estimatedDelivery,
        notes: shipmentForm.notes
      }).unwrap();
      
      dispatch(showToast({ 
        message: 'Shipment created successfully', 
        type: 'success' 
      }));
      
      setShowShipmentModal(false);
      setSelectedOrder(null);
      
      // Refetch orders to update the list
      refetch();
    } catch (error) {
      console.error('Shipment creation error:', error);
      const errorMessage = error.data?.message || error.message || 'Failed to create shipment';
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
    }
  };

  const handleGenerateInvoice = async (orderId) => {
    try {
      const result = await createInvoice(orderId).unwrap();
      dispatch(showToast({ 
        message: 'Invoice generated successfully', 
        type: 'success' 
      }));
      
      // Refetch orders to update the list
      refetch();
      
      // Optionally download the invoice immediately
      if (result.invoiceId) {
        // You can add download logic here if needed
        console.log('Invoice created with ID:', result.invoiceId);
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      const errorMessage = error.data?.message || error.message || 'Failed to generate invoice';
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
    }
  };

  const handleShipmentInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Review and manage all customer orders</p>
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
                    <p className="text-sm text-gray-600 mt-1">
                      Buyer: <span className="font-medium">{order.buyer?.fullName}</span>
                    </p>
                  </div>
                  <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
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

                {order.deliveryAddress && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                    <p className="text-sm">
                      {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
                    </p>
                  </div>
                )}

                {order.status === 'PENDING' && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="btn btn-primary text-sm"
                    >
                      ✓ Approve Order
                    </button>
                    <button
                      onClick={() => handleRejectClick(order)}
                      className="btn btn-danger text-sm"
                    >
                      ✗ Reject Order
                    </button>
                  </div>
                )}

                {order.status === 'APPROVED' && (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleCreateShipment(order)}
                      className="btn btn-primary text-sm"
                      disabled={order.shipmentCreated}
                    >
                      🚚 Create Shipment
                    </button>
                    <button 
                      onClick={() => handleGenerateInvoice(order.id)}
                      className="btn btn-ghost text-sm"
                    >
                      📄 Generate Invoice
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">
              {statusFilter === 'ALL' 
                ? 'No orders found' 
                : `No ${statusFilter.toLowerCase()} orders`}
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Reject Order</h3>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder?.orderNumber}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRejectSubmit}
                className="btn btn-danger flex-1"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedOrder(null);
                }}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Modal */}
      {showShipmentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Create Shipment
                </h2>
                <button
                  onClick={() => setShowShipmentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <div className="mb-2">
                  <span className={`badge badge-${ORDER_STATUS_COLORS[selectedOrder.status]}`}>
                    Status: {selectedOrder.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Buyer:</span>
                    <span className="ml-2 font-medium">{selectedOrder.buyer?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Crop:</span>
                    <span className="ml-2 font-medium">{selectedOrder.stock?.crop?.cropName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium">{selectedOrder.quantity} {selectedOrder.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Delivery Address:</span>
                  <p className="text-sm mt-1">
                    {selectedOrder.deliveryAddress}, {selectedOrder.deliveryCity}, {selectedOrder.deliveryState}
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleShipmentSubmit(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrier Name *
                    </label>
                    <input
                      type="text"
                      name="carrier"
                      value={shipmentForm.carrier}
                      onChange={handleShipmentInputChange}
                      className="input"
                      placeholder="e.g., FedEx, UPS, DHL"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number *
                    </label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={shipmentForm.trackingNumber}
                      onChange={handleShipmentInputChange}
                      className="input"
                      placeholder="Enter tracking number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    name="estimatedDelivery"
                    value={shipmentForm.estimatedDelivery}
                    onChange={handleShipmentInputChange}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipment Notes
                  </label>
                  <textarea
                    name="notes"
                    value={shipmentForm.notes}
                    onChange={handleShipmentInputChange}
                    className="input"
                    rows="3"
                    placeholder="Any special handling instructions or notes..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowShipmentModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Shipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InternalOrders;
