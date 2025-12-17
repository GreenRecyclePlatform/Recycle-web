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
  //=======================Payment endpoint======================
  // Payment endpoints matching backend
  PAYMENTS: {
    getAll: '/Payment',
    getById: (id: string) => `/Payment/${id}`,
    getUserPayments: (userId: string) => `/Payment/user/${userId}`,
    create: '/Payment',
    approve: (id: string) => `/Payment/${id}/approve`,
    reject: (id: string) => `/Payment/${id}/reject`,
    requestPayout: '/Payment/request-payout',
    getPayPalStatus: (id: string) => `/Payment/${id}/paypal-status`,
  },
  PAYMENT_METHODS: {
    getAll: '/PaymentMethods',
    getById: (id: string) => `/PaymentMethods/${id}`,
    create: '/PaymentMethods',
    update: (id: string) => `/PaymentMethods/${id}`,
    delete: (id: string) => `/PaymentMethods/${id}`,
    setDefault: (id: string) => `/PaymentMethods/${id}/set-default`,
  }
};
