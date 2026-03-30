import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store/store';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './constants/roles';
import { loadUserFromStorage } from './store/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Storefront from './pages/Storefront';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerOrders from './pages/BuyerOrders';
import BuyerOrderDetails from './pages/BuyerOrderDetails';
import BuyerInvoices from './pages/BuyerInvoices';
import BuyerInvoiceDetails from './pages/BuyerInvoiceDetails';
import BuyerProfile from './pages/BuyerProfile';
import InternalDashboard from './pages/InternalDashboard';
import InternalOrders from './pages/InternalOrders';
import InternalStock from './pages/InternalStock';
import InternalStockAdd from './pages/InternalStockAdd';
import InternalFarmers from './pages/InternalFarmers';
import InternalFarmerAdd from './pages/InternalFarmerAdd';
import InternalImports from './pages/InternalImports';
import InternalShipments from './pages/InternalShipments';
import InternalReports from './pages/InternalReports';
import InternalUsers from './pages/InternalUsers';
import InternalPendingBuyers from './pages/InternalPendingBuyers';
import InternalAudit from './pages/InternalAudit';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

const INTERNAL_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE];
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user from localStorage on app mount
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/storefront" element={<Storefront />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer/orders" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerOrders />
            </ProtectedRoute>
          } />
          <Route path="/buyer/orders/:orderId" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerOrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/buyer/invoices" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerInvoices />
            </ProtectedRoute>
          } />
          <Route path="/buyer/invoices/:invoiceId" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerInvoiceDetails />
            </ProtectedRoute>
          } />
          <Route path="/buyer/profile" element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
              <BuyerProfile />
            </ProtectedRoute>
          } />
          
          {/* Internal Routes */}
          <Route path="/internal/dashboard" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/internal/orders" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalOrders />
            </ProtectedRoute>
          } />
          <Route path="/internal/stock" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalStock />
            </ProtectedRoute>
          } />
          <Route path="/internal/stock/add" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalStockAdd />
            </ProtectedRoute>
          } />
          <Route path="/internal/farmers" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalFarmers />
            </ProtectedRoute>
          } />
          <Route path="/internal/farmers/add" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalFarmerAdd />
            </ProtectedRoute>
          } />
          <Route path="/internal/imports" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalImports />
            </ProtectedRoute>
          } />
          <Route path="/internal/shipments" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalShipments />
            </ProtectedRoute>
          } />
          <Route path="/internal/reports" element={
            <ProtectedRoute allowedRoles={INTERNAL_ROLES}>
              <InternalReports />
            </ProtectedRoute>
          } />
          <Route path="/internal/users" element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <InternalUsers />
            </ProtectedRoute>
          } />
          <Route path="/internal/pending-buyers" element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <InternalPendingBuyers />
            </ProtectedRoute>
          } />
          <Route path="/internal/audit" element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <InternalAudit />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
