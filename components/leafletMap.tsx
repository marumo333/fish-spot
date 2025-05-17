"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        onSelect(lat, lng);
      },
    });

    return marker ? <Marker position={marker} /> : null;
  };

  return (
    <MapContainer
      center={[26.2, 127.7]}
      zoom={8}
      scrollWheelZoom
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationSelector />
    </MapContainer>
  );
}

