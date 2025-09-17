export enum Status {
  Pending = 'PENDIENTE',
  Completed = 'COMPLETADA',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
}

// Tipo para el backend - estructura real de la API
export interface TaskBackend {
  id: number;
  title: string;
  description: string;
  completed: boolean; // true = completada, false = pendiente
  createdAt: string;
  updatedAt: string;
}

// Respuestas de la API
export interface TasksResponse {
  success: boolean;
  data: TaskBackend[];
  count: number;
}

export interface TaskCreateResponse {
  success: boolean;
  data: TaskBackend;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export enum FilterStatus {
  All = 'TODAS',
  Pending = 'PENDIENTE',
  Completed = 'COMPLETADA',
}
