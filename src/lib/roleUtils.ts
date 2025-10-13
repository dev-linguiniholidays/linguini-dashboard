export type UserRole = 'superadmin' | 'admin' | 'user';

export const ROLE_STORAGE_KEY = 'linguini-crm-user-role';

export const getStoredRole = (): UserRole => {
  if (typeof window === 'undefined') return 'user';
  
  const stored = localStorage.getItem(ROLE_STORAGE_KEY);
  return (stored as UserRole) || 'user';
};

export const setStoredRole = (role: UserRole): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ROLE_STORAGE_KEY, role);
};

export const setStoredUserId = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user-id', userId);
};

export const isSuperAdmin = (): boolean => {
  return getStoredRole() === 'superadmin';
};

export const isAdmin = (): boolean => {
  return getStoredRole() === 'admin';
};

export const isUser = (): boolean => {
  return getStoredRole() === 'user';
};

export const canDeleteCustomer = (): boolean => {
  return isSuperAdmin(); // Only superadmin can delete
};

export const canEditCustomer = (customer?: { assignee: string }): boolean => {
  const currentRole = getStoredRole();
  const currentUser = getCurrentUser();
  
  if (currentRole === 'superadmin' || currentRole === 'admin') {
    return true; // Superadmin and admin can edit all records
  }
  
  if (currentRole === 'user' && customer) {
    // Users can only edit records they are assigned to
    return customer.assignee === currentUser.id;
  }
  
  return false;
};

export const canAddCustomer = (): boolean => {
  return true; // All roles can add customers
};

export const getCurrentUser = () => {
  const role = getStoredRole();
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('user-name') : null;
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('user-id') : null;
  
  let userId: string;
  let defaultName: string;
  
  switch (role) {
    case 'superadmin':
      userId = 'Super Admin';
      defaultName = 'Super Admin';
      break;
    case 'admin':
      userId = 'Admin User';
      defaultName = 'Admin User';
      break;
    default:
      // For users, use stored ID or default to a name that exists in the database
      userId = storedUserId || 'Sales';
      defaultName = storedName || 'Sales';
  }
  
  return {
    id: userId,
    name: storedName || defaultName,
    role
  };
};