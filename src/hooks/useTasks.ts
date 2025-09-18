import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../services/taskService';
import type { UpdateTaskDTO } from '../services/taskService';
import { Status } from '../types/types';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('useTasks: Ejecutando queryFn...');
      const result = await getTasks();
      console.log('useTasks: Resultado de getTasks():', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      console.log('useCreateTask: Tarea creada exitosamente:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('useCreateTask: Error al crear tarea:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskData }: { id: number; taskData: UpdateTaskDTO }) =>
      updateTask(id, taskData),
    onSuccess: (data) => {
      console.log('useUpdateTask: Tarea actualizada exitosamente:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('useUpdateTask: Error al actualizar tarea:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      console.log('useDeleteTask: Tarea eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('useDeleteTask: Error al eliminar tarea:', error);
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      toggleTaskStatus(id, status),
    onSuccess: (data) => {
      console.log('useToggleTaskStatus: Status cambiado exitosamente:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('useToggleTaskStatus: Error al cambiar status:', error);
    },
  });
};
