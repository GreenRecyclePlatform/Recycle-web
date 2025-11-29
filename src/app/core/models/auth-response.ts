export interface LoginRequest {
  username: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AddressDto {
  street: string;
  city: string;
  governorate: string;
  postalcode: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  dateofBirth: Date;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  address: AddressDto;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface ForgotRequest {
  email: string;
}
export interface ForgotResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
