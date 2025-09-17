import React from 'react';
import { CheckCircleIcon, ClockIcon } from './icons';
import { Status } from '../types/types';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isCompleted = status === Status.Completed;

  const badgeClasses = `inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${
    isCompleted
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-800'
  }`;

  return (
    <span className={badgeClasses}>
      {isCompleted ? (
        <CheckCircleIcon className="h-4 w-4" />
      ) : (
        <ClockIcon className="h-4 w-4" />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
