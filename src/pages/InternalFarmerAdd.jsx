import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFarmerMutation } from '../api/farmerApi';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

function InternalFarmerAdd() {
  const [createFarmer, { isLoading }] = useCreateFarmerMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    farmerId: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    farmName: '',
    farmSizeAcres: ''
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.farmerId.trim()) {
      newErrors.farmerId = 'Farmer ID is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    try {
      const farmerData = {
        ...formData,
        farmSizeAcres: formData.farmSizeAcres ? parseFloat(formData.farmSizeAcres) : null
      };

      console.log('Submitting farmer data:', JSON.stringify(farmerData, null, 2));
      const result = await createFarmer(farmerData).unwrap();
      console.log('Farmer created successfully:', result);
      dispatch(showToast({ message: 'Farmer added successfully', type: 'success' }));
      navigate('/internal/farmers');
    } catch (error) {
      console.error('Error creating farmer:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to add farmer';
      
      if (error.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.entries(error.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        errorMessage = `Validation errors: ${validationErrors}`;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
    }
  };

  const handleCancel = () => {
    navigate('/internal/farmers');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Add New Farmer</h1>
            <p className="text-gray-600 mt-1">Register a new farmer in the system</p>
          </div>
          <button
            onClick={handleCancel}
            className="btn btn-ghost"
          >
            ← Back to Farmers
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Enter farmer's full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer ID *
                </label>
                <input
                  type="text"
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  className={`input ${errors.farmerId ? 'border-red-500' : ''}`}
                  placeholder="Enter unique farmer ID"
                />
                {errors.farmerId && (
                  <p className="text-red-500 text-sm mt-1">{errors.farmerId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Farm Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter farm name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  name="farmSizeAcres"
                  value={formData.farmSizeAcres}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter farm size in acres"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding Farmer...' : 'Add Farmer'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default InternalFarmerAdd;