"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import type { LimitChart, LimitPoint, ViableBounds } from "@/types/profile";

type LimitProfileChartProps = {
  title: string;
  subtitle: string;
  chart: LimitChart;
  expected: number;
  possible: number;
  currentLimit: number;
  viable?: ViableBounds;
};

const H = 300;
const PAD = { top: 20, right: 16, bottom: 48, left: 56 };
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

function niceStep(max: number, targetCount: number): number {
  const raw = max / targetCount;
  const power = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / power;
  const multiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return multiplier * power;
}

function makeTicks(max: number, targetCount: number): number[] {
  if (max <= 0) return [0];
  const step = niceStep(max, targetCount);
  const ticks: number[] = [];
  for (let value = 0; value < max - step * 0.001; value += step) {
    ticks.push(value);
  }
  const last = ticks[ticks.length - 1];
  if (last != null && max - last < step * 0.6) {
    // Replace the last round tick with the exact edge instead of drawing two
    // labels a few pixels apart.
    ticks[ticks.length - 1] = max;
  } else {
    ticks.push(max);
  }
  return ticks;
}

export default function LimitProfileChart({
  title,
  subtitle,
  chart,
  expected,
  possible,
  currentLimit,
  viable,
}: LimitProfileChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const update = () => setWidth(Math.max(320, element.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isCpu = chart.unit === "ms";
  const maxX = chart.max || (isCpu ? 10_000 : 1_048_576);
  const maxY = Math.max(possible, 1);
  const points = chart.points;

  // Shrink the axis to the interesting part of the curve. Include the current
  // task limit so its marker stays visible even when the curve saturates early.
  const reachedMax = points.find((point) => point.max >= possible)?.limit ?? null;
  const lastDataPoint = points.reduce(
    (acc, point) => (point.limit < maxX ? Math.max(acc, point.limit) : acc),
    0,
  );
  const focusEnd = reachedMax ?? lastDataPoint;
  const minVisible = isCpu ? 1_000 : 128 * KIB_PER_MB;
  const focusWithMargin = focusEnd > 0 ? focusEnd * 1.15 : minVisible;
  const currentWithMargin =
    currentLimit > 0 && currentLimit <= maxX ? currentLimit * 1.05 : 0;
  const visibleMax = Math.min(
    maxX,
    Math.max(minVisible, focusWithMargin, currentWithMargin),
  );

  // Extend the last step to the right edge when the axis is clipped early.
  let chartPoints = points.filter((point) => point.limit <= visibleMax);
  if (chartPoints.length > 0 && chartPoints[chartPoints.length - 1].limit < visibleMax) {
    chartPoints = [
      ...chartPoints,
      { ...chartPoints[chartPoints.length - 1], limit: visibleMax },
    ];
  }

  const W = width;
  const plotW = W - PAD.left - PAD.right;
  const x = (value: number) => PAD.left + (value / visibleMax) * plotW;
  const y = (value: number) => PAD.top + PLOT_H - (value / maxY) * PLOT_H;

  const formatX = (value: number) =>
    isCpu
      ? `${(value / 1000).toFixed(2)} s`
      : `${Math.round(value / KIB_PER_MB)} MB`;

  const xTicks = isCpu
    ? makeTicks(visibleMax, 6)
    : makeTicks(visibleMax / KIB_PER_MB, 6).map((mb) => mb * KIB_PER_MB);

  const yStep = maxY <= 20 ? 5 : maxY <= 50 ? 10 : 25;
  const yTicks: number[] = [];
  for (let value = 0; value <= maxY; value += yStep) {
    yTicks.push(value);
  }
  if (yTicks[yTicks.length - 1] !== maxY) {
    yTicks.push(maxY);
  }

  const hasBand = chartPoints.some((point) => point.min !== point.max);
  const lower =
    viable == null
      ? chart.lower_bound
      : viable.lower_kind === "finite"
        ? viable.lower
        : null;
  const upper =
    viable == null
      ? chart.upper_bound
      : viable.upper_kind === "finite"
        ? viable.upper
        : null;
  const hovered =
    hoverIndex !== null && hoverIndex < chartPoints.length
      ? chartPoints[hoverIndex]
      : null;

  const handleMove = (event: MouseEvent<SVGSVGElement>) => {
    if (chartPoints.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const viewX = ((event.clientX - rect.left) / rect.width) * W;
    let index = 0;
    for (let i = 0; i < chartPoints.length; i++) {
      if (x(chartPoints[i].limit) <= viewX) {
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
          <div ref={containerRef} className="w-full">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label={title}
              onMouseMove={handleMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <title>{title}</title>

              {lower != null && lower <= visibleMax && (
                <rect
                  x={x(lower)}
                  y={PAD.top}
                  width={Math.max(
                    0,
                    x(Math.min(upper ?? visibleMax, visibleMax)) - x(lower),
                  )}
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
                    fontSize={12}
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
                    y={H - PAD.bottom + 17}
                    textAnchor={
                      value === 0
                        ? "start"
                        : value >= visibleMax * 0.999
                          ? "end"
                          : "middle"
                    }
                    fontSize={11}
                    fill="#6b7280"
                  >
                    {formatX(value)}
                  </text>
                </g>
              ))}

              {hasBand && (
                <path d={bandPath(chartPoints, x, y)} fill="#1d4ed8" opacity={0.1} />
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
                    y={y(expected) - 7}
                    textAnchor="end"
                    fontSize={11}
                    fill="#b45309"
                  >
                    gaidīti {expected} p
                  </text>
                </>
              )}

              <path
                d={stepPath(chartPoints, x, y, "median")}
                fill="none"
                stroke="#1d4ed8"
                strokeWidth={2}
              />

              {lower != null && lower <= visibleMax && (
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
              {upper != null && upper <= visibleMax && (
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

              {currentLimit > 0 && currentLimit <= visibleMax && (
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
                    r={4}
                    fill="#1d4ed8"
                  />
                  <rect
                    x={Math.min(
                      Math.max(x(hovered.limit) + 8, PAD.left),
                      Math.max(PAD.left, W - PAD.right - 240),
                    )}
                    y={PAD.top}
                    width={240}
                    height={26}
                    fill="white"
                    opacity={0.94}
                    rx={4}
                    stroke="#e5e7eb"
                  />
                  <text
                    x={Math.min(
                      Math.max(x(hovered.limit) + 14, PAD.left + 6),
                      Math.max(PAD.left + 6, W - PAD.right - 234),
                    )}
                    y={PAD.top + 18}
                    fontSize={13}
                    fontWeight={500}
                    fill="#111827"
                  >
                    {formatX(hovered.limit)} → {hovered.median} p ({hovered.min}–
                    {hovered.max})
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-default-600">
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
            {expected <= 0 || (viable != null && viable.lower_kind === "none")
              ? "Šim risinājumam nav norādīts sagaidāmais punktu skaits, tāpēc robežas netiek zīmētas."
              : lower != null
                ? `Gaidītie ${expected} punkti tiek sasniegti no ${formatX(lower)}${
                    upper != null
                      ? ` līdz ${formatX(upper)}`
                      : viable?.upper_kind === "open"
                        ? " bez augšējās robežas"
                        : viable?.upper_kind === "unknown"
                          ? "; augšējā robeža nav zināma"
                          : " līdz diagrammas beigām"
                  }.`
                : `Risinājums nesasniedz gaidītos ${expected} punktus pat pie maksimālā profila limita.`}
          </p>
        </>
      )}
    </section>
  );
}
