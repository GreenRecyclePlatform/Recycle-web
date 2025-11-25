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
};
