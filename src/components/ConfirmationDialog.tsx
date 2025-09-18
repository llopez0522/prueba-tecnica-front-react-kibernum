import React, { useState, useEffect } from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'danger' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Usar requestAnimationFrame para asegurar que el elemento se renderice antes de la animación
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Delay para permitir que la animación se complete antes de desmontar
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBgColor: 'bg-red-100',
          iconTextColor: 'text-red-600',
          buttonBgColor: 'bg-red-600',
          buttonHoverColor: 'hover:bg-red-700',
          buttonFocusColor: 'focus:ring-red-500',
        };
      case 'warning':
        return {
          iconBgColor: 'bg-yellow-100',
          iconTextColor: 'text-yellow-600',
          buttonBgColor: 'bg-yellow-600',
          buttonHoverColor: 'hover:bg-yellow-700',
          buttonFocusColor: 'focus:ring-yellow-500',
        };
      case 'info':
        return {
          iconBgColor: 'bg-blue-100',
          iconTextColor: 'text-blue-600',
          buttonBgColor: 'bg-blue-600',
          buttonHoverColor: 'hover:bg-blue-700',
          buttonFocusColor: 'focus:ring-blue-500',
        };
      default:
        return {
          iconBgColor: 'bg-red-100',
          iconTextColor: 'text-red-600',
          buttonBgColor: 'bg-red-600',
          buttonHoverColor: 'hover:bg-red-700',
          buttonFocusColor: 'focus:ring-red-500',
        };
    }
  };

  const styles = getVariantStyles();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: '#6a7282bf' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-lg max-w-sm w-full p-6 transform transition-all duration-300 ease-out ${
          isVisible
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 -translate-y-4 opacity-0'
        }`}
      >
        {/* Header con icono de advertencia */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`flex-shrink-0 w-8 h-8 ${styles.iconBgColor} rounded-full flex items-center justify-center`}
          >
            <svg
              className={`w-5 h-5 ${styles.iconTextColor}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${styles.buttonBgColor} border border-transparent rounded-md ${styles.buttonHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.buttonFocusColor} transition-colors duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
