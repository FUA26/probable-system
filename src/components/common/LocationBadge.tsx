import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface LocationBadgeProps {
  location: string;
  distance?: number; // in meters
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({ location, distance }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaMapMarkerAlt className="text-primary-600" />
      <span>{location}</span>
      {distance !== undefined && (
        <span className="text-xs text-gray-500">
          ({Math.round(distance)}m dari kantor)
        </span>
      )}
    </div>
  );
};
