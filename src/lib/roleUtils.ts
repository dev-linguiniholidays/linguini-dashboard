export type UserRole = 'admin' | 'user';

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

export const isAdmin = (): boolean => {
  return getStoredRole() === 'admin';
};

export const canDeleteCustomer = (): boolean => {
  return isAdmin();
};

export const canEditCustomer = (): boolean => {
  return true; // Both admin and user can edit
};

export const canAddCustomer = (): boolean => {
  return true; // Both admin and user can add
};

export const getCurrentUser = () => {
  const role = getStoredRole();
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('user-name') : null;
  return {
    id: role === 'admin' ? 'admin' : 'user1',
    name: storedName || (role === 'admin' ? 'Admin User' : 'Regular User'),
    role
  };
};