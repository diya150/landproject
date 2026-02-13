import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers




const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SatelliteMapProps {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  plotId?: string;
  title?: string;
  height?: string;
}

function MapUpdater({ coordinates }: { coordinates?: { latitude: number; longitude: number } }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], 14);
    }
  }, [coordinates, map]);

  return null;
}

export function SatelliteMap({
  coordinates = { latitude: 20.1920, longitude: 81.7196 }, // Default to Naya Raipur, Chhattisgarh
  plotId = 'PLT-2024-001',
  title = 'Satellite Map',
  height = '400px'
}: SatelliteMapProps) {
  const defaultCoordinates = { latitude: 20.1920, longitude: 81.7196 };
  const activeCoordinates = coordinates || defaultCoordinates;

  // Create bounds for the area (roughly 2km x 2km)
  const latDelta = 0.02;
  const lonDelta = 0.02;
  const bounds = [
    [activeCoordinates.latitude - latDelta, activeCoordinates.longitude - lonDelta],
    [activeCoordinates.latitude + latDelta, activeCoordinates.longitude + lonDelta]
  ] as [[number, number], [number, number]];

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 bg-slate-50">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MapContainer
          style={{ height, width: '100%' }}
          className="rounded-b-lg"
        >
          {/* Satellite Tile Layer */}
          <TileLayer
  {...{
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, DigitalGlobe, Earthstar Geographics",
  }}
/>

          {/* Update map when coordinates change */}
          <MapUpdater coordinates={activeCoordinates} />

          {/* Plot Area Rectangle */}
          <Rectangle
            bounds={bounds}
            pathOptions={{
              color: '#059669',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.1,
              dashArray: '5, 5'
            }}
          />

          {/* Center Marker */}
          <Marker position={[activeCoordinates.latitude, activeCoordinates.longitude]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{plotId}</p>
                <p>Lat: {activeCoordinates.latitude.toFixed(4)}</p>
                <p>Lon: {activeCoordinates.longitude.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
