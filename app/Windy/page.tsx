"use client";

import LeafletMap from "@/components/selectMap";
import { useEffect, useState } from "react";

// 方角に変換（0〜360° → 北・北東など）
function degToCompass(deg: number): string {
  const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
  return directions[Math.round(deg / 45) % 8];
}

export default function Page() {
  const [selected, setSelected] = useState<{ lat: number; lon: number } | null>(null);
  const [wind, setWind] = useState<{ speed: string; direction: string } | null>(null);

  

  useEffect(() => {
  if (!selected) return;

  const fetchWind = async () => {
  try {
    const res = await fetch(`/api/wind?lat=${selected.lat}&lon=${selected.lon}`);

    if (!res.ok) {
      console.error("レスポンスエラー:", res.status, res.statusText);
      return;
    }

    const raw = await res.json();

    const speed = raw?.hourly?.wind_speed_10m?.[0];
    const directionDeg = raw?.hourly?.wind_direction_10m?.[0];

    if (typeof speed !== "number" || typeof directionDeg !== "number") {
      console.error("風データが不完全です", raw);
      return;
    }

    const compassDeg = (directionDeg + 360) % 360;

    setWind({
      speed: speed.toFixed(2),
      direction: `${degToCompass(compassDeg)}（${Math.round(compassDeg)}°）`,
    });
  } catch (error) {
    console.error("fetchWind エラー:", error);
  }
};


  fetchWind();
}, [selected]);


  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">地図から地点を選択</h1>

      <LeafletMap onSelect={(lat, lon) => setSelected({ lat, lon })} />

      {selected && (
        <div className="bg-blue-100 p-3 rounded">
          <p>📍 緯度: {selected.lat.toFixed(4)}</p>
          <p>📍 経度: {selected.lon.toFixed(4)}</p>
        </div>
      )}

      {wind && (
        <div className="bg-green-100 p-3 rounded">
          <p>🌬 風速: {wind.speed} m/s</p>
          <p>🧭 風向: {wind.direction}</p>
        </div>
      )}
    </main>
  );
}

