"use client";

import { useState, type MouseEvent } from "react";

import type { LimitChart, LimitPoint } from "@/types/profile";

type LimitProfileChartProps = {
  title: string;
  subtitle: string;
  chart: LimitChart;
  expected: number;
  possible: number;
  currentLimit: number;
};

const W = 640;
const H = 300;
const PAD = { top: 20, right: 16, bottom: 48, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const KIB_PER_MB = 976.5625;

function stepPath(
  points: LimitPoint[],
  x: (value: number) => number,
  y: (value: number) => number,
  key: "min" | "median" | "max",
): string {
  if (points.length === 0) return "";
  let d = `M ${x(points[0].limit)} ${y(points[0][key])}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H ${x(points[i].limit)} V ${y(points[i][key])}`;
  }
  return d;
}

function bandPath(
  points: LimitPoint[],
  x: (value: number) => number,
  y: (value: number) => number,
): string {
  if (points.length === 0) return "";
  let d = `M ${x(points[0].limit)} ${y(points[0].max)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H ${x(points[i].limit)} V ${y(points[i].max)}`;
  }
  for (let i = points.length - 1; i >= 0; i--) {
    d += ` H ${x(points[i].limit)} V ${y(points[i].min)}`;
  }
  return `${d} Z`;
}

export default function LimitProfileChart({
  title,
  subtitle,
  chart,
  expected,
  possible,
  currentLimit,
}: LimitProfileChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isCpu = chart.unit === "ms";
  const maxX = chart.max || (isCpu ? 10_000 : 1_048_576);
  const maxY = Math.max(possible, 1);
  const x = (value: number) => PAD.left + (value / maxX) * PLOT_W;
  const y = (value: number) => PAD.top + PLOT_H - (value / maxY) * PLOT_H;

  // Task memory limits are configured in decimal megabytes and converted to
  // KiB by the backend, so keep the chart in the same unit.
  const formatX = (value: number) =>
    isCpu
      ? `${(value / 1000).toFixed(2)} s`
      : `${Math.round(value / KIB_PER_MB)} MB`;

  const xTicks = isCpu
    ? Array.from({ length: 11 }, (_, i) => i * 1000)
    : Array.from({ length: 9 }, (_, i) => i * 128 * KIB_PER_MB);

  const yStep = maxY <= 20 ? 5 : maxY <= 50 ? 10 : 25;
  const yTicks: number[] = [];
  for (let value = 0; value <= maxY; value += yStep) {
    yTicks.push(value);
  }
  if (yTicks[yTicks.length - 1] !== maxY) {
    yTicks.push(maxY);
  }

  const points = chart.points;
  const hasBand = points.some((point) => point.min !== point.max);
  const lower = chart.lower_bound;
  const upper = chart.upper_bound;
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  const handleMove = (event: MouseEvent<SVGSVGElement>) => {
    if (points.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const viewX = ((event.clientX - rect.left) / rect.width) * W;
    let index = 0;
    for (let i = 0; i < points.length; i++) {
      if (x(points[i].limit) <= viewX) {
        index = i;
      }
    }
    setHoverIndex(index);
  };

  return (
    <section className="flex flex-col gap-2 rounded-sm border border-divider bg-white p-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-default-600">{subtitle}</p>
      </div>

      {points.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-default-500">
          Dati vēl nav pieejami
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={title}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <title>{title}</title>

            {lower != null && (
              <rect
                x={x(lower)}
                y={PAD.top}
                width={Math.max(0, x(upper ?? maxX) - x(lower))}
                height={PLOT_H}
                fill="#16a34a"
                opacity={0.08}
              />
            )}

            {yTicks.map((value) => (
              <g key={`y-${value}`}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(value)}
                  y2={y(value)}
                  stroke="#e5e7eb"
                />
                <text
                  x={PAD.left - 8}
                  y={y(value) + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="#6b7280"
                >
                  {value}
                </text>
              </g>
            ))}

            {xTicks.map((value) => (
              <g key={`x-${value}`}>
                <line
                  x1={x(value)}
                  x2={x(value)}
                  y1={PAD.top}
                  y2={PAD.top + PLOT_H}
                  stroke="#f1f5f9"
                />
                <text
                  x={x(value)}
                  y={H - PAD.bottom + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6b7280"
                >
                  {formatX(value)}
                </text>
              </g>
            ))}

            {hasBand && (
              <path d={bandPath(points, x, y)} fill="#1d4ed8" opacity={0.1} />
            )}

            {expected > 0 && (
              <>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(expected)}
                  y2={y(expected)}
                  stroke="#b45309"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <text
                  x={W - PAD.right}
                  y={y(expected) - 6}
                  textAnchor="end"
                  fontSize={10}
                  fill="#b45309"
                >
                  gaidīti {expected} p
                </text>
              </>
            )}

            <path
              d={stepPath(points, x, y, "median")}
              fill="none"
              stroke="#1d4ed8"
              strokeWidth={2}
            />

            {lower != null && (
              <line
                x1={x(lower)}
                x2={x(lower)}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
                stroke="#16a34a"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            {upper != null && (
              <line
                x1={x(upper)}
                x2={x(upper)}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
                stroke="#16a34a"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}

            {currentLimit > 0 && currentLimit <= maxX && (
              <line
                x1={x(currentLimit)}
                x2={x(currentLimit)}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
                stroke="#0f62fe"
                strokeWidth={1.5}
                strokeDasharray="2 3"
              />
            )}

            {hovered && (
              <g>
                <line
                  x1={x(hovered.limit)}
                  x2={x(hovered.limit)}
                  y1={PAD.top}
                  y2={PAD.top + PLOT_H}
                  stroke="#111827"
                  opacity={0.25}
                />
                <circle
                  cx={x(hovered.limit)}
                  cy={y(hovered.median)}
                  r={3.5}
                  fill="#1d4ed8"
                />
                <rect
                  x={Math.min(Math.max(x(hovered.limit) + 6, PAD.left), W - PAD.right - 190)}
                  y={PAD.top}
                  width={190}
                  height={20}
                  fill="white"
                  opacity={0.9}
                  rx={3}
                />
                <text
                  x={Math.min(Math.max(x(hovered.limit) + 10, PAD.left + 4), W - PAD.right - 186)}
                  y={PAD.top + 14}
                  fontSize={11}
                  fill="#111827"
                >
                  {formatX(hovered.limit)} → {hovered.median} p ({hovered.min}–{hovered.max})
                </text>
              </g>
            )}
          </svg>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-default-600">
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-4 bg-blue-700" />
              vidējais rezultāts
            </span>
            {expected > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-4 border-t border-dashed border-amber-700" />
                gaidītie punkti
              </span>
            )}
            {hasBand && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 bg-blue-700/15" />
                mērījumu svārstības
              </span>
            )}
            {lower != null && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 bg-green-600/15" />
                drošais intervāls
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-4 border-t border-dotted border-blue-600" />
              pašreizējais limits
            </span>
          </div>

          <p className="text-xs text-default-700">
            {expected <= 0
              ? "Šim risinājumam nav norādīts sagaidāmais punktu skaits, tāpēc robežas netiek zīmētas."
              : lower != null
                ? `Gaidītie ${expected} punkti tiek sasniegti no ${formatX(lower)}${
                    upper != null ? ` līdz ${formatX(upper)}` : " līdz diagrammas beigām"
                  }.`
                : `Risinājums nesasniedz ${expected} punktus arī pie maksimālā limita.`}
          </p>
        </>
      )}
    </section>
  );
}
