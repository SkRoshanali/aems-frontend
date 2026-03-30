export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  BUYER: 'BUYER',
};

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  MANAGER: 3,
  EMPLOYEE: 2,
  BUYER: 1,
};

export const hasRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const hasAnyRole = (userRole, requiredRoles) => {
  return requiredRoles.some(role => userRole === role);
};
