export const ORDER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export const SHIPMENT_STATUS = {
  PREPARING: 'PREPARING',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
};

export const SHIPMENT_STATUS_COLORS = {
  PREPARING: 'warning',
  SHIPPED: 'primary',
  IN_TRANSIT: 'primary',
  OUT_FOR_DELIVERY: 'warning',
  DELIVERED: 'success',
  FAILED: 'danger',
};

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
};

export const INVOICE_STATUS_COLORS = {
  DRAFT: 'warning',
  SENT: 'primary',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'danger',
};
