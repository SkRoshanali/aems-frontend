export const PUBLIC_ROUTES = {
  HOME: '/',
  STOREFRONT: '/storefront',
  STOREFRONT_DETAIL: '/storefront/:id',
  REGISTER: '/register',
  LOGIN: '/login',
  TRACK_ORDER: '/track/:orderNumber',
};

export const BUYER_ROUTES = {
  DASHBOARD: '/buyer/dashboard',
  ORDERS: '/buyer/orders',
  ORDER_DETAIL: '/buyer/orders/:id',
  INVOICES: '/buyer/invoices',
  PROFILE: '/buyer/profile',
};

export const INTERNAL_ROUTES = {
  DASHBOARD: '/internal/dashboard',
  FARMERS: '/internal/farmers',
  FARMER_DETAIL: '/internal/farmers/:id',
  STOCK: '/internal/stock',
  STOCK_ADD: '/internal/stock/add',
  IMPORTS: '/internal/imports',
  ORDERS: '/internal/orders',
  ORDER_DETAIL: '/internal/orders/:id',
  SHIPMENTS: '/internal/shipments',
  REPORTS: '/internal/reports',
  USERS: '/internal/users',
  BUYERS_PENDING: '/internal/buyers/pending',
  AUDIT: '/internal/audit',
  SETTINGS: '/internal/settings',
};
