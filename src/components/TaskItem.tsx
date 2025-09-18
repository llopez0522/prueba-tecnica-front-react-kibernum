import React from 'react';
import StatusBadge from './StatusBadge';
import { PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon } from './icons';
import { Status, type Task } from '../types/types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: number, completed: boolean) => void; // Cambiar a string para consistencia
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const handleToggleStatus = () => {
    console.log('Tarea completa:', task);
    console.log('ID de tarea:', task.id);
    console.log('Tipo de ID:', typeof task.id);

    if (!task.id) {
      console.error('Error: ID de tarea no definido', task);
      return;
    }

    const newCompletedStatus = task.status !== Status.Completed;
    onToggleStatus(Number(task.id), newCompletedStatus);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3
            className={`text-lg font-semibold text-gray-800 truncate ${
              task.status === Status.Completed
                ? 'line-through text-gray-500'
                : ''
            }`}
          >
            {task.title}
          </h3>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {task.description || 'Sin descripción.'}
        </p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2 mt-4 sm:mt-0">
        <button
          onClick={handleToggleStatus}
          className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
            task.status === Status.Completed
              ? 'text-green-500 hover:bg-green-100'
              : 'text-yellow-500 hover:bg-yellow-100'
          }`}
          title={
            task.status === Status.Completed
              ? 'Marcar como pendiente'
              : 'Marcar como completada'
          }
        >
          {task.status === Status.Completed ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ClockIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
          title="Editar tarea"
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => onDelete(task.id.toString())}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
          title="Eliminar tarea"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
