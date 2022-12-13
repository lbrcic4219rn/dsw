export interface LoginRequest {
  email: string,
  password: string
}

export interface Permissions {
  canReadUser: 0 | 1,
  canCreateUser: 0 | 1,
  canUpdateUser: 0 | 1,
  canDeleteUser: 0 | 1
}

export interface User {
  id: number,
  name: string,
  surname: string,
  email: string,
  permission: Permissions
}
