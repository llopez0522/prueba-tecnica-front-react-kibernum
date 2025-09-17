import { Status, type Task } from '../types/types';

// Datos de ejemplo para desarrollo cuando la API no está disponible
export const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  for (let i = 1; i <= 10; i++) {
    tasks.push({
      id: `mock-${i}`,
      title: `Tarea de ejemplo ${i}`,
      description: `Esta es la descripción para la tarea número ${i}. Incluye detalles importantes sobre lo que se debe hacer.`,
      status: Math.random() > 0.5 ? Status.Completed : Status.Pending,
    });
  }
  return tasks.sort((a, b) =>
    a.status === Status.Pending && b.status === Status.Completed ? -1 : 1
  ); // Mostrar pendientes primero
};

// Función para detectar si estamos en modo desarrollo
export const isDevelopmentMode = () => {
  return import.meta.env.DEV;
};
