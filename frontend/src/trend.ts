import { html, nothing, svg } from "lit";
import { finite } from "./discovery";
import type { HomeAssistant } from "./types";
export interface Point {
  t: number;
  mean: number;
  min: number;
  max: number;
}
export const TREND_HOURS = 24;
// Hourly recorder statistics keep the trend smooth and cheap to fetch.
export async function fetchTrend(hass: HomeAssistant, id: string, now = Date.now()): Promise<Point[]> {
  if (!hass.callWS) return [];
  const result = await hass.callWS<
    Record<string, { start: number | string; mean?: unknown; min?: unknown; max?: unknown }[]>
  >({
    type: "recorder/statistics_during_period",
    start_time: new Date(now - TREND_HOURS * 3_600_000).toISOString(),
    statistic_ids: [id],
    period: "hour",
    types: ["mean", "min", "max"],
  });
  return (result?.[id] ?? []).flatMap((row) => {
    const t = typeof row.start === "number" ? row.start : Date.parse(row.start);
    const mean = finite(row.mean);
    if (!Number.isFinite(t) || mean === undefined) return [];
    return [{ t, mean, min: finite(row.min) ?? mean, max: finite(row.max) ?? mean }];
  });
}
const W = 300;
const H = 96;
// Monotone-ish smoothing: horizontal control points never overshoot in time.
function smooth(points: [number, number][]): string {
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const [px, py] = points[i - 1]!;
      const dx = (x - px) / 2;
      return `C${(px + dx).toFixed(1)},${py.toFixed(1)} ${(x - dx).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join("");
}
export function trendChart(points: Point[], unit: string, threshold: number | undefined, locale?: string) {
  if (points.length < 2) return nothing;
  const t0 = points[0]!.t;
  const span = Math.max(1, points[points.length - 1]!.t - t0);
  const top = Math.max(...points.map((p) => p.max), threshold ?? 0) * 1.1 || 1;
  const x = (t: number) => ((t - t0) / span) * W;
  const y = (v: number) => H - (Math.max(0, v) / top) * H;
  const line = points.map((p) => [x(p.t), y(p.mean)] as [number, number]);
  const upper = points.map((p) => [x(p.t), y(p.max)] as [number, number]);
  const lower = points.map((p) => [x(p.t), y(p.min)] as [number, number]).reverse();
  const range = `${smooth(upper)}L${smooth(lower).slice(1)}Z`;
  const area = `${smooth(line)}L${W},${H}L0,${H}Z`;
  const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
  const peak = Math.max(...points.map((p) => p.max));
  const average = points.reduce((sum, p) => sum + p.mean, 0) / points.length;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  return html`<figure class="trend">
    <figcaption>
      <span class="metric-label">PM2.5 · last ${TREND_HOURS} hours</span>
      <span class="secondary">Avg ${number.format(average)} · Peak ${number.format(peak)} ${unit}</span>
    </figcaption>
    <svg
      viewBox="0 0 ${W} ${H}"
      preserveAspectRatio="none"
      role="img"
      aria-label=${`PM2.5 over the last ${TREND_HOURS} hours, average ${number.format(average)}, peak ${number.format(peak)} ${unit}`}
    >
      ${svg`<defs><linearGradient id="pap-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0.28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
      <path class="trend-range" d=${range}/>
      <path class="trend-area" d=${area} fill="url(#pap-fill)"/>
      ${threshold !== undefined && threshold < top ? svg`<line class="trend-threshold" x1="0" x2=${W} y1=${y(threshold)} y2=${y(threshold)}/>` : nothing}
      <path class="trend-line" d=${smooth(line)}/>
      <path class="trend-dot" d=${`M${x(points[points.length - 1]!.t)},${y(points[points.length - 1]!.mean)}h0`}/>`}
    </svg>
    <div class="trend-axis secondary"><span>${time.format(t0)}</span><span>Now</span></div>
  </figure>`;
}
