# Daily Photo — Static Posturografi (Next.js)

Sistem pemeriksaan keseimbangan tubuh berbasis sensor load cell, di-generate dari design Figma ke **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS 3.4**
- **Inter** font via `next/font/google`
- Inline SVG icons (no icon library)

## Struktur

```
app/
├── layout.tsx              ← root layout + Inter font
├── globals.css
├── page.tsx                ← Home / dashboard
├── instruction/page.tsx    ← Modal petunjuk penggunaan
├── form/page.tsx           ← Form data identitas (state + validasi lokal)
├── processing/page.tsx     ← Pemeriksaan berlangsung (timer + chart live)
└── analytic/page.tsx       ← Hasil & kesimpulan

components/
├── Header.tsx              ← Brand header + slot kanan
├── FeatureCard.tsx
├── icons.tsx               ← Semua SVG icon (Activity, Play, Book, dll)
└── charts.tsx              ← LineChart + ScatterChart (SVG, no deps)

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
| `/processing`  | Timer berjalan + 3 grafik (SPL, Stabilogram, CoP Velocity) |
| `/analytic`    | Hasil 2 tahap + kesimpulan postur                          |

Form mem-persist data ke `sessionStorage` agar nama pasien muncul di header pemeriksaan.

## Design tokens

Tailwind `theme.extend` di `tailwind.config.ts` memetakan palette Figma:

- `brand.600` `#155DFC` — primary
- `brand.900` `#1C398E` — heading deep blue
- `accent.500` `#9333EA` — stabilogram / Center of Pressure
- `success.600` `#16A34A` — stage selesai
- `warning.600` `#F54900` — timer tahap aktif
- `danger` `#FB2C36` — error & status perlu perhatian
- `bg-page` — gradient halaman (#EFF6FF → #FFFFFF → #EFF6FF)

## Catatan

- Layout responsive: grid kolom otomatis menurunkan jadi single column di breakpoint kecil.
- Chart SVG murni — tidak butuh `recharts` / `chart.js`. Bisa diganti library kalau perlu fitur lebih kaya.
- Timer di `/processing` dummy (increment per detik); ganti dengan stream sensor asli sesuai kebutuhan.
