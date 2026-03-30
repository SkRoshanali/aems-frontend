import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCreateStockMutation } from '../api/stockApi';
import { useGetAllCropsQuery } from '../api/cropApi';
import { useGetAllFarmersQuery } from '../api/farmerApi';
import { useGetAllImportSourcesQuery } from '../api/importApi';

function InternalStockAdd() {
  const navigate = useNavigate();
  const [createStock, { isLoading }] = useCreateStockMutation();
  const { data: crops = [] } = useGetAllCropsQuery();
  const { data: farmers = [] } = useGetAllFarmersQuery();
  const { data: importSources = [] } = useGetAllImportSourcesQuery();

  const [formData, setFormData] = useState({
    cropId: '',
    farmerId: '',
    importSourceId: '',
    quantity: '',
    unit: 'KG',
    quality: 'A',
    pricePerUnit: '',
    harvestDate: '',
    expiryDate: '',
    storageLocation: '',
    certifications: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cropId) newErrors.cropId = 'Crop is required';
    if (!formData.farmerId) newErrors.farmerId = 'Farmer is required';
    if (!formData.importSourceId) newErrors.importSourceId = 'Import source is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) newErrors.pricePerUnit = 'Valid price is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    if (!formData.storageLocation) newErrors.storageLocation = 'Storage location is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createStock({
        ...formData,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
      }).unwrap();
      navigate('/internal/stock');
    } catch (error) {
      console.error('Failed to create stock:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900">Add New Stock</h1>
          <p className="text-gray-600 mt-2">Create a new stock entry in the inventory</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop *
                </label>
                <select
                  name="cropId"
                  value={formData.cropId}
                  onChange={handleChange}
                  className={`input ${errors.cropId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Crop</option>
                  {crops.map(crop => (
                    <option key={crop.id} value={crop.id}>
                      {crop.cropName} ({crop.category})
                    </option>
                  ))}
                </select>
                {errors.cropId && <p className="text-red-500 text-sm mt-1">{errors.cropId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer *
                </label>
                <select
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  className={`input ${errors.farmerId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Farmer</option>
                  {farmers.map(farmer => (
                    <option key={farmer.id} value={farmer.id}>
                      {farmer.fullName} - {farmer.city || farmer.state || 'N/A'}
                    </option>
                  ))}
                </select>
                {errors.farmerId && <p className="text-red-500 text-sm mt-1">{errors.farmerId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Source *
                </label>
                <select
                  name="importSourceId"
                  value={formData.importSourceId}
                  onChange={handleChange}
                  className={`input ${errors.importSourceId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Import Source</option>
                  {importSources.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.companyName} - {source.country}
                    </option>
                  ))}
                </select>
                {errors.importSourceId && <p className="text-red-500 text-sm mt-1">{errors.importSourceId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.01"
                  className={`input ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="KG">Kilograms (KG)</option>
                  <option value="TON">Tons (TON)</option>
                  <option value="QUINTAL">Quintals (QUINTAL)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Grade *
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Basic)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Unit *
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  step="0.01"
                  className={`input ${errors.pricePerUnit ? 'border-red-500' : ''}`}
                  placeholder="Enter price"
                />
                {errors.pricePerUnit && <p className="text-red-500 text-sm mt-1">{errors.pricePerUnit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  className={`input ${errors.harvestDate ? 'border-red-500' : ''}`}
                />
                {errors.harvestDate && <p className="text-red-500 text-sm mt-1">{errors.harvestDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location *
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  className={`input ${errors.storageLocation ? 'border-red-500' : ''}`}
                  placeholder="e.g., Warehouse A, Section 3"
                />
                {errors.storageLocation && <p className="text-red-500 text-sm mt-1">{errors.storageLocation}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Organic, Fair Trade, ISO 9001"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Creating...' : 'Create Stock'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/internal/stock')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default InternalStockAdd;
