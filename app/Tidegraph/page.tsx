import React from "react";
import { useState, useEffect } from "react";
export default function Tidegraph() {
  const [pref, setPref] = useState(""); //県を設定
  const [port, setPort] = useState(""); //港を設定
  const [year, setYear] = useState(2025); //以下で年月日を設定
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [data, setData] = useState<any>(null); //取得データを定義
  const [pchc, setPchc] = useState<any>({}); //港のデータ
  const [pcCodes, setPcCodes] = useState<any>({}); //都道府県データ
  const [calendar, setCalendar] = useState<{[key:string]:number[]}>({}); //カレンダーデータ

  useEffect(() => {
    Promise.all([
      fetch("./pc_hc.json").then((res) => res.json()),
      fetch("./pc_code.json").then((res) => res.json()),
      fetch("calender.json").then((res) => res.json()),
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
    const res = await fetch(
      `https://api.tide736.net/get_tide.php?&pc=${pc}&hc=${hc}&yr=${year}&mh=${month}&dy=${day}&rg=day`
    );
    const json = await res.json();
    setData(json);
  };
  return (
    <>
      <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">潮汐情報表示アプリ</h1>

      <div className="space-y-4">
        <div>
          <label>都道府県:</label>
          <select value={pref} onChange={(e) => setPref(e.target.value)}>
            <option value="">--選択--</option>
            {Object.keys(pchc).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {pref && (
          <div>
            <label>港:</label>
            <select value={port} onChange={(e) => setPort(e.target.value)}>
              <option value="">--選択--</option>
              {Object.keys(pchc[pref]).map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            <option value={2023}>2023</option>
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}月</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {(calendar[`${month}月`] || []).map((d: number) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>

        <button onClick={getTide} className="bg-blue-500 text-white px-4 py-2 rounded">
          潮汐情報取得
        </button>

        {data && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-bold text-lg">
              都道府県: {pref} / 港: {data.tide.port.harbor_namej}
            </h2>

            <p>潮: {data.tide.chart[`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`].moon.title}</p>
            {/* 以下略：満潮干潮データなどを同様に表示 */}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
