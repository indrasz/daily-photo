"use client";

import * as React from "react";
import {
  LineChart as ReLineChart,
  Line,
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Pt = { x: number; y: number };

type LineChartProps = {
  data?: Pt[];
  series?: { name: string; color: string; points: Pt[] }[];
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  xTicks?: number[];
  yTicks?: number[];
  height?: number;
  legend?: { name: string; color: string }[];
  accent?: string;
};

export function LineChart({
  data,
  series,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  height = 260,
  legend,
  accent = "#155DFC",
}: LineChartProps) {
  const allSeries = series ?? [{ name: "main", color: accent, points: data ?? [] }];

  const mergedData = React.useMemo(() => {
    const map = new Map<number, Record<string, number>>();
    for (const s of allSeries) {
      for (const p of s.points) {
        if (!map.has(p.x)) map.set(p.x, { x: p.x });
        map.get(p.x)![s.name] = p.y;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.x - b.x);
  }, [allSeries]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={mergedData} margin={{ top: 8, right: 16, bottom: 28, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="x"
            domain={xDomain ?? ["auto", "auto"]}
            ticks={xTicks}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -10, fontSize: 11, fill: "#6B7280" } : undefined}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />
          <YAxis
            domain={yDomain ?? ["auto", "auto"]}
            ticks={yTicks}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", dx: -8, fontSize: 11, fill: "#6B7280" } : undefined}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#9CA3AF"
            width={48}
          />
          <Tooltip />
          {allSeries.map((s) => (
            <Line
              key={s.name}
              type="linear"
              dataKey={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
      {legend && legend.length > 0 && (
        <div className="mt-2 flex justify-center gap-4 flex-wrap">
          {legend.map((l) => (
            <div key={l.name} className="flex items-center gap-1.5 text-sm">
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: l.color }}
              />
              <span style={{ color: l.color }}>{l.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
  xLabel,
  yLabel,
}: {
  active?: boolean;
  payload?: { payload: Pt }[];
  xLabel?: string;
  yLabel?: string;
}) {
  if (!active || !payload?.length) return null;
  const { x, y } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm text-gray-700 space-y-0.5">
      <p>{xLabel ?? "x"} : {x} cm</p>
      <p>{yLabel ?? "y"} : {y} cm</p>
    </div>
  );
}

export function ScatterChart({
  points,
  color = "#9333EA",
  xLabel,
  yLabel,
  xDomain = [-1, 1],
  yDomain = [-1, 1],
  xTicks,
  yTicks,
  height = 300,
  legend,
}: {
  points: Pt[];
  color?: string;
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  xTicks?: number[];
  yTicks?: number[];
  height?: number;
  legend?: string;
}) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReScatterChart margin={{ top: 8, right: 16, bottom: 28, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            ticks={xTicks}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -10, fontSize: 11, fill: "#6B7280" } : undefined}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={yDomain}
            ticks={yTicks}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", dx: -8, fontSize: 11, fill: "#6B7280" } : undefined}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#9CA3AF"
            width={48}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<ScatterTooltip xLabel={xLabel} yLabel={yLabel} />}
          />
          <Scatter name={legend ?? "data"} data={points} fill={color} opacity={0.7} />
        </ReScatterChart>
      </ResponsiveContainer>
      {legend && (
        <div className="mt-2 flex justify-center text-sm">
          <span className="inline-flex items-center gap-1.5" style={{ color }}>
            <span
              aria-hidden
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: color }}
            />
            {legend}
          </span>
        </div>
      )}
    </div>
  );
}
