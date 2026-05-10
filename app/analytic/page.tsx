"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { LineChart, ScatterChart } from "@/components/charts";
import {
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleFillIcon,
  AlertTriangleIcon,
} from "@/components/icons";
import { fmtTime } from "@/lib/utils";
import {
  splSeries,
  velocitySeries,
  copScatter,
  copCloudTight,
} from "@/lib/mock-signals";

const STAGE_DURATION = 30;

type Metrics = { spl: number; aoe: number; vAP: number; vML: number };

const FINAL_METRICS: [Metrics, Metrics] = [
  { spl: 13.47, aoe: 1.1818, vAP: 0.27, vML: 0.308 },
  { spl: 25.87, aoe: 3.4336, vAP: 0.551, vML: 0.552 },
];

export default function AnalyticPage() {
  const [elapsed, setElapsed] = useState(0);
  const [patient, setPatient] = useState("Pasien");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("posturografi.patient");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.nama) setPatient(d.nama);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed((e) => {
        if (e >= STAGE_DURATION * 2) {
          clearInterval(t);
          return e;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const isDone = elapsed >= STAGE_DURATION * 2;
  const stage = elapsed < STAGE_DURATION ? 1 : 2;
  const stageElapsed = isDone ? STAGE_DURATION : elapsed % STAGE_DURATION;
  const stagePct = Math.round((stageElapsed / STAGE_DURATION) * 100);
  const overallPct = Math.round(
    (Math.min(elapsed, STAGE_DURATION * 2) / (STAGE_DURATION * 2)) * 100
  );

  const splData = useMemo(() => {
    if (isDone) return splSeries(30, 27.26);
    const max = Math.max(0.05, (stageElapsed / STAGE_DURATION) * (stage === 1 ? 13.47 : 27.26));
    return splSeries(stageElapsed, max);
  }, [isDone, stageElapsed, stage]);

  const velAP = useMemo(() => {
    if (isDone) return velocitySeries(30, 0.55, 0.18, 1);
    return velocitySeries(stageElapsed, 0.18, 0.05, 1);
  }, [isDone, stageElapsed]);

  const velML = useMemo(() => {
    if (isDone) return velocitySeries(30, 0.55, 0.22, 2.5);
    return velocitySeries(stageElapsed, 0.27, 0.06, 2.5);
  }, [isDone, stageElapsed]);

  const cop = useMemo(() => {
    if (isDone) return copScatter(280, 0.55, 0.55, 1);
    return copCloudTight(Math.min(60, stageElapsed * 2), 1);
  }, [isDone, stageElapsed]);

  const splNow = splData.length ? splData[splData.length - 1].y : 0;
  const vAPNow = velAP.length ? velAP[velAP.length - 1].y : 0;
  const vMLNow = velML.length ? velML[velML.length - 1].y : 0;

  const avg = {
    spl: ((FINAL_METRICS[0].spl + FINAL_METRICS[1].spl) / 2).toFixed(2),
    aoe: ((FINAL_METRICS[0].aoe + FINAL_METRICS[1].aoe) / 2).toFixed(4),
    vel: (
      (FINAL_METRICS[0].vAP + FINAL_METRICS[1].vAP + FINAL_METRICS[0].vML + FINAL_METRICS[1].vML) /
      4
    ).toFixed(3),
  };

  const stage1Status = elapsed >= STAGE_DURATION ? "done" : "active";
  const stage2Status: "active" | "pending" | "done" = isDone
    ? "done"
    : elapsed >= STAGE_DURATION
    ? "active"
    : "pending";

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header
        title="Pemeriksaan Berlangsung"
        subtitle={`Pasien: ${patient}`}
        right={
          <div className="hidden md:flex gap-3">
            <TimerBox
              label="Waktu Total"
              value={fmtTime(elapsed)}
              tone="brand"
              icon={<ClockIcon className="w-5 h-5" />}
            />
            <TimerBox
              label={`Tahap ${stage}`}
              value={`${fmtTime(stageElapsed)} / 00:30`}
              tone="warning"
            />
          </div>
        }
      />

      <main className="flex-1">
        <div className="mx-auto max-w-[1024px] px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6 items-start">

          {/* Left column */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">

            {/* Procedure card */}
            <section className="rounded-[14px] border border-surface-line bg-white shadow-card p-6">
              <h2 className="text-lg font-medium text-ink-deep mb-4">
                Prosedur Pelaksanaan Pemeriksaan
              </h2>

              {isDone ? (
                <>
                  <ResultStage
                    status="done"
                    title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                    description="Berdiri tegak dengan kedua kaki, mata terbuka, pandang lurus ke depan"
                    metrics={FINAL_METRICS[0]}
                    icon={<EyeIcon className="w-5 h-5" />}
                  />
                  <div className="h-3" />
                  <ResultStage
                    status="done"
                    title="Tahap 2: Berdiri dengan 2 Kaki Mata Tertutup"
                    description="Berdiri dengan kedua kaki, mata tertutup, pertahankan keseimbangan"
                    metrics={FINAL_METRICS[1]}
                    icon={<EyeOffIcon className="w-5 h-5" />}
                  />
                  <div className="mt-4 rounded-[10px] border border-success-200 bg-success-50 p-4 flex gap-3">
                    <CheckCircleFillIcon className="w-5 h-5 text-success-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-success-600">Pemeriksaan Selesai!</p>
                      <p className="text-sm text-ink-slate">
                        Semua tahap telah berhasil direkam. Lihat kesimpulan di bawah.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <StageCard
                    status={stage1Status}
                    title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                    description="Berdiri tegak dengan kedua kaki, mata terbuka, pandang lurus ke depan"
                    icon={<EyeIcon className="w-5 h-5" />}
                  />
                  <div className="h-3" />
                  <StageCard
                    status={stage2Status}
                    title="Tahap 2: Berdiri dengan 2 Kaki Mata Tertutup"
                    description="Berdiri dengan kedua kaki, mata tertutup, pertahankan keseimbangan"
                    icon={<EyeOffIcon className="w-5 h-5" />}
                  />
                </>
              )}

              <div className="mt-4 rounded-[10px] border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm text-ink-slate">
                  <span className="font-bold">Progress Keseluruhan:</span> Tahap{" "}
                  {isDone ? 2 : stage} dari 2
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  Progress tahap saat ini: {isDone ? 100 : stagePct}%
                </p>
              </div>
            </section>

            {/* SPL */}
            <section className="rounded-[14px] border border-brand-200 bg-white shadow-card p-6">
              <h2 className="text-lg font-medium text-ink-deep mb-4">
                Grafik 1: Sway Path Length (SPL)
              </h2>
              <LineChart
                data={splData}
                xLabel="Waktu (detik)"
                yLabel="SPL (cm)"
                xDomain={isDone ? [1, 30] : [0, Math.max(2, stageElapsed)]}
                yDomain={isDone ? [0, 28] : [0, 0.8]}
                accent="#155DFC"
                legend={[{ name: "Sway Path Length", color: "#155DFC" }]}
              />
              <div className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
                SPL Saat Ini: {isDone ? "27.26" : splNow.toFixed(2)} cm
              </div>
            </section>

            {/* Hasil Tahap — desktop only; mobile version rendered below both columns */}
            {isDone && (
              <section className="hidden lg:block rounded-[14px] border border-warning-500/40 bg-white p-6">
                <h2 className="text-lg font-medium text-warning-900 mb-4">
                  Hasil Tahap yang Telah Selesai
                </h2>
                <div className="flex flex-col gap-4">
                  <CompletedStage
                    title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                    metrics={FINAL_METRICS[0]}
                  />
                  <CompletedStage
                    title="Tahap 2: Berdiri dengan 2 Kaki Mata Tertutup"
                    metrics={FINAL_METRICS[1]}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">

            {/* Stabilogram */}
            <section className="rounded-[14px] border border-accent-200 bg-white shadow-card p-6">
              <h2 className="text-lg font-medium text-accent-500 mb-4">
                Grafik 2: Area of Ellipse (Stabilogram)
              </h2>
              <ScatterChart
                points={cop}
                xLabel="ML CoP (cm)"
                yLabel="AP CoP (cm)"
                legend="Center of Pressure"
              />
              <div className="mt-4 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-500">
                AoE Saat Ini: {isDone ? "3.4599" : (0.0286).toFixed(4)} cm²
              </div>
            </section>

            {/* Velocity */}
            <section className="rounded-[14px] border border-success-200 bg-white shadow-card p-6">
              <h2 className="text-lg font-medium text-success-600 mb-4">
                Grafik 3: Average CoP Velocity
              </h2>
              <LineChart
                series={[
                  { name: "V-AP", color: "#155DFC", points: velAP },
                  { name: "V-ML", color: "#F59E0B", points: velML },
                ]}
                xLabel="Waktu (detik)"
                yLabel="Velocity (cm/s)"
                xDomain={isDone ? [1, 30] : [1, Math.max(2, stageElapsed + 1)]}
                yDomain={isDone ? [0, 1.2] : [0, 0.3]}
                legend={[
                  { name: "V-AP", color: "#155DFC" },
                  { name: "V-ML", color: "#F59E0B" },
                ]}
              />
              <div className="mt-4 rounded-lg bg-success-50 px-3 py-2 text-sm text-success-600 flex flex-wrap justify-between gap-2">
                <span>V-AP Saat Ini: {isDone ? "0.562" : vAPNow.toFixed(3)} cm/s</span>
                <span>V-ML Saat Ini: {isDone ? "0.593" : vMLNow.toFixed(3)} cm/s</span>
              </div>
            </section>

            {/* Kesimpulan — desktop only; mobile version rendered below both columns */}
            {isDone && (
              <section className="hidden lg:block rounded-[14px] border-2 border-danger/70 bg-white p-6">
                <h2 className="text-lg font-medium text-danger mb-4">
                  Kesimpulan Pemeriksaan Postur
                </h2>
                <div className="rounded-[10px] border border-danger/40 bg-red-50 p-4 flex gap-3">
                  <AlertTriangleIcon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-danger">Status: PERLU PERHATIAN</p>
                    <p className="text-sm text-ink-slate">
                      Kontrol postur tubuh Anda memerlukan perhatian dan konsultasi dengan tenaga medis.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-ink-deep">Rata-rata Parameter:</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ParamBox label="SPL" value={`${avg.spl} cm`} />
                  <ParamBox label="AoE" value={`${avg.aoe} cm²`} />
                  <ParamBox label="Avg Velocity" value={`${avg.vel} cm/s`} />
                </div>
                <Link
                  href="/"
                  className="mt-6 block text-center rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 text-sm font-medium py-2.5 transition-colors"
                >
                  Kembali ke Dashboard
                </Link>
              </section>
            )}
          </div>

        </div>

        {/* Mobile-only: result cards after all chart cards, Hasil Tahap above Kesimpulan */}
        {isDone && (
          <div className="lg:hidden mx-auto max-w-[1024px] px-4 sm:px-6 pb-8 flex flex-col gap-6">
            <section className="rounded-[14px] border border-warning-500/40 bg-white p-6">
              <h2 className="text-lg font-medium text-warning-900 mb-4">
                Hasil Tahap yang Telah Selesai
              </h2>
              <div className="flex flex-col gap-4">
                <CompletedStage
                  title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                  metrics={FINAL_METRICS[0]}
                />
                <CompletedStage
                  title="Tahap 2: Berdiri dengan 2 Kaki Mata Tertutup"
                  metrics={FINAL_METRICS[1]}
                />
              </div>
            </section>

            <section className="rounded-[14px] border-2 border-danger/70 bg-white p-6">
              <h2 className="text-lg font-medium text-danger mb-4">
                Kesimpulan Pemeriksaan Postur
              </h2>
              <div className="rounded-[10px] border border-danger/40 bg-red-50 p-4 flex gap-3">
                <AlertTriangleIcon className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-danger">Status: PERLU PERHATIAN</p>
                  <p className="text-sm text-ink-slate">
                    Kontrol postur tubuh Anda memerlukan perhatian dan konsultasi dengan tenaga medis.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-ink-deep">Rata-rata Parameter:</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ParamBox label="SPL" value={`${avg.spl} cm`} />
                <ParamBox label="AoE" value={`${avg.aoe} cm²`} />
                <ParamBox label="Avg Velocity" value={`${avg.vel} cm/s`} />
              </div>
              <Link
                href="/"
                className="mt-6 block text-center rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 text-sm font-medium py-2.5 transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function TimerBox({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "brand" | "warning";
  icon?: React.ReactNode;
}) {
  const cls =
    tone === "brand"
      ? "bg-brand-50 border-brand-600 text-ink-deep"
      : "bg-warning-50 border-warning-600 text-warning-900";
  return (
    <div className={`rounded-[10px] border ${cls} px-5 py-3 flex items-center gap-3`}>
      {icon && <span className="text-current">{icon}</span>}
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-wider text-ink-muted">{label}</span>
        <span className="text-2xl font-normal tabular-nums">{value}</span>
      </div>
    </div>
  );
}

function StageCard({
  status,
  title,
  description,
  icon,
}: {
  status: "active" | "pending" | "done";
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const isActive = status === "active";
  const isDone = status === "done";
  return (
    <div
      className={[
        "rounded-[12px] p-4 flex gap-3",
        isActive
          ? "border-2 border-brand-600 bg-brand-50/40"
          : isDone
          ? "border-2 border-success-500/50 bg-success-50"
          : "border border-surface-line bg-surface-muted",
      ].join(" ")}
    >
      <div
        className={[
          "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center",
          isActive
            ? "bg-brand-600 text-white"
            : isDone
            ? "bg-success-600 text-white"
            : "bg-white text-ink-muted",
        ].join(" ")}
      >
        {isDone ? <CheckCircleFillIcon className="w-5 h-5" /> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="text-base font-medium text-ink-deep leading-tight">{title}</h3>
          {isActive && (
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-brand-600 text-white whitespace-nowrap">
              Sedang Berlangsung
            </span>
          )}
          {isDone && (
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-success-600 text-white whitespace-nowrap">
              Selesai
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
        <p className="mt-2 text-xs text-ink-subtle">Durasi: 30 detik</p>
      </div>
    </div>
  );
}

function ResultStage({
  status,
  title,
  description,
  metrics,
  icon,
}: {
  status: "active" | "done";
  title: string;
  description: string;
  metrics: Metrics;
  icon: React.ReactNode;
}) {
  const isDone = status === "done";
  return (
    <div
      className={[
        "rounded-[12px] p-4",
        isDone
          ? "border-2 border-success-500/50 bg-success-50"
          : "border-2 border-brand-600 bg-brand-50/40",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <div
          className={[
            "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center",
            isDone ? "bg-success-600 text-white" : "bg-brand-600 text-white",
          ].join(" ")}
        >
          {isDone ? <CheckCircleFillIcon className="w-5 h-5" /> : icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="text-base font-medium text-ink-deep leading-tight">{title}</h3>
            <span
              className={[
                "text-xs font-medium px-2 py-1 rounded-md text-white whitespace-nowrap",
                isDone ? "bg-success-600" : "bg-brand-600",
              ].join(" ")}
            >
              {isDone ? "Selesai" : "Sedang Berlangsung"}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
          <p className="mt-2 text-xs text-ink-subtle">Durasi: 30 detik</p>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-white/70 border border-black/5 p-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-slate">
        <span>SPL: {metrics.spl} cm</span>
        <span>AoE: {metrics.aoe} cm²</span>
        <span>Avg Velocity (AP): {metrics.vAP} cm/s</span>
        <span>Avg Velocity (ML): {metrics.vML} cm/s</span>
      </div>
    </div>
  );
}

function CompletedStage({ title, metrics }: { title: string; metrics: Metrics }) {
  return (
    <div className="rounded-[10px] bg-warning-50 border border-warning-500/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-medium text-ink-deep">{title}</h3>
        <CheckCircleFillIcon className="w-5 h-5 text-warning-600" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-slate">
        <span>SPL: {metrics.spl} cm</span>
        <span>AoE: {metrics.aoe} cm²</span>
        <span>Avg Velocity (AP): {metrics.vAP} cm/s</span>
        <span>Avg Velocity (ML): {metrics.vML} cm/s</span>
      </div>
    </div>
  );
}

function ParamBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-red-50/40 px-3 py-2">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="text-base font-medium text-danger">{value}</p>
    </div>
  );
}
