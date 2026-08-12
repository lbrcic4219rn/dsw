export interface LoginRequest {
  email: string,
  password: string
}

export interface Permissions {
  canReadUser: 0 | 1,
  canCreateUser: 0 | 1,
  canUpdateUser: 0 | 1,
  canDeleteUser: 0 | 1,
  canSearchMachine: 0 | 1,
  canStartMachine: 0 | 1,
  canStopMachine: 0 | 1,
  canRestartMachine: 0 | 1,
  canCreateMachine: 0 | 1,
  canDestroyMachine: 0 | 1,
}

export interface User {
  id: number,
  name: string,
  surname: string,
  email: string,
  permission: Permissions
}

export interface Machine {
  id: number,
  name: string,
  status: 'RUNNING' | 'STOPPED',
  createdAt: Date,
  operationActive: number
}

export interface ErrorMessage {
  errorDate: Date,
  machineId: number,
  operationName: string,
  errorMessage: string
}
