export type UserRole = 'admin' | 'user' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
