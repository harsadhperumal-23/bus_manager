
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

export default function FleetMap() {
  const [pos, setPos] = useState([10.0, 76.3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(([lat, lng]) => [lat + 0.01, lng + 0.01]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={pos} zoom={7} style={{ height: 300 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos}>
        <Popup>BUS_001 Moving</Popup>
      </Marker>
    </MapContainer>
  );
}
