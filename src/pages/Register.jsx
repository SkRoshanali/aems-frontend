import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterBuyerMutation } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { INDIAN_STATES, COUNTRY } from '../constants/india';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: COUNTRY,
  });
  const [errors, setErrors] = useState({});
  const [registerBuyer, { isLoading }] = useRegisterBuyerMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid Indian phone number (10 digits starting with 6-9)';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'PIN code must be 6 digits';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      dispatch(showToast({
        message: 'Please fix the errors in the form',
        type: 'error',
      }));
      return;
    }
    
    try {
      const result = await registerBuyer(formData).unwrap();
      dispatch(showToast({
        message: result.message || 'Registration successful! Please wait for admin approval.',
        type: 'success',
      }));
      navigate('/login');
    } catch (error) {
      console.error('Full registration error:', error);
      console.error('Error data:', error.data);
      console.error('Error status:', error.status);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else if (error.data.errors) {
          // Handle validation errors
          const validationErrors = error.data.errors;
          if (typeof validationErrors === 'object') {
            errorMessage = Object.values(validationErrors).join(', ');
          } else {
            errorMessage = validationErrors;
          }
        }
      }
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">AEMS</h1>
          <p className="text-gray-600">Register as a Buyer</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-center mb-6">Create Buyer Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@company.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Minimum 8 characters"
                minLength={8}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`input ${errors.companyName ? 'border-red-500' : ''}`}
                  placeholder="ABC Trading Co."
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number * (Indian Format)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="9876543210"
                  maxLength="10"
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input min-h-[80px]"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Mumbai,Delhi.."
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State * (Select from list)
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`input ${errors.state ? 'border-red-500' : ''}`}
                >
                  <option value="">Choose a state</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code * (6 digits)
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  className={`input ${errors.pinCode ? 'border-red-500' : ''}`}
                  placeholder="400001"
                  maxLength="6"
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                disabled
                className="input bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-primary text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
