import { create } from 'zustand';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  height?: number;
  weight?: number;
  notes?: string;
  created_at: string;
}

export interface ExamResult {
  examId: string;
  spl: number;
  aoe: number;
  vAP: number;
  vML: number;
  splSeries: { time: number; value: number }[];
  velocitySeries: { time: number; vAP: number; vML: number }[];
  copScatter: { x: number; y: number }[];
}

export interface CopSample {
  x: number;
  y: number;
  index: number;
  total: number;
}

export interface LiveMetrics {
  spl: number;
  aoe: number;
  vAP: number;
  vML: number;
  index: number;
}

export type ExamPhase =
  | 'idle'
  | 'stage1_ready'
  | 'stage1_running'
  | 'stage1_done'
  | 'stage2_running'
  | 'done';

interface ExamStore {
  patient: Patient | null;
  setPatient: (patient: Patient) => void;

  phase: ExamPhase;
  setPhase: (phase: ExamPhase) => void;

  stage1Result: ExamResult | null;
  stage2Result: ExamResult | null;
  setStageResult: (stage: 1 | 2, result: ExamResult) => void;

  currentSample: CopSample | null;
  liveSamples: { x: number; y: number }[];
  setSample: (sample: CopSample) => void;

  liveMetrics: LiveMetrics | null;
  liveSplSeries: { x: number; y: number }[];
  liveVelSeries: { x: number; vAP: number; vML: number }[];
  setLiveMetrics: (metrics: LiveMetrics) => void;

  error: string | null;
  setError: (error: string | null) => void;

  clearLive: () => void;
  reset: () => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  patient: null,
  setPatient: (patient) => set({ patient, phase: 'stage1_ready' }),

  phase: 'idle',
  setPhase: (phase) => set({ phase }),

  stage1Result: null,
  stage2Result: null,
  setStageResult: (stage, result) =>
    stage === 1
      ? set({ stage1Result: result, phase: 'stage1_done' })
      : set({ stage2Result: result, phase: 'done' }),

  currentSample: null,
  liveSamples: [],
  setSample: (sample) =>
    set((s) => ({
      currentSample: sample,
      liveSamples: [...s.liveSamples, { x: sample.x, y: sample.y }],
    })),

  liveMetrics: null,
  liveSplSeries: [],
  liveVelSeries: [],
  setLiveMetrics: (metrics) =>
    set((s) => ({
      liveMetrics: metrics,
      liveSplSeries: [...s.liveSplSeries, { x: metrics.index, y: metrics.spl }],
      liveVelSeries: [
        ...s.liveVelSeries,
        { x: metrics.index, vAP: metrics.vAP, vML: metrics.vML },
      ],
    })),

  error: null,
  setError: (error) => set({ error }),

  clearLive: () =>
    set({
      currentSample: null,
      liveSamples: [],
      liveMetrics: null,
      liveSplSeries: [],
      liveVelSeries: [],
    }),

  reset: () =>
    set({
      patient: null,
      phase: 'idle',
      stage1Result: null,
      stage2Result: null,
      currentSample: null,
      liveSamples: [],
      liveMetrics: null,
      liveSplSeries: [],
      liveVelSeries: [],
      error: null,
    }),
}));
