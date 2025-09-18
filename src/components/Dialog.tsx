import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { XMarkIcon } from './icons';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true,
  className = '',
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

  if (!shouldRender) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-lg';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: '#6a7282bf' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${getSizeClasses()} m-4 transform transition-all duration-300 ease-out ${
          isVisible
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 -translate-y-4 opacity-0'
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="sr-only">Cerrar modal</span>
            </button>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Dialog;
