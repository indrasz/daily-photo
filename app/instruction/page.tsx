"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import {
  ActivityIcon,
  PlayIcon,
  BookIcon,
  CloseIcon,
  InfoIcon,
} from "@/components/icons";

const STEPS = [
  {
    n: 1,
    title: "Persiapan",
    items: [
      "Pastikan sensor load cell terhubung dengan baik",
      "Lepaskan alas kaki sebelum melakukan pemeriksaan",
      "Pastikan platform dalam kondisi stabil dan rata",
    ],
  },
  {
    n: 2,
    title: "Posisi Tubuh",
    items: [
      "Berdiri tegak di tengah platform",
      "Kedua kaki dibuka selebar bahu",
      "Pandangan lurus ke depan",
      "Tangan rileks di samping tubuh",
    ],
  },
  {
    n: 3,
    title: "Proses Pemeriksaan",
    items: [
      "Klik tombol 'Mulai Pemeriksaan' untuk memulai",
      "Pertahankan posisi tubuh tetap stabil",
      "Durasi pemeriksaan sekitar 30-60 detik",
      "Sistem akan merekam data secara otomatis",
    ],
  },
  {
    n: 4,
    title: "Hasil Pemeriksaan",
    items: [
      "Hasil akan ditampilkan setelah pemeriksaan selesai",
      "Data meliputi distribusi beban dan pusat tekanan",
      "Hasil dapat disimpan atau dicetak",
    ],
  },
];

export default function InstructionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />

      {/* Background page (dimmed dashboard preview) */}
      <main className="flex-1 relative">
        <div className="mx-auto max-w-[1024px] px-4 sm:px-6 py-12 opacity-60 pointer-events-none">
          <section className="rounded-[14px] border border-brand-200 bg-white shadow-card p-6 sm:p-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mb-6">
              <ActivityIcon className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-ink-deep tracking-tight">
              Selamat Datang di Pemeriksaan
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-ink-subtle">
              Sistem pemeriksaan keseimbangan tubuh menggunakan teknologi sensor
              load cell untuk analisis postur statis
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="rounded-lg bg-brand-600 text-white shadow-btn px-6 py-6 flex flex-col items-center gap-2">
                <PlayIcon className="w-6 h-6" />
                <span className="text-lg font-medium">Mulai Pemeriksaan</span>
              </div>
              <div className="rounded-lg bg-white border border-brand-300 text-brand-700 shadow-btn px-6 py-6 flex flex-col items-center gap-2">
                <BookIcon className="w-6 h-6" />
                <span className="text-lg font-medium">Petunjuk Penggunaan</span>
              </div>
            </div>
          </section>
        </div>

        {/* Modal overlay */}
        <div
          className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instruction-title"
          onClick={() => router.push("/")}
        >
          <div
            className="bg-white rounded-[10px] border border-black/10 shadow-card w-full max-w-[512px] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6">
              {/* Close */}
              <Link
                href="/"
                aria-label="Tutup"
                className="absolute top-4 right-4 w-8 h-8 rounded flex items-center justify-center text-ink hover:bg-surface-muted opacity-70 hover:opacity-100"
              >
                <CloseIcon className="w-4 h-4" />
              </Link>

              {/* Header */}
              <div className="flex items-center gap-2">
                <BookIcon className="w-5 h-5 text-ink-deep" />
                <h2
                  id="instruction-title"
                  className="text-lg font-bold text-ink-deep tracking-tight"
                >
                  Petunjuk Penggunaan Sistem
                </h2>
              </div>
              <p className="mt-2 text-sm text-ink-subtle">
                Panduan lengkap untuk melakukan pemeriksaan static posturografi
              </p>

              {/* Steps */}
              <div className="mt-6 flex flex-col gap-6">
                {STEPS.map((step) => (
                  <section key={step.n}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-sm flex items-center justify-center">
                        {step.n}
                      </span>
                      <h3 className="text-base font-normal text-ink-deep">
                        {step.title}
                      </h3>
                    </div>
                    <ul className="mt-2 ml-4 flex flex-col gap-2">
                      {step.items.map((it) => (
                        <li
                          key={it}
                          className="flex gap-2 text-sm text-ink-slate leading-5"
                        >
                          <span
                            aria-hidden
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0"
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}

                {/* Note */}
                <div className="rounded-[10px] border border-brand-200 bg-brand-50 p-4 flex gap-3">
                  <InfoIcon className="w-5 h-5 text-brand-600 shrink-0" />
                  <div className="text-sm text-ink-slate leading-5">
                    <p className="font-bold mb-1">Catatan Penting:</p>
                    <p>
                      Hindari gerakan berlebihan selama pemeriksaan. Jika merasa
                      tidak seimbang atau tidak nyaman, segera hentikan
                      pemeriksaan dan hubungi operator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
