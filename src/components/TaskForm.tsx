import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons';
import { Status, type Task } from '../types/types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'> | Task) => void;
  taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.Pending);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(Status.Pending);
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    const taskData = {
      title,
      description,
      status, // Mantener como Status enum para la UI
    };

    try {
      setErrorMessage(null); // Limpiar errores previos
      if (taskToEdit) {
        onSubmit({ ...taskData, id: taskToEdit.id });
      } else {
        onSubmit(taskData);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message); // Mostrará: "Task with title 'Nueva tarea' already exists"
      } else {
        setErrorMessage('Error inesperado al crear la tarea');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center  bg-opacity-20 transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            {taskToEdit ? 'Editar Tarea' : 'Crear Tarea'}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="sr-only">Cerrar modal</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ej. Finalizar reporte"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Descripción
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe la tarea..."
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Estado
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as Status);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value={Status.Pending}>Pendiente</option>
                <option value={Status.Completed}>Completada</option>
              </select>
            </div>
            {errorMessage && (
              <div
                className="error-alert"
                style={{ color: 'red', marginBottom: '1rem' }}
              >
                {errorMessage}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
