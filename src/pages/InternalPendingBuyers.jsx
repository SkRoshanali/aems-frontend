import { useGetPendingBuyersQuery, useApproveBuyerMutation, useRejectBuyerMutation } from '../api/userApi';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function InternalPendingBuyers() {
  const { data: pendingBuyers, isLoading } = useGetPendingBuyersQuery();
  const [approveBuyer] = useApproveBuyerMutation();
  const [rejectBuyer] = useRejectBuyerMutation();
  const dispatch = useDispatch();

  const handleApprove = async (id) => {
    try {
      await approveBuyer(id).unwrap();
      dispatch(showToast({ message: 'Buyer approved successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to approve buyer', type: 'error' }));
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBuyer(id).unwrap();
      dispatch(showToast({ message: 'Buyer rejected', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to reject buyer', type: 'error' }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Pending Buyer Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve buyer registrations</p>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading pending buyers...</p>
          </div>
        ) : pendingBuyers && pendingBuyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingBuyers.map((buyer) => (
              <div key={buyer.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{buyer.fullName}</h3>
                    <p className="text-sm text-gray-500">{buyer.email}</p>
                  </div>
                  <span className="badge badge-warning">Pending</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{buyer.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{buyer.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm">{buyer.address}</p>
                  </div>
                  {buyer.taxId && (
                    <div>
                      <p className="text-sm text-gray-600">Tax ID</p>
                      <p className="font-medium">{buyer.taxId}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleApprove(buyer.id)}
                    className="btn btn-primary flex-1"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(buyer.id)}
                    className="btn btn-danger flex-1"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-500 mb-2">No pending buyer approvals</p>
            <p className="text-sm text-gray-400">All buyer registrations have been processed</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InternalPendingBuyers;
