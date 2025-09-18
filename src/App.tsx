import React, { useState, useMemo } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Notification from './components/Notification';
import Header from './components/Header';
import ConfirmationDialog from './components/ConfirmationDialog';
import { PlusIcon } from './components/icons';
import { FilterStatus, Status, type Task } from './types/types';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTaskStatus,
} from './hooks/useTasks';
import type { CreateTaskDTO, UpdateTaskDTO } from './services/taskService';
import { isDevelopmentMode } from './utils/mockData';

const App: React.FC = () => {
  // Estados locales para la UI
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    taskId: string;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
  });

  // React Query hooks
  const { data: tasks = [], isLoading, error } = useTasks();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleStatusMutation = useToggleTaskStatus();

  // Mostrar errores de carga
  if (error) {
    console.error('Error loading tasks:', error);
  }

  // Handlers para las operaciones CRUD
  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const createTaskData: CreateTaskDTO = {
        title: taskData.title,
        description: taskData.description,
        completed: taskData.status === Status.Completed, // Convertir a boolean con campo 'completed'
      };

      await createTaskMutation.mutateAsync(createTaskData);
      setIsModalOpen(false);
      setNotification({ message: 'Tarea creada con éxito.', type: 'success' });
    } catch (error) {
      console.error('Error creating task:', error);
      setNotification({
        message: `${error}`,
        type: 'error',
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updateTaskData: UpdateTaskDTO = {
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.status === Status.Completed, // Convertir a boolean con campo 'completed'
      };

      await updateTaskMutation.mutateAsync({
        id: updatedTask.id,
        taskData: updateTaskData,
      });
      setIsModalOpen(false);
      setTaskToEdit(null);
      setNotification({
        message: 'Tarea actualizada correctamente.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setNotification({
        message: 'Error al actualizar la tarea.',
        type: 'error',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Buscar la tarea para obtener su título
    const taskToDelete = tasks.find((task) => task.id.toString() === id);
    const taskTitle = taskToDelete ? taskToDelete.title : 'esta tarea';

    setConfirmDialog({
      isOpen: true,
      taskId: id,
      taskTitle: taskTitle,
    });
  };

  const confirmDeleteTask = async () => {
    try {
      await deleteTaskMutation.mutateAsync(confirmDialog.taskId);
      setNotification({ message: 'Tarea eliminada.', type: 'error' });
      setConfirmDialog({ isOpen: false, taskId: '', taskTitle: '' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setNotification({
        message: 'Error al eliminar la tarea.',
        type: 'error',
      });
      setConfirmDialog({ isOpen: false, taskId: '', taskTitle: '' });
    }
  };

  const cancelDeleteTask = () => {
    setConfirmDialog({ isOpen: false, taskId: '', taskTitle: '' });
  };

  const handleToggleStatus = async (taskToToggle: Task) => {
    try {
      const newStatus =
        taskToToggle.status === Status.Completed
          ? Status.Pending
          : Status.Completed;

      await toggleStatusMutation.mutateAsync({
        id: taskToToggle.id.toString(),
        status: newStatus,
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      setNotification({
        message: 'Error al cambiar el estado de la tarea.',
        type: 'error',
      });
    }
  };

  // Handler unificado para el formulario
  const handleTaskSubmit = async (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
      // Es una actualización
      await handleUpdateTask(taskData);
    } else {
      // Es una creación
      await handleAddTask(taskData);
    }
  };
  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const filteredTasks = useMemo(() => {
    // Asegurar que tasks es un array
    if (!Array.isArray(tasks)) {
      console.log('App.tsx - tasks no es un array, retornando []');
      return [];
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesStatus =
        filter === FilterStatus.All ||
        (filter === FilterStatus.Pending && task.status === Status.Pending) ||
        (filter === FilterStatus.Completed && task.status === Status.Completed);
      const matchesSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(lowercasedQuery) ||
        task.description.toLowerCase().includes(lowercasedQuery);

      return matchesStatus && matchesSearch;
    });
    return filtered;
  }, [tasks, filter, searchQuery]);

  const FilterButton: React.FC<{ value: FilterStatus; label: string }> = ({
    value,
    label,
  }) => {
    const isActive = filter === value;
    return (
      <button
        onClick={() => setFilter(value)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Tareas</h1>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nueva Tarea</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <label htmlFor="search-tasks" className="sr-only">
              Buscar tareas
            </label>
            <input
              id="search-tasks"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterButton value={FilterStatus.All} label="Todas" />
            <FilterButton value={FilterStatus.Pending} label="Pendientes" />
            <FilterButton value={FilterStatus.Completed} label="Completadas" />
          </div>
        </div>

        {isLoading && (!tasks || tasks.length === 0) ? (
          <div className="text-center p-10">
            <p className="text-gray-500">Cargando tareas...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10">
            <p className="text-red-500">Error al cargar las tareas</p>
            <p className="text-gray-500 text-sm mt-2">
              {isDevelopmentMode()
                ? 'Usando datos de ejemplo (API no disponible)'
                : 'Verifica la conexión con el servidor'}
            </p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </main>

      <TaskForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
        taskToEdit={taskToEdit}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar tarea"
        message={`¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
};

export default App;
