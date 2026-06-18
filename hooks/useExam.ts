'use client';
import { useEffect, useCallback, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { useExamStore, type ExamPhase, type ExamResult } from '@/lib/store';

export function useExam() {
  const setPhase       = useExamStore(s => s.setPhase);
  const setSample      = useExamStore(s => s.setSample);
  const setLiveMetrics = useExamStore(s => s.setLiveMetrics);
  const setError       = useExamStore(s => s.setError);
  const setStageResult = useExamStore(s => s.setStageResult);
  const clearLive      = useExamStore(s => s.clearLive);
  const phase          = useExamStore(s => s.phase);

  const phaseRef = useRef<ExamPhase>(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const onStarted = () => {
      if (phaseRef.current === 'stage1_ready') setPhase('stage1_running');
      else if (phaseRef.current === 'stage1_done') setPhase('stage2_running');
    };

    const onComplete = (data: ExamResult) => {
      if (phaseRef.current === 'stage1_running') setStageResult(1, data);
      else if (phaseRef.current === 'stage2_running') setStageResult(2, data);
    };

    const onError = (data: { message: string }) => {
      setError(data.message);
      if (phaseRef.current === 'stage1_running') setPhase('stage1_ready');
      else if (phaseRef.current === 'stage2_running') setPhase('stage1_done');
    };

    socket.on('exam_started', onStarted);
    socket.on('cop_sample', setSample);
    socket.on('metrics_update', setLiveMetrics);
    socket.on('exam_complete', onComplete);
    socket.on('exam_error', onError);

    return () => {
      socket.off('exam_started', onStarted);
      socket.off('cop_sample', setSample);
      socket.off('metrics_update', setLiveMetrics);
      socket.off('exam_complete', onComplete);
      socket.off('exam_error', onError);
    };
  }, [setPhase, setSample, setLiveMetrics, setError, setStageResult]);

  const startExam = useCallback((patientId: string, stage: 1 | 2) => {
    clearLive();
    getSocket().emit('start_exam', { patientId, stage });
  }, [clearLive]);

  const stopExam = useCallback(() => {
    getSocket().emit('stop_exam', {});
  }, []);

  return { startExam, stopExam };
}
