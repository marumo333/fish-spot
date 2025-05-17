# 🎣 fish-spot

地図上で地点を選択すると、現在の風速・風向を表示してくれる Web アプリケーションです。
釣りに最適なスポットを見つけるために、気象条件を地図上で直感的に確認できます。

---

## 🚀 デモ（ローカル起動）

```bash
# 依存のインストール
npm install

# 開発サーバー起動
npm run dev
```

---

## 🔧 使用技術

* **Next.js 15 (App Router)**
* **React / TypeScript**
* **Tailwind CSS**
* **React Leaflet（地図表示）**
* **Open-Meteo API（風向・風速取得）**

---

## 🌬 機能

* 地図から地点を選択
* 選択した地点の緯度・経度を表示
* 該当地点の風速（m/s）と風向（方角 + 角度）を表示
* 気象データは Open-Meteo API から取得


## 📁 ディレクトリ構成

```
fish-spot/
├── app/
│   ├── page.tsx                  # メインページ
│   └── api/
│       └── wind/
│           └── route.ts         # APIルート（風データ取得）
├── components/
│   └── selectMap.tsx            # 地図選択用コンポーネント
├── public/
│   ├── screenshot-map.png       # 地図のスクリーンショット
│   └── screenshot-wind.png      # 風向風速のスクリーンショット
├── .env.local                   # 環境変数（ローカル用）
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔑 環境変数（`.env.local`）

```env
NEXT_PUBLIC_OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
```

---

## 🚀 デプロイ

[Vercel](https://vercel.com/) を使用して簡単にデプロイ可能です。
`NEXT_PUBLIC_OPEN_METEO_URL` は Vercel ダッシュボードの「Environment Variables」セクションに設定してください。

---

## 🛠 今後の改善案

* 潮汐・波・気温などの情報も統合して表示
* お気に入り地点の保存
* モバイル向けの UI 最適化
* 他の気象 API（例：OpenWeatherMap）との併用

---

## 👤 開発者

* GitHub: [marumo333](https://github.com/marumo333)
