/**
 * Role-Based Access Control (RBAC)
 * Enterprise-grade permission system
 */

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES_REP = 'sales_rep',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

export enum Permission {
  // Parts
  PARTS_VIEW = 'parts:view',
  PARTS_CREATE = 'parts:create',
  PARTS_UPDATE = 'parts:update',
  PARTS_DELETE = 'parts:delete',
  PARTS_EXPORT = 'parts:export',
  
  // Vendors
  VENDORS_VIEW = 'vendors:view',
  VENDORS_CREATE = 'vendors:create',
  VENDORS_UPDATE = 'vendors:update',
  VENDORS_DELETE = 'vendors:delete',
  
  // RFQs
  RFQ_VIEW = 'rfq:view',
  RFQ_CREATE = 'rfq:create',
  RFQ_UPDATE = 'rfq:update',
  RFQ_DELETE = 'rfq:delete',
  RFQ_BROADCAST = 'rfq:broadcast',
  
  // Orders
  ORDERS_VIEW = 'orders:view',
  ORDERS_CREATE = 'orders:create',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_DELETE = 'orders:delete',
  
  // Customers
  CUSTOMERS_VIEW = 'customers:view',
  CUSTOMERS_CREATE = 'customers:create',
  CUSTOMERS_UPDATE = 'customers:update',
  CUSTOMERS_DELETE = 'customers:delete',
  
  // Admin
  ADMIN_ACCESS = 'admin:access',
  ADMIN_USERS = 'admin:users',
  ADMIN_SETTINGS = 'admin:settings',
  ADMIN_ANALYTICS = 'admin:analytics',
  
  // Reports
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',
  
  // Import/Export
  DATA_IMPORT = 'data:import',
  DATA_EXPORT = 'data:export',
}

// Role permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Super admin has all permissions
    ...Object.values(Permission),
  ],
  
  [UserRole.ADMIN]: [
    Permission.PARTS_VIEW,
    Permission.PARTS_CREATE,
    Permission.PARTS_UPDATE,
    Permission.PARTS_DELETE,
    Permission.PARTS_EXPORT,
    Permission.VENDORS_VIEW,
    Permission.VENDORS_CREATE,
    Permission.VENDORS_UPDATE,
    Permission.VENDORS_DELETE,
    Permission.RFQ_VIEW,
    Permission.RFQ_CREATE,
    Permission.RFQ_UPDATE,
    Permission.RFQ_DELETE,
    Permission.RFQ_BROADCAST,
    Permission.ORDERS_VIEW,
    Permission.ORDERS_CREATE,
    Permission.ORDERS_UPDATE,
    Permission.ORDERS_DELETE,
    Permission.CUSTOMERS_VIEW,
    Permission.CUSTOMERS_CREATE,
    Permission.CUSTOMERS_UPDATE,
    Permission.CUSTOMERS_DELETE,
    Permission.ADMIN_ACCESS,
    Permission.ADMIN_ANALYTICS,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
    Permission.DATA_IMPORT,
    Permission.DATA_EXPORT,
  ],
  
  [UserRole.MANAGER]: [
    Permission.PARTS_VIEW,
    Permission.PARTS_CREATE,
    Permission.PARTS_UPDATE,
    Permission.VENDORS_VIEW,
    Permission.VENDORS_CREATE,
    Permission.VENDORS_UPDATE,
    Permission.RFQ_VIEW,
    Permission.RFQ_CREATE,
    Permission.RFQ_UPDATE,
    Permission.RFQ_BROADCAST,
    Permission.ORDERS_VIEW,
    Permission.ORDERS_CREATE,
    Permission.ORDERS_UPDATE,
    Permission.CUSTOMERS_VIEW,
    Permission.CUSTOMERS_CREATE,
    Permission.CUSTOMERS_UPDATE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
    Permission.DATA_EXPORT,
  ],
  
  [UserRole.SALES_REP]: [
    Permission.PARTS_VIEW,
    Permission.VENDORS_VIEW,
    Permission.RFQ_VIEW,
    Permission.RFQ_CREATE,
    Permission.RFQ_UPDATE,
    Permission.ORDERS_VIEW,
    Permission.ORDERS_CREATE,
    Permission.CUSTOMERS_VIEW,
    Permission.CUSTOMERS_CREATE,
    Permission.CUSTOMERS_UPDATE,
    Permission.REPORTS_VIEW,
  ],
  
  [UserRole.VENDOR]: [
    Permission.PARTS_VIEW,
    Permission.RFQ_VIEW,
    Permission.ORDERS_VIEW,
  ],
  
  [UserRole.CUSTOMER]: [
    Permission.PARTS_VIEW,
    Permission.RFQ_VIEW,
    Permission.RFQ_CREATE,
    Permission.ORDERS_VIEW,
  ],
  
  [UserRole.GUEST]: [
    Permission.PARTS_VIEW,
  ],
};

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * Require permission (throws if not authorized)
 */
export function requirePermission(userRole: UserRole, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Unauthorized: User role '${userRole}' does not have permission '${permission}'`);
  }
}

