import Link from "next/link";
import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { ActivityIcon, PlayIcon, BookIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-[1024px] px-4 sm:px-6 py-12">
          {/* Hero card */}
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
              <Link
                href="/form"
                className="group rounded-lg bg-brand-600 hover:bg-brand-700 transition-colors text-white shadow-btn px-6 py-6 flex flex-col items-center gap-2"
              >
                <PlayIcon className="w-6 h-6" />
                <span className="text-lg font-medium tracking-tight">
                  Mulai Pemeriksaan
                </span>
              </Link>

              <Link
                href="/instruction"
                className="group rounded-lg bg-white hover:bg-brand-50 transition-colors border border-brand-300 text-brand-700 shadow-btn px-6 py-6 flex flex-col items-center gap-2"
              >
                <BookIcon className="w-6 h-6" />
                <span className="text-lg font-medium tracking-tight">
                  Petunjuk Penggunaan
                </span>
              </Link>
            </div>
          </section>

          {/* Feature highlights */}
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              title="Akurat"
              description="Menggunakan sensor load cell presisi tinggi untuk pengukuran yang akurat"
            />
            <FeatureCard
              title="Cepat"
              description="Proses pemeriksaan yang efisien dengan hasil real-time"
            />
            <FeatureCard
              title="Mudah"
              description="Interface yang intuitif dan mudah digunakan untuk semua kalangan"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
