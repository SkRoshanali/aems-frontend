import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../store/slices/authSlice';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  console.log('ProtectedRoute Debug:', {
    isAuthenticated,
    userRole,
    allowedRoles,
    hasRole: allowedRoles.length === 0 || allowedRoles.includes(userRole)
  });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log('User role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
