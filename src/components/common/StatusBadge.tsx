import React from 'react';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: 'WFO' | 'WFH' | 'PDL' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<string, 'info' | 'warning' | 'success'> = {
    WFO: 'info',
    WFH: 'warning',
    PDL: 'success',
  };

  const variant = variants[status] || 'info';

  return <Badge variant={variant}>{status}</Badge>;
};
