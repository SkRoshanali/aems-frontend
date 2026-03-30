import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllFarmersQuery, useVerifyFarmerMutation, useDeactivateFarmerMutation, useUpdateFarmerMutation } from '../api/farmerApi';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function InternalFarmers() {
  const { data: farmers, isLoading } = useGetAllFarmersQuery();
  const [verifyFarmer] = useVerifyFarmerMutation();
  const [deactivateFarmer] = useDeactivateFarmerMutation();
  const [updateFarmer, { isLoading: isUpdating }] = useUpdateFarmerMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddFarmer = () => {
    navigate('/internal/farmers/add');
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      fullName: farmer.fullName || '',
      farmerId: farmer.farmerId || '',
      email: farmer.email || '',
      phoneNumber: farmer.phoneNumber || '',
      address: farmer.address || '',
      city: farmer.city || '',
      state: farmer.state || '',
      zipCode: farmer.zipCode || '',
      farmName: farmer.farmName || '',
      farmSizeAcres: farmer.farmSizeAcres || ''
    });
    setIsEditMode(false);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedFarmer(null);
    setIsEditMode(false);
    setFormData({});
    setErrors({});
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        id: selectedFarmer.id,
        ...formData,
        farmSizeAcres: formData.farmSizeAcres ? parseFloat(formData.farmSizeAcres) : null
      };

      await updateFarmer(updateData).unwrap();
      dispatch(showToast({ message: 'Farmer updated successfully', type: 'success' }));
      setIsEditMode(false);
      handleCloseModal();
    } catch (error) {
      dispatch(showToast({ 
        message: error.data?.message || 'Failed to update farmer', 
        type: 'error' 
      }));
    }
  };

  const filteredFarmers = farmers?.filter(farmer => {
    const matchesSearch = farmer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.phoneNumber?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'VERIFIED' && farmer.isVerified) ||
                         (statusFilter === 'UNVERIFIED' && !farmer.isVerified) ||
                         (statusFilter === 'ACTIVE' && farmer.isActive) ||
                         (statusFilter === 'INACTIVE' && !farmer.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleVerify = async (id) => {
    try {
      await verifyFarmer(id).unwrap();
      dispatch(showToast({ message: 'Farmer verified successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to verify farmer', type: 'error' }));
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateFarmer(id).unwrap();
      dispatch(showToast({ message: 'Farmer deactivated successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to deactivate farmer', type: 'error' }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Farmer Management</h1>
            <p className="text-gray-600 mt-1">Manage farmer profiles and verification</p>
          </div>
          <button onClick={handleAddFarmer} className="btn btn-primary">
            + Add Farmer
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Farmers
              </label>
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'VERIFIED', 'UNVERIFIED', 'ACTIVE', 'INACTIVE'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === filter
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

        {/* Farmers List */}
        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading farmers...</p>
          </div>
        ) : filteredFarmers && filteredFarmers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
              <div key={farmer.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{farmer.fullName}</h3>
                    <p className="text-sm text-gray-500">{farmer.phoneNumber}</p>
                  </div>
                  <div className="text-3xl">👨‍🌾</div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${farmer.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {farmer.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className={`badge ${farmer.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {farmer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {farmer.address && (
                    <div className="text-sm text-gray-600">
                      <p>📍 {farmer.village}, {farmer.district}</p>
                      <p className="ml-4">{farmer.state}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {!farmer.isVerified && (
                    <button
                      onClick={() => handleVerify(farmer.id)}
                      className="btn btn-primary text-sm flex-1"
                    >
                      ✓ Verify
                    </button>
                  )}
                  {farmer.isActive && (
                    <button
                      onClick={() => handleDeactivate(farmer.id)}
                      className="btn btn-danger text-sm flex-1"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(farmer)}
                    className="btn btn-ghost text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👨‍🌾</div>
            <p className="text-gray-500 mb-4">No farmers found</p>
            <button onClick={handleAddFarmer} className="btn btn-primary">
              Add First Farmer
            </button>
          </div>
        )}
      </div>

      {/* Farmer Details Modal */}
      {showDetailsModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  {isEditMode ? 'Edit Farmer Details' : 'Farmer Details'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex items-center space-x-2">
                  <span className={`badge ${selectedFarmer.isVerified ? 'badge-success' : 'badge-warning'}`}>
                    {selectedFarmer.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`badge ${selectedFarmer.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {selectedFarmer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                      {isEditMode ? (
                        <>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`input mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                          />
                          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </>
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Farmer ID</label>
                      <p className="text-gray-900 mt-1">{selectedFarmer.farmerId}</p>
                      <p className="text-xs text-gray-500">Cannot be changed</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      {isEditMode ? (
                        <>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </>
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                      {isEditMode ? (
                        <>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`input mt-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                          />
                          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </>
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.address || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">City</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.city || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">State</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.state || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.zipCode || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Farm Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Farm Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Farm Name</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="farmName"
                          value={formData.farmName}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.farmName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Farm Size (Acres)</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          name="farmSizeAcres"
                          value={formData.farmSizeAcres}
                          onChange={handleChange}
                          className="input mt-1"
                          min="0"
                          step="0.1"
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{selectedFarmer.farmSizeAcres ? `${selectedFarmer.farmSizeAcres} acres` : 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                {!isEditMode && (selectedFarmer.createdAt || selectedFarmer.updatedAt) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Record Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedFarmer.createdAt && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created At</label>
                          <p className="text-gray-900">{new Date(selectedFarmer.createdAt).toLocaleString()}</p>
                        </div>
                      )}
                      {selectedFarmer.updatedAt && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Updated</label>
                          <p className="text-gray-900">{new Date(selectedFarmer.updatedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    {!isEditMode && !selectedFarmer.isVerified && (
                      <button
                        onClick={() => {
                          handleVerify(selectedFarmer.id);
                          handleCloseModal();
                        }}
                        className="btn btn-primary"
                      >
                        ✓ Verify Farmer
                      </button>
                    )}
                    {!isEditMode && selectedFarmer.isActive && (
                      <button
                        onClick={() => {
                          handleDeactivate(selectedFarmer.id);
                          handleCloseModal();
                        }}
                        className="btn btn-danger"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {isEditMode ? (
                      <>
                        <button
                          onClick={handleEditToggle}
                          className="btn btn-ghost"
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="btn btn-primary"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEditToggle}
                          className="btn btn-primary"
                        >
                          ✏️ Edit Details
                        </button>
                        <button
                          onClick={handleCloseModal}
                          className="btn btn-ghost"
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InternalFarmers;
