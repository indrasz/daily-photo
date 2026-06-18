"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { LineChart, ScatterChart } from "@/components/charts";
import {
  EyeIcon,
  CheckCircleFillIcon,
  AlertTriangleIcon,
} from "@/components/icons";
import { useExamStore, type ExamResult } from "@/lib/store";
import { useExam } from "@/hooks/useExam";

export default function AnalyticPage() {
  const router = useRouter();

  const patient       = useExamStore(s => s.patient);
  const phase         = useExamStore(s => s.phase);
  const stage1Result  = useExamStore(s => s.stage1Result);
  const stage2Result  = useExamStore(s => s.stage2Result);
  const liveSamples   = useExamStore(s => s.liveSamples);
  const liveSplSeries = useExamStore(s => s.liveSplSeries);
  const liveVelSeries = useExamStore(s => s.liveVelSeries);
  const liveMetrics   = useExamStore(s => s.liveMetrics);
  const currentSample = useExamStore(s => s.currentSample);
  const error         = useExamStore(s => s.error);
  const setPhase      = useExamStore(s => s.setPhase);
  const setError      = useExamStore(s => s.setError);
  const reset         = useExamStore(s => s.reset);

  const { startExam, stopExam } = useExam();

  useEffect(() => {
    if (phase === "idle" || !patient) router.replace("/form");
  }, [phase, patient, router]);

  const isDone    = phase === "done";
  const isRunning = phase === "stage1_running" || phase === "stage2_running";

  const sampleIndex = currentSample?.index ?? 0;
  const sampleTotal = currentSample?.total ?? 30;

  const activeStage = phase === "stage2_running" ? 2 : 1;

  // Result to display in charts when not running
  const activeResult: ExamResult | null = isDone
    ? (stage2Result ?? stage1Result)
    : stage1Result;

  // --- Chart data ---
  const splData = useMemo(() => {
    if (isRunning) return liveSplSeries;
    if (activeResult) return activeResult.splSeries.map(s => ({ x: s.time, y: s.value }));
    return [];
  }, [isRunning, liveSplSeries, activeResult]);

  const copPoints = useMemo(() => {
    if (isRunning) return liveSamples;
    if (activeResult) return activeResult.copScatter;
    return [];
  }, [isRunning, liveSamples, activeResult]);

  const velAP = useMemo(() => {
    if (isRunning) return liveVelSeries.map(v => ({ x: v.x, y: v.vAP }));
    if (activeResult) return activeResult.velocitySeries.map(v => ({ x: v.time, y: v.vAP }));
    return [];
  }, [isRunning, liveVelSeries, activeResult]);

  const velML = useMemo(() => {
    if (isRunning) return liveVelSeries.map(v => ({ x: v.x, y: v.vML }));
    if (activeResult) return activeResult.velocitySeries.map(v => ({ x: v.time, y: v.vML }));
    return [];
  }, [isRunning, liveVelSeries, activeResult]);

  // --- Scatter domain from actual data ---
  const scatterDomain = useMemo(() => {
    if (!copPoints.length) {
      return { xDomain: [0, 50] as [number, number], yDomain: [-15, 15] as [number, number] };
    }
    const xs = copPoints.map(p => p.x);
    const ys = copPoints.map(p => p.y);
    const xPad = Math.max((Math.max(...xs) - Math.min(...xs)) * 0.3, 3);
    const yPad = Math.max((Math.max(...ys) - Math.min(...ys)) * 0.3, 3);
    return {
      xDomain: [Math.floor(Math.min(...xs) - xPad), Math.ceil(Math.max(...xs) + xPad)] as [number, number],
      yDomain: [Math.floor(Math.min(...ys) - yPad), Math.ceil(Math.max(...ys) + yPad)] as [number, number],
    };
  }, [copPoints]);

  // --- Overall progress ---
  const overallPct =
    isDone                       ? 100
    : phase === "stage1_done"    ? 50
    : phase === "stage2_running" ? 50 + Math.round((sampleIndex / sampleTotal) * 50)
    : phase === "stage1_running" ? Math.round((sampleIndex / sampleTotal) * 50)
    : 0;

  // --- Stage statuses ---
  const stage1Status: "active" | "pending" | "done" =
    phase === "stage1_done" || phase === "stage2_running" || isDone ? "done" : "active";

  // --- Live metric display values ---
  const splNow = liveMetrics?.spl ?? 0;
  const aoeNow = liveMetrics?.aoe ?? 0;
  const vAPNow = liveMetrics?.vAP ?? 0;
  const vMLNow = liveMetrics?.vML ?? 0;

  // --- Summary averages for Kesimpulan ---
  const avg = useMemo(() => {
    if (!stage1Result) return null;
    const r1 = stage1Result;
    const r2 = stage2Result;
    return {
      spl: r2 ? ((r1.spl + r2.spl) / 2).toFixed(2) : r1.spl.toFixed(2),
      aoe: r2 ? ((r1.aoe + r2.aoe) / 2).toFixed(4) : r1.aoe.toFixed(4),
      vel: r2
        ? ((r1.vAP + r2.vAP + r1.vML + r2.vML) / 4).toFixed(3)
        : ((r1.vAP + r1.vML) / 2).toFixed(3),
    };
  }, [stage1Result, stage2Result]);

  // --- Action button ---
  function handleAction() {
    if (!patient) return;
    if (phase === "stage1_ready")   { startExam(patient.id, 1); }
    else if (phase === "stage1_done")    { startExam(patient.id, 2); }
    else if (phase === "stage1_running") { stopExam(); setPhase("stage1_ready"); setError(null); }
    else if (phase === "stage2_running") { stopExam(); setPhase("stage1_done");  setError(null); }
    else if (isDone)                     { reset(); router.push("/form"); }
  }

  const buttonLabel =
    phase === "stage1_ready"   ? "Mulai Tahap 1"
    : phase === "stage1_running" ? "Hentikan Pemeriksaan"
    : phase === "stage1_done"    ? "Mulai Tahap 2"
    : phase === "stage2_running" ? "Hentikan Pemeriksaan"
    : "Mulai Pemeriksaan Baru";

  const buttonCls = isRunning
    ? "bg-danger text-white hover:bg-red-700"
    : isDone
    ? "bg-white border border-brand-300 text-brand-700 hover:bg-brand-50"
    : "bg-brand-600 text-white hover:bg-brand-700";

  // Status box
  const statusLabel =
    isRunning ? `${sampleIndex} / ${sampleTotal} sampel`
    : phase === "stage1_done" ? "Tahap 1 Selesai"
    : isDone ? "Selesai"
    : "Siap";
  const statusTone: "brand" | "warning" | "success" =
    isRunning ? "warning" : isDone ? "success" : "brand";

  if (!patient) return null;

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header
        title={isDone ? "Pemeriksaan Selesai" : "Pemeriksaan Berlangsung"}
        subtitle={`Pasien: ${patient.name}`}
        right={
          <div className="hidden md:flex gap-3 items-center">
            <StatusBox
              label={isRunning ? `Tahap ${activeStage}` : "Status"}
              value={statusLabel}
              tone={statusTone}
            />
            <button
              onClick={handleAction}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${buttonCls}`}
            >
              {buttonLabel}
            </button>
          </div>
        }
      />

      {error && (
        <div className="mx-auto max-w-[1024px] px-4 sm:px-6 pt-4 w-full">
          <div className="rounded-lg border border-danger/40 bg-red-50 px-4 py-3 text-sm text-danger flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

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
                    metrics={stage1Result}
                    icon={<EyeIcon className="w-5 h-5" />}
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
                    sampleIndex={phase === "stage1_running" ? sampleIndex : undefined}
                    sampleTotal={phase === "stage1_running" ? sampleTotal : undefined}
                  />
                </>
              )}

              <div className="mt-4 rounded-[10px] border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm text-ink-slate">
                  <span className="font-bold">Progress Keseluruhan:</span>{" "}
                  {isDone ? "Selesai" : "Tahap 1"}
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted">Progress keseluruhan: {overallPct}%</p>
              </div>

              {/* Mobile action button */}
              <button
                onClick={handleAction}
                className={`mt-4 md:hidden w-full rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${buttonCls}`}
              >
                {buttonLabel}
              </button>
            </section>

            {/* SPL Chart */}
            <section className="rounded-[14px] border border-brand-200 bg-white shadow-card p-6">
              <h2 className="text-lg font-medium text-ink-deep mb-4">
                Grafik 1: Sway Path Length (SPL)
              </h2>
              <LineChart
                data={splData}
                xLabel="Waktu (detik)"
                yLabel="SPL (cm)"
                accent="#155DFC"
                legend={[{ name: "Sway Path Length", color: "#155DFC" }]}
              />
              <div className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
                SPL Saat Ini:{" "}
                {isRunning
                  ? splNow.toFixed(2)
                  : activeResult
                  ? activeResult.spl.toFixed(2)
                  : "—"}{" "}
                cm
              </div>
            </section>

            {/* Hasil Tahap — desktop only */}
            {isDone && (
              <section className="hidden lg:block rounded-[14px] border border-warning-500/40 bg-white p-6">
                <h2 className="text-lg font-medium text-warning-900 mb-4">
                  Hasil Tahap yang Telah Selesai
                </h2>
                <div className="flex flex-col gap-4">
                  <CompletedStage
                    title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                    metrics={stage1Result}
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
                points={copPoints}
                xLabel="ML CoP (cm)"
                yLabel="AP CoP (cm)"
                xDomain={scatterDomain.xDomain}
                yDomain={scatterDomain.yDomain}
                legend="Center of Pressure"
              />
              <div className="mt-4 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-500">
                AoE Saat Ini:{" "}
                {isRunning
                  ? aoeNow.toFixed(4)
                  : activeResult
                  ? activeResult.aoe.toFixed(4)
                  : "—"}{" "}
                cm²
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
                legend={[
                  { name: "V-AP", color: "#155DFC" },
                  { name: "V-ML", color: "#F59E0B" },
                ]}
              />
              <div className="mt-4 rounded-lg bg-success-50 px-3 py-2 text-sm text-success-600 flex flex-wrap justify-between gap-2">
                <span>
                  V-AP:{" "}
                  {isRunning
                    ? vAPNow.toFixed(3)
                    : activeResult
                    ? activeResult.vAP.toFixed(3)
                    : "—"}{" "}
                  cm/s
                </span>
                <span>
                  V-ML:{" "}
                  {isRunning
                    ? vMLNow.toFixed(3)
                    : activeResult
                    ? activeResult.vML.toFixed(3)
                    : "—"}{" "}
                  cm/s
                </span>
              </div>
            </section>

            {/* Kesimpulan — desktop only */}
            {isDone && avg && (
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
                <button
                  onClick={handleAction}
                  className={`mt-6 w-full rounded-lg text-sm font-medium py-2.5 transition-colors ${buttonCls}`}
                >
                  {buttonLabel}
                </button>
              </section>
            )}
          </div>
        </div>

        {/* Mobile-only: result + kesimpulan */}
        {isDone && (
          <div className="lg:hidden mx-auto max-w-[1024px] px-4 sm:px-6 pb-8 flex flex-col gap-6">
            <section className="rounded-[14px] border border-warning-500/40 bg-white p-6">
              <h2 className="text-lg font-medium text-warning-900 mb-4">
                Hasil Tahap yang Telah Selesai
              </h2>
              <div className="flex flex-col gap-4">
                <CompletedStage
                  title="Tahap 1: Berdiri dengan 2 Kaki Mata Terbuka"
                  metrics={stage1Result}
                />
              </div>
            </section>

            {avg && (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "warning" | "success";
}) {
  const cls =
    tone === "brand"
      ? "bg-brand-50 border-brand-600 text-ink-deep"
      : tone === "warning"
      ? "bg-warning-50 border-warning-600 text-warning-900"
      : "bg-success-50 border-success-500 text-success-900";
  return (
    <div className={`rounded-[10px] border ${cls} px-5 py-3 flex flex-col leading-tight`}>
      <span className="text-xs uppercase tracking-wider text-ink-muted">{label}</span>
      <span className="text-base font-medium tabular-nums">{value}</span>
    </div>
  );
}

function StageCard({
  status,
  title,
  description,
  icon,
  sampleIndex,
  sampleTotal,
}: {
  status: "active" | "pending" | "done";
  title: string;
  description: string;
  icon: React.ReactNode;
  sampleIndex?: number;
  sampleTotal?: number;
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
        {isActive && sampleIndex !== undefined && sampleTotal !== undefined ? (
          <div className="mt-2">
            <div className="h-1 rounded-full bg-white overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all"
                style={{ width: `${Math.round((sampleIndex / sampleTotal) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-ink-subtle">{sampleIndex} / {sampleTotal} sampel</p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink-subtle">Durasi: 30 sampel</p>
        )}
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
  metrics: ExamResult | null;
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
          <p className="mt-2 text-xs text-ink-subtle">Durasi: 30 sampel</p>
        </div>
      </div>
      {metrics && (
        <div className="mt-3 rounded-lg bg-white/70 border border-black/5 p-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-slate">
          <span>SPL: {metrics.spl.toFixed(2)} cm</span>
          <span>AoE: {metrics.aoe.toFixed(4)} cm²</span>
          <span>Avg Velocity (AP): {metrics.vAP.toFixed(3)} cm/s</span>
          <span>Avg Velocity (ML): {metrics.vML.toFixed(3)} cm/s</span>
        </div>
      )}
    </div>
  );
}

function CompletedStage({ title, metrics }: { title: string; metrics: ExamResult | null }) {
  return (
    <div className="rounded-[10px] bg-warning-50 border border-warning-500/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-medium text-ink-deep">{title}</h3>
        <CheckCircleFillIcon className="w-5 h-5 text-warning-600" />
      </div>
      {metrics && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-slate">
          <span>SPL: {metrics.spl.toFixed(2)} cm</span>
          <span>AoE: {metrics.aoe.toFixed(4)} cm²</span>
          <span>Avg Velocity (AP): {metrics.vAP.toFixed(3)} cm/s</span>
          <span>Avg Velocity (ML): {metrics.vML.toFixed(3)} cm/s</span>
        </div>
      )}
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
