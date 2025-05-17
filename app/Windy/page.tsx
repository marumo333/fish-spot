import React, { useState, useEffect } from "react";
import SelectableMap from "@/components/selectMap";
export default function WindViewer() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [wind, setWind] = useState<{
    speed: string;
    direction: string;
  } | null>(null);

  useEffect(() => {
    if (lat && lon) {
      const fetchWind = async () => {
        const res = await fetch(`/api/wind?lat=${lat}&lon=${lon}`);
        const raw = await res.json();

        const u = raw.hourly.wind_u.wind_u[0];
        const v = raw.hourly.wind_v.wind_v[0];
        const speed = Math.sqrt(u ** 2 + v ** 2);
        const directionRad = Math.atan2(u, v);
        const directionDeg = (directionRad * 180) / Math.PI;
        const compassDeg = (directionDeg + 360) % 360;

        setWind({
          speed: speed.toFixed(2),
          direction: Math.round(compassDeg).toString(),
        });
      };

      fetchWind();
    }
  }, [lat, lon]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">地図をクリックして地点を選択</h2>
      <SelectableMap onSelect={(lat, lon) => {
        setLat(lat);
        setLon(lon);
      }} />
      {wind && (
        <div className="bg-blue-100 p-4 rounded shadow">
          <p>🌍 緯度: {lat?.toFixed(4)}, 経度: {lon?.toFixed(4)}</p>
          <p>🌬 風速: {wind.speed} m/s</p>
          <p>🧭 風向: {wind.direction}°</p>
        </div>
      )}
    </div>
  );
}
