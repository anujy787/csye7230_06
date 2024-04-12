import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapWithSearch = ({searchTerm }) => {
    const [coordinates, setCoordinates] = useState(null);
  
    useEffect(() => {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
          } else {
            console.log('Location not found');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchCoordinates();
    }, [searchTerm]);
  
    return (
      <div>
        {coordinates && (
          <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coordinates.lat, coordinates.lon]}>
              <Popup>{searchTerm}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    );
};

export default MapWithSearch;
