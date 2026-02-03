export type UserRole = "employee" | "secretary" | "manager";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}
