// components/SelectableMap.tsx
"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./leafletMap"), {
  ssr: false,
  loading: () => <p>地図を読み込み中...</p>,
});

export default LeafletMap;
