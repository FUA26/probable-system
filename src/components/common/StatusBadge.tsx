import React from 'react';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: 'WFO' | 'WFH' | 'PDL';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    WFO: 'info' as const,
    WFH: 'warning' as const,
    PDL: 'success' as const,
  };

  const labels = {
    WFO: 'WFO',
    WFH: 'WFH',
    PDL: 'PDL',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};
