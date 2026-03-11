import React from 'react';

type StatusType = 'critical' | 'warning' | 'healthy' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, pulse = false, className = '' }: StatusBadgeProps) {
  const statusClasses = {
    critical: 'status-critical',
    warning: 'status-warning',
    healthy: 'status-healthy',
    info: 'status-info',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${statusClasses[status]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${pulse ? 'animate-pulse' : ''}`} 
            style={{ 
              background: 'currentColor'
            }} 
      />
      {label}
    </span>
  );
}
