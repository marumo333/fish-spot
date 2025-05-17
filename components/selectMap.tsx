"use client";

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

interface MapProps {
  onSelect: (lat: number, lon: number) => void;
}

function LocationSelector({ onSelect }: MapProps) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return marker ? <Marker position={marker} /> : null;
}

export default function SelectableMap({ onSelect }: MapProps) {
  return (
    <MapContainer
      center={[26.2, 127.7]}
      zoom={8}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationSelector onSelect={onSelect} />
    </MapContainer>
  );
}
