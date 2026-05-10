# Daily Photo — Static Posturografi (Next.js)

Sistem pemeriksaan keseimbangan tubuh berbasis sensor load cell

## Stack

- **Next.js 16** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS 3.4**
- **Recharts 3** — LineChart & ScatterChart
- **Inter** font via `next/font/google`
- Inline SVG icons

## Struktur

```
app/
├── layout.tsx              ← root layout + Inter font
├── globals.css
├── page.tsx                ← Home / dashboard
├── instruction/page.tsx    ← Modal petunjuk penggunaan
├── form/page.tsx           ← Form data identitas (state + validasi lokal)
└── analytic/page.tsx       ← Hasil & kesimpulan

components/
├── Header.tsx              ← Brand header + slot kanan
├── FeatureCard.tsx
├── icons.tsx               ← Semua SVG icon (Activity, Play, Book, dll)
└── charts.tsx              ← LineChart + ScatterChart (via Recharts)

lib/
├── utils.ts                ← cn(), fmtTime()
└── mock-signals.ts         ← Data dummy SPL / Velocity / CoP
```

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Halaman & Navigasi

| Path           | Deskripsi                                                  |
| -------------- | ---------------------------------------------------------- |
| `/`            | Home — CTA Mulai Pemeriksaan & Petunjuk Penggunaan         |
| `/instruction` | Modal petunjuk 4 langkah + catatan penting                 |
| `/form`        | Form identitas pasien dengan validasi inline               |
| `/analytic`    | Hasil 2 tahap + kesimpulan postur                          |

