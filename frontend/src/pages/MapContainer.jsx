import React from 'react';
import Map from '../components/map/maps';

const MapContainer = () => {
  return (
    <div className="w-full h-full">
      <Map longitude={-122.084} latitude={37.422} />
    </div>
  );
};

export default MapContainer;
