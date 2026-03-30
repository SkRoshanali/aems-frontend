import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPublicStocksQuery } from '../api/stockApi';
import { useCreateOrderMutation } from '../api/orderApi';
import { selectCurrentUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

function Storefront() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: stocks, isLoading, error } = useGetPublicStocksQuery();
  const [createOrder] = useCreateOrderMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryCountry: '',
    notes: ''
  });

  const categories = ['ALL', ...new Set(stocks?.map(s => s.category) || [])];

  const filteredStocks = stocks?.filter(stock => {
    const matchesSearch = stock.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || stock.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrderClick = (stock) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'BUYER') {
      dispatch(showToast({ 
        message: 'Only buyers can place orders', 
        type: 'error' 
      }));
      return;
    }

    setSelectedStock(stock);
    setOrderForm({
      quantity: '',
      deliveryAddress: user.address || '',
      deliveryCity: user.city || '',
      deliveryState: user.state || '',
      deliveryZip: user.zipCode || '',
      deliveryCountry: user.country || '',
      notes: ''
    });
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStock || !orderForm.quantity) {
      dispatch(showToast({ 
        message: 'Please fill in all required fields', 
        type: 'error' 
      }));
      return;
    }

    const quantity = parseFloat(orderForm.quantity);
    if (quantity <= 0 || quantity > selectedStock.quantity) {
      dispatch(showToast({ 
        message: `Quantity must be between 1 and ${selectedStock.quantity}`, 
        type: 'error' 
      }));
      return;
    }

    try {
      await createOrder({
        stockId: selectedStock.id,
        quantity: quantity,
        deliveryAddress: orderForm.deliveryAddress,
        deliveryCity: orderForm.deliveryCity,
        deliveryState: orderForm.deliveryState,
        deliveryZip: orderForm.deliveryZip,
        deliveryCountry: orderForm.deliveryCountry,
        notes: orderForm.notes
      }).unwrap();

      dispatch(showToast({ 
        message: 'Order placed successfully! Awaiting approval.', 
        type: 'success' 
      }));
      
      setShowOrderModal(false);
      setSelectedStock(null);
      
      // Redirect to orders page
      navigate('/buyer/orders');
    } catch (error) {
      dispatch(showToast({ 
        message: error.data?.message || 'Failed to place order', 
        type: 'error' 
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-display font-bold text-primary">AEMS</h1>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.fullName}
                  </span>
                  {user.role === 'BUYER' ? (
                    <Link to="/buyer/dashboard" className="btn btn-ghost">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/internal/dashboard" className="btn btn-ghost">
                      Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Browse Available Crops
          </h1>
          <p className="text-gray-600">
            Explore our quality agricultural products from verified farmers and trusted sources
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Crops
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
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading crops...</p>
          </div>
        ) : error ? (
          <div className="card bg-danger/10 border-danger">
            <p className="text-danger">Error loading crops. Please try again later.</p>
          </div>
        ) : filteredStocks && filteredStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <div key={stock.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {stock.cropName}
                    </h3>
                    <span className="badge badge-primary mt-1">
                      {stock.category}
                    </span>
                  </div>
                  <div className="text-3xl">🌾</div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">
                      {stock.quantity} {stock.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per {stock.unit}:</span>
                    <span className="font-semibold text-primary text-lg">
                      {formatCurrency(stock.pricePerUnit)}
                    </span>
                  </div>
                  {stock.quality && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quality:</span>
                      <span className="badge badge-success">{stock.quality}</span>
                    </div>
                  )}
                </div>

                {stock.farmerName && (
                  <p className="text-xs text-gray-500 mb-3">
                    From: {stock.farmerName}
                  </p>
                )}

                <button
                  onClick={() => handleOrderClick(stock)}
                  className="btn btn-primary w-full"
                >
                  {user && user.role === 'BUYER' ? 'Order Now' : 'Login to Order'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No crops found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
              }}
              className="btn btn-ghost"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Order Modal */}
      {showOrderModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Place Order
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Stock Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedStock.cropName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Available: {selectedStock.quantity} {selectedStock.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: {formatCurrency(selectedStock.pricePerUnit)} per {selectedStock.unit}
                    </p>
                  </div>
                  <div className="text-4xl">🌾</div>
                </div>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity ({selectedStock.unit}) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={handleInputChange}
                    className="input"
                    min="1"
                    max={selectedStock.quantity}
                    step="0.1"
                    required
                  />
                  {orderForm.quantity && (
                    <p className="text-sm text-gray-600 mt-1">
                      Total: {formatCurrency(parseFloat(orderForm.quantity || 0) * selectedStock.pricePerUnit)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={orderForm.deliveryAddress}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="deliveryCity"
                      value={orderForm.deliveryCity}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="deliveryState"
                      value={orderForm.deliveryState}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="deliveryZip"
                      value={orderForm.deliveryZip}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="deliveryCountry"
                    value={orderForm.deliveryCountry}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    className="input"
                    rows="3"
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Storefront;
