import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from './Dialog';
import { Status, type Task } from '../types/types';

interface TaskFormData {
  title: string;
  description: string;
  status: Status;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'> | Task) => void;
  taskToEdit?: Task | null;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: Status.Pending,
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      setValue('title', taskToEdit.title);
      setValue('description', taskToEdit.description);
      setValue('status', taskToEdit.status);
    } else {
      reset({
        title: '',
        description: '',
        status: Status.Pending,
      });
    }
  }, [taskToEdit, isOpen, setValue, reset]);

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      if (taskToEdit) {
        await onSubmit({ ...data, id: taskToEdit.id });
      } else {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Editar Tarea' : 'Crear Tarea'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
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
              {...register('title', {
                required: 'El título es obligatorio',
                minLength: {
                  value: 3,
                  message: 'El título debe tener al menos 3 caracteres',
                },
                maxLength: {
                  value: 100,
                  message: 'El título no puede exceder 100 caracteres',
                },
              })}
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. Finalizar reporte"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
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
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'La descripción no puede exceder 500 caracteres',
                },
              })}
              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe la tarea..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
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
              {...register('status')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value={Status.Pending}>Pendiente</option>
              <option value={Status.Completed}>Completada</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLoading
              ? 'Procesando...'
              : taskToEdit
              ? 'Guardar Cambios'
              : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default TaskForm;
