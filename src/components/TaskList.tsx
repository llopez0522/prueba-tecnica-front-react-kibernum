import React from 'react';
import TaskItem from './TaskItem';
import type { Task } from '../types/types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  // Log temporal para verificar qué tareas recibe el componente
  console.log('TaskList recibiendo tasks:', tasks);
  console.log('Número de tareas:', tasks.length);

  // Función adaptadora para convertir la firma de onToggleStatus
  const handleToggleStatus = (id: number, completed: boolean) => {
    console.log('completed: ', completed);
    const task = tasks.find((t) => Number(t.id) === id);
    if (task) {
      onToggleStatus(task);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">No hay tareas</h3>
        <p className="mt-1 text-sm text-gray-500">
          ¡Crea una nueva tarea para empezar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </div>
  );
};

export default TaskList;
