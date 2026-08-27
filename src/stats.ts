import type { Assignment, Stats, VarianceResult } from "./types.js";

export function computeVariance(a: Assignment): VarianceResult {
  const delta = a.actualMinutes - a.expectedMinutes;
  const ratio = a.expectedMinutes > 0 ? a.actualMinutes / a.expectedMinutes : 0;
  return {
    assignmentId: a.id,
    expectedMinutes: a.expectedMinutes,
    actualMinutes: a.actualMinutes,
    deltaMinutes: delta,
    ratio,
  };
}

export function computeStats(completed: Assignment[]): Stats {
  if (completed.length === 0) {
    return { completedCount: 0, averageDeltaMinutes: 0, averageRatio: 0, onTimeRate: 0 };
  }

  const variances = completed.map(computeVariance);
  const totalDelta = variances.reduce((sum, v) => sum + v.deltaMinutes, 0);
  const totalRatio = variances.reduce((sum, v) => sum + v.ratio, 0);
  const onTime = variances.filter((v) => Math.abs(v.ratio - 1) <= 0.1).length;

  return {
    completedCount: completed.length,
    averageDeltaMinutes: totalDelta / completed.length,
    averageRatio: totalRatio / completed.length,
    onTimeRate: onTime / completed.length,
  };
}

export function formatMinutes(mins: number): string {
  const sign = mins < 0 ? "-" : "";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = Math.round(abs % 60);
  if (h > 0) return `${sign}${h}h ${m}m`;
  return `${sign}${m}m`;
}
