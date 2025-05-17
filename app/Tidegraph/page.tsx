"use client"
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

// 型定義: 必要に応じて詳細を調整してください
type TideData = {
  tide: {
    port: {
      harbor_namej: string;
    };
    chart: {
      [date: string]: {
        flood?: { time: string }[];
        edd?: { time: string }[];
        sun: { rise: string; set: string };
        moon: { rise?: string; set?: string; title: string };
      };
    };
  };
};

export default function Tidegraph() {
  const [pref, setPref] = useState(""); //県を設定
  const [port, setPort] = useState(""); //港を設定
  const [year, setYear] = useState(2025); //以下で年月日を設定
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [data, setData] = useState<TideData | null>(null);
const [pchc, setPchc] = useState<Record<string, Record<string, string>>>({});
const [pcCodes, setPcCodes] = useState<Record<string, string>>({});
  const [calendar, setCalendar] = useState<{[key:string]:number[]}>({}); //カレンダーデータ

  useEffect(() => {
    Promise.all([
      fetch("/pc_hc.json").then((res) => res.json()),
      fetch("/pc_code.json").then((res) => res.json()),
      fetch("/calender.json").then((res) => res.json()),
    ])
      .then(([hc, code, cal]) => {
        setPchc(hc);
        setPcCodes(code);
        setCalendar(cal);
      })
      .catch((err) => console.error("データの取得に失敗しました", err));
  }, []);
  const getTide = async () => {
    const pc = pcCodes[pref];
    const hc = pchc[pref][port];
    if(!pref){
        console.log("所持地を選択してください")
        return;
    }
    if(!port){
        console.log("港を選択してください")
        return;
    }
    const res = await fetch(`/api/tide?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}`)
    const json = await res.json();
    setData(json);
  };
  return (
    <>
      <main className="p-8 max-w-2xl mx-auto">
  <h1 className="text-3xl font-bold mb-6 text-center">潮汐情報表示</h1>

<div className="space-y-6 bg-white p-6 rounded shadow-md">
  <div className="flex flex-col gap-2">
    <label htmlFor="prefecture" className="font-medium">都道府県:</label>
    <select
      id="prefecture"
      name="prefecture"
      value={pref}
      onChange={(e) => setPref(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">--選択--</option>
      {Object.keys(pchc).map((p) => (
        <option key={p}>{p}</option>
      ))}
      </select>
    </div>
  
    {pref && (
      <div className="flex flex-col gap-2">
        <label htmlFor="port" className="font-medium">港:</label>
        <select
          id="port"
          name="port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">--選択--</option>
          {Object.keys(pchc[pref]).map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
      </div>
    )}
  
    <div className="flex gap-4 items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="year" className="font-medium">年:</label>
        <select
          id="year"
          name="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={2025}>2025</option>
        </select>
      </div>
  
      <div className="flex flex-col gap-1">
        <label htmlFor="month" className="font-medium">月:</label>
        <select
          id="month"
          name="month"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}月</option>
          ))}
        </select>
      </div>
  
      <div className="flex flex-col gap-1">
        <label htmlFor="day" className="font-medium">日:</label>
        <select
          id="day"
          name="day"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {(calendar[`${month}月`] || []).map((d) => (
            <option key={d} value={d}>{d}日</option>
          ))}
        </select>
      </div>
    </div>
  
    <button
      onClick={getTide}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow"
      disabled={!pref || !port}
    >
      潮汐情報取得
    </button>
    <Link className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow"href="/">ホーム画面に戻る</Link>
    {data && (
      <div className="mt-6 p-4 bg-gray-50 rounded shadow border">
        <h2 className="font-semibold text-lg mb-4">
          都道府県: {pref} / 港: {data.tide.port.harbor_namej}
        </h2>
  
        {(() => {
          const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const chart = data.tide.chart[dateKey];
  
          const flood = chart.flood ?? [];
          const edd = chart.edd ?? [];
  
          const mancho1 = flood[0]?.time ?? '-';
          const mancho2 = flood[1]?.time ?? '-';
          const kancho1 = edd[0]?.time ?? '-';
          const kancho2 = edd[1]?.time ?? '-';
  
          const hinode = chart.sun.rise;
          const hinoiri = chart.sun.set;
          const tukide = chart.moon.rise?.split('日')[1]?.trim() ?? '-';
          const tukiiri = chart.moon.set?.split('日')[1]?.trim() ?? '-';
  
          return (
            <>
              {/* 潮汐のマトリクス表示1 */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {['潮', '満潮1', '満潮2', '干潮1', '干潮2'].map((label, i) => {
                  const values = [
                    chart.moon.title,
                    mancho1,
                    mancho2,
                    kancho1,
                    kancho2,
                  ];
                  return (
                    <div key={label} className="bg-white p-3 rounded shadow text-center">
                      <div className="text-sm text-gray-500">{label}</div>
                      <div className="text-xl font-semibold">{values[i]}</div>
                    </div>
                  );
                })}
              </div>
  
              {/* 日出・月出のマトリクス表示2 */}
              <div className="grid grid-cols-4 gap-4">
                {['日出', '日入', '月出', '月入'].map((label, i) => {
                  const values = [hinode, hinoiri, tukide, tukiiri];
                  return (
                    <div key={label} className="bg-white p-3 rounded shadow text-center">
                      <div className="text-sm text-gray-500">{label}</div>
                      <div className="text-xl font-semibold">{values[i]}</div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>
    )}
  </div>
  </main>
  </>
)}