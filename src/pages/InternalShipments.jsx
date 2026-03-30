import { useState } from 'react';
import { useGetAllShipmentsQuery, useUpdateShipmentStatusMutation } from '../api/shipmentApi';
import Layout from '../components/Layout';
import { formatDateTime } from '../utils/formatters';
import { SHIPMENT_STATUS_COLORS } from '../constants/status';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function InternalShipments() {
  const { data: shipments, isLoading } = useGetAllShipmentsQuery();
  const [updateStatus] = useUpdateShipmentStatusMutation();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const dispatch = useDispatch();

  const filteredShipments = shipments?.filter(shipment =>
    statusFilter === 'ALL' || shipment.status === statusFilter
  );

  const statuses = ['ALL', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'];

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      dispatch(showToast({ message: 'Shipment status updated', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to update status', type: 'error' }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Shipment Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all shipments</p>
        </div>

        {/* Filter */}
        <div className="card">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shipments List */}
        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading shipments...</p>
          </div>
        ) : filteredShipments && filteredShipments.length > 0 ? (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tracking: {shipment.trackingNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order #{shipment.order?.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Buyer: {shipment.order?.buyer?.fullName}
                    </p>
                  </div>
                  <span className={`badge badge-${SHIPMENT_STATUS_COLORS[shipment.status]}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  <div className="mb-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Delivered On</p>
                    <p className="font-medium text-success">{formatDateTime(shipment.actualDelivery)}</p>
                  </div>
                )}

                {shipment.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-sm">{shipment.notes}</p>
                  </div>
                )}

                {shipment.status !== 'DELIVERED' && shipment.status !== 'FAILED' && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Update Status:</label>
                    <select
                      onChange={(e) => handleStatusUpdate(shipment.id, e.target.value)}
                      className="input w-auto"
                      defaultValue=""
                    >
                      <option value="" disabled>Select status...</option>
                      {['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED']
                        .filter(s => s !== shipment.status)
                        .map(status => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🚚</div>
            <p className="text-gray-500">No shipments found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InternalShipments;
