import { httpClient } from './httpClient';
import type { Task, TaskBackend, TasksResponse, Status } from '../types/types';

// DTOs para el backend
export interface CreateTaskDTO {
  title: string;
  description: string;
  completed: boolean;
}

export interface UpdateTaskDTO {
  title: string;
  description: string;
  completed: boolean;
}

// Tipo para respuesta de creación/actualización
interface TaskResponse {
  success: boolean;
  data: TaskBackend;
  message: string;
}

// Funciones de conversión
const statusToBoolean = (status: Status): boolean => {
  console.log('statusToBoolean: Convirtiendo status:', status);
  const result = status === 'COMPLETADA';
  console.log('statusToBoolean: Resultado:', result);
  return result;
};

const booleanToStatus = (completed: boolean): Status => {
  console.log('booleanToStatus: Convirtiendo completed:', completed);
  const result = completed ? 'COMPLETADA' : 'PENDIENTE';
  console.log('booleanToStatus: Resultado:', result);
  return result as Status;
};

const convertBackendTaskToFrontend = (backendTask: TaskBackend): Task => {
  console.log('convertBackendTaskToFrontend: Tarea del backend:', backendTask);

  const frontendTask: Task = {
    id: backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    status: booleanToStatus(backendTask.completed),
  };

  console.log('convertBackendTaskToFrontend: Tarea convertida:', frontendTask);
  return frontendTask;
};

// Servicios de la API
export const getTasks = async (): Promise<Task[]> => {
  console.log('taskService.getTasks: Iniciando petición...');

  try {
    const response = await httpClient.get<TasksResponse>('/api/tasks');
    console.log('taskService.getTasks: Respuesta del backend:', response);

    if (!response.success || !Array.isArray(response.data)) {
      console.error(
        'taskService.getTasks: Respuesta inválida del backend:',
        response
      );
      return [];
    }

    const convertedTasks = response.data.map(convertBackendTaskToFrontend);
    console.log('taskService.getTasks: Tareas convertidas:', convertedTasks);

    return convertedTasks;
  } catch (error) {
    console.error('taskService.getTasks: Error en la petición:', error);
    throw error;
  }
};

export const createTask = async (taskData: CreateTaskDTO): Promise<Task> => {
  console.log('taskService.createTask: Creando tarea con datos:', taskData);

  try {
    const response = await httpClient.post<TaskResponse>(
      '/api/tasks',
      taskData
    );
    console.log('taskService.createTask: Respuesta del backend:', response);

    if (!response.success || !response.data) {
      console.error(
        'taskService.createTask: Respuesta inválida del backend:',
        response
      );
      throw new Error('Respuesta inválida del servidor al crear la tarea');
    }

    const convertedTask = convertBackendTaskToFrontend(response.data);
    console.log(
      'taskService.createTask: Tarea creada y convertida:',
      convertedTask
    );

    return convertedTask;
  } catch (error) {
    console.error('taskService.createTask: Error en la petición:', error);

    // Si es un error con mensaje específico (como el 409), lo re-lanzamos
    if (error instanceof Error) {
      throw error;
    }

    // Para otros errores, lanzamos un mensaje genérico
    throw new Error('Error inesperado al crear la tarea');
  }
};

export const updateTask = async (
  id: number,
  taskData: UpdateTaskDTO
): Promise<Task> => {
  console.log(
    'taskService.updateTask: Actualizando tarea',
    id,
    'con datos:',
    taskData
  );

  try {
    const response = await httpClient.put<TaskResponse>(
      `/api/tasks/${id}`,
      taskData
    );
    console.log('taskService.updateTask: Respuesta del backend:', response);

    if (!response.success || !response.data) {
      console.error(
        'taskService.updateTask: Respuesta inválida del backend:',
        response
      );
      throw new Error('Respuesta inválida del servidor al actualizar la tarea');
    }

    const convertedTask = convertBackendTaskToFrontend(response.data);
    console.log(
      'taskService.updateTask: Tarea actualizada y convertida:',
      convertedTask
    );

    return convertedTask;
  } catch (error) {
    console.error('taskService.updateTask: Error en la petición:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  console.log('taskService.deleteTask: Eliminando tarea:', id);

  try {
    await httpClient.delete(`/api/tasks/${id}`);
    console.log('taskService.deleteTask: Tarea eliminada exitosamente');
  } catch (error) {
    console.error('taskService.deleteTask: Error en la petición:', error);
    throw error;
  }
};

export const toggleTaskStatus = async (
  id: string,
  status: Status
): Promise<Task> => {
  console.log(
    'taskService.toggleTaskStatus: Cambiando status de tarea',
    id,
    'a:',
    status
  );

  try {
    const completed = statusToBoolean(status);
    const response = await httpClient.put<TaskResponse>(`/api/tasks/${id}`, {
      completed,
    });
    console.log(
      'taskService.toggleTaskStatus: Respuesta del backend:',
      response
    );

    if (!response.success || !response.data) {
      console.error(
        'taskService.toggleTaskStatus: Respuesta inválida del backend:',
        response
      );
      throw new Error('Respuesta inválida del servidor al cambiar el estado');
    }

    const convertedTask = convertBackendTaskToFrontend(response.data);
    console.log(
      'taskService.toggleTaskStatus: Tarea actualizada y convertida:',
      convertedTask
    );

    return convertedTask;
  } catch (error) {
    console.error('taskService.toggleTaskStatus: Error en la petición:', error);
    throw error;
  }
};
