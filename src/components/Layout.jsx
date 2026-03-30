import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import { useLogoutMutation } from '../api/authApi';
import { showToast } from '../store/slices/uiSlice';
import SessionTimer from './SessionTimer';

function Layout({ children }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      // Ignore logout API errors
    } finally {
      dispatch(logout());
      dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
      navigate('/login');
    }
  };

  const isBuyer = user?.role === 'BUYER';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to={isBuyer ? '/buyer/dashboard' : '/internal/dashboard'} className="flex items-center">
                <h1 className="text-2xl font-display font-bold text-primary">AEMS</h1>
              </Link>
              
              {isBuyer ? (
                <nav className="hidden md:flex space-x-4">
                  <Link to="/buyer/dashboard" className="text-gray-700 hover:text-primary px-3 py-2">
                    Dashboard
                  </Link>
                  <Link to="/storefront" className="text-gray-700 hover:text-primary px-3 py-2">
                    Storefront
                  </Link>
                  <Link to="/buyer/orders" className="text-gray-700 hover:text-primary px-3 py-2">
                    My Orders
                  </Link>
                  <Link to="/buyer/invoices" className="text-gray-700 hover:text-primary px-3 py-2">
                    Invoices
                  </Link>
                  <Link to="/buyer/profile" className="text-gray-700 hover:text-primary px-3 py-2">
                    Profile
                  </Link>
                </nav>
              ) : (
                <nav className="hidden md:flex space-x-4">
                  <Link to="/internal/dashboard" className="text-gray-700 hover:text-primary px-3 py-2">
                    Dashboard
                  </Link>
                  <Link to="/internal/orders" className="text-gray-700 hover:text-primary px-3 py-2">
                    Orders
                  </Link>
                  <Link to="/internal/stock" className="text-gray-700 hover:text-primary px-3 py-2">
                    Stock
                  </Link>
                  <Link to="/internal/farmers" className="text-gray-700 hover:text-primary px-3 py-2">
                    Farmers
                  </Link>
                  <Link to="/internal/shipments" className="text-gray-700 hover:text-primary px-3 py-2">
                    Shipments
                  </Link>
                  <Link to="/internal/reports" className="text-gray-700 hover:text-primary px-3 py-2">
                    Reports
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <>
                      <Link to="/internal/pending-buyers" className="text-gray-700 hover:text-primary px-3 py-2">
                        Pending Buyers
                      </Link>
                      <Link to="/internal/imports" className="text-gray-700 hover:text-primary px-3 py-2">
                        Imports
                      </Link>
                      <Link to="/internal/users" className="text-gray-700 hover:text-primary px-3 py-2">
                        Users
                      </Link>
                    </>
                  )}
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <SessionTimer />
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
