// src/app/core/constants/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Users/Login',
    REGISTER: '/Users/Register',
    FORGOTPASSWORD: '/Users/forgot-password',
    RESETPASSWORD: '/Users/reset-password',
    REFRESH: '/Users/Refresh',
    LOGOUT: '/Users/Logout',
  },
  ADDRESSES: {
    getAll: '/Addresses',
    getById: (id: string) => `/Addresses/${id}`,
    create: '/Addresses',
    update: (id: string) => `/Addresses/${id}`,
    delete: (id: string) => `/Addresses/${id}`,
  },
  PICKUP_REQUESTS: {
    getAll: '/PickupRequests',
    getById: (id: string) => `/PickupRequests/${id}`,
    getMyRequests: '/PickupRequests/my-requests',
    getByStatus: (status: string) => `/PickupRequests/status/${status}`,
    filter: '/PickupRequests/filter',
    create: '/PickupRequests',
    update: (id: string) => `/PickupRequests/${id}`,
    delete: (id: string) => `/PickupRequests/${id}`,
    updateStatus: (id: string) => `/PickupRequests/${id}/status`,
  },
  MATERIALS: {
    getAll: '/Materials',
    getById: (id: string) => `/Materials/${id}`,
  },
  DRIVERPROFILE: {
    Create: '/DriverProfiles',
  },
};
