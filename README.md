# Daily Photo — Static Posturografi (Next.js)

Sistem pemeriksaan keseimbangan tubuh berbasis sensor load cell, di-generate dari design Figma ke **Next.js 16 (App Router) + TypeScript + Tailwind CSS**.

## Stack

- **Next.js 16** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS 3.4**
- **Recharts 3** — LineChart & ScatterChart
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

Form mem-persist data ke `sessionStorage` agar nama pasien muncul di header pemeriksaan.

## Design tokens

Tailwind `theme.extend` di `tailwind.config.ts` memetakan palette Figma:

- `brand.600` `#155DFC` — primary
- `brand.900` `#1C398E` — heading deep blue
- `accent.500` `#9333EA` — stabilogram / Center of Pressure
- `success.600` `#16A34A` — stage selesai
- `warning.600` `#F54900` — timer tahap aktif
- `danger` `#FB2C36` — error & status perlu perhatian
- `ink` / `ink.muted` / `ink.subtle` — skala warna teks
- `surface` / `surface.muted` / `surface.line` — warna permukaan & border
- `bg-page` — gradient halaman (`#EFF6FF → #FFFFFF → #EFF6FF`)
- `shadow.card` / `shadow.soft` / `shadow.btn` — custom box-shadow

## Catatan

- Layout responsive: grid kolom otomatis menurunkan jadi single column di breakpoint kecil.
- Chart menggunakan **Recharts** (`LineChart`, `ScatterChart`) dengan wrapper `ResponsiveContainer`.
- Data grafik bersumber dari `lib/mock-signals.ts`; ganti dengan stream sensor asli sesuai kebutuhan.
