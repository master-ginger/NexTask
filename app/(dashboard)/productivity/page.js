"use client";

import { useEffect, useState } from "react";

export default function ProductivityPage() {
  const [productivity, setProductivity] = useState(null);

  useEffect(() => {
    fetchProductivity();
  }, []);

  const fetchProductivity = async () => {
    try {
      const res = await fetch("/api/productivity");
      const data = await res.json();

      if (data.success) {
        setProductivity(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!productivity) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading productivity analysis...
        </p>
      </div>
    );
  }

  const trend = productivity.completionTrend || [];

  const maxCompleted = Math.max(
    ...trend.map((item) => item.completed || 0),
    1
  );

  const totalCompleted = trend.reduce(
    (sum, item) => sum + (item.completed || 0),
    0
  );

  const formatDate = (date) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-full bg-slate-50 px-6 py-5 lg:px-7">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 16l3-4 3 2 5-7" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Productivity Analysis
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Team productivity, project performance and workload.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Productivity */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Productivity Score
              </p>

              <h2 className="mt-1.5 text-2xl font-bold text-slate-900">
                {productivity.stats.productivityScore}%
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              ✓
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-black"
              style={{
                width: `${Math.min(
                  productivity.stats.productivityScore,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Overall team performance
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Tasks Completed
              </p>

              <h2 className="mt-1.5 text-2xl font-bold text-slate-900">
                {productivity.stats.completedTasks}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              ✓
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Completed tasks across the team
          </p>
        </div>

        {/* Completion Time */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Avg. Completion Time
              </p>

              <h2 className="mt-1.5 text-2xl font-bold text-slate-900">
                {productivity.stats.averageCompletionTime}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              ◷
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Average time per completed task
          </p>
        </div>

        {/* Overdue */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Overdue Rate
              </p>

              <h2 className="mt-1.5 text-2xl font-bold text-red-500">
                {productivity.stats.overdueRate}%
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
              !
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Tasks that passed their deadline
          </p>
        </div>
      </div>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Productivity Trend */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Productivity Trend
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Tasks completed over the last 30 days
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              {totalCompleted} completed
            </div>
          </div>

          <div className="px-5 pb-4 pt-5">
            {/* Chart */}
            <div className="relative h-56">
              {/* Horizontal grid lines */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-slate-100"
                  />
                ))}
              </div>

              {/* Chart bars */}
              <div className="relative flex h-full items-end gap-[3px]">
                {trend.map((item, index) => {
                  const value = item.completed || 0;

                  const height =
                    maxCompleted === 0
                      ? 0
                      : (value / maxCompleted) * 100;

                  return (
                    <div
                      key={item.date}
                      className="group relative flex h-full flex-1 items-end"
                    >
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                        <p className="font-medium">
                          {formatDate(item.date)}
                        </p>

                        <p className="mt-0.5 text-slate-300">
                          {value} {value === 1 ? "task" : "tasks"} completed
                        </p>
                      </div>

                      {/* Bar */}
                      <div
                        className="w-full rounded-t-md bg-slate-900 transition-all duration-200 group-hover:bg-slate-700"
                        style={{
                          height: `${height}%`,
                          minHeight: value > 0 ? "4px" : "2px",
                        }}
                      />

                      {/* Date marker */}
                      {(index === 0 ||
                        index === trend.length - 1 ||
                        index % 5 === 0) && (
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400">
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom summary */}
            <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <span>
                Peak: {maxCompleted}{" "}
                {maxCompleted === 1 ? "task" : "tasks"}
              </span>

              <span>30-day activity</span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Top Performers
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Team highlights
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {productivity.topPerformers.map((performer, index) => (
              <div
                key={performer.id}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  {getInitials(performer.fullName)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {performer.fullName}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {performer.completedTasks} tasks completed
                  </p>
                </div>

                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white">
                  {index + 1}
                </div>
              </div>
            ))}

            {productivity.topPerformers.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No performer data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Performance */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Project Performance
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Compare productivity across projects.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Project
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Completion
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  On-time
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Overdue
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Health
                </th>
              </tr>
            </thead>

            <tbody>
              {productivity.projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-800">
                      {project.name}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex min-w-[180px] items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{
                            width: `${project.completion}%`,
                          }}
                        />
                      </div>

                      <span className="w-10 text-right text-xs font-semibold text-slate-600">
                        {project.completion}%
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {project.onTimeRate}%
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`text-sm font-medium ${
                        project.overdueTasks > 0
                          ? "text-red-500"
                          : "text-slate-600"
                      }`}
                    >
                      {project.overdueTasks}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        project.health === "Healthy"
                          ? "bg-emerald-50 text-emerald-700"
                          : project.health === "At Risk"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {project.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Analysis */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Member Analysis
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Individual productivity and workload analysis.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Member
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Completed
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  On-time
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Avg. Time
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Bugs Solved
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Active Tasks
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Burnout Risk
                </th>
              </tr>
            </thead>

            <tbody>
              {productivity.members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
                        {getInitials(member.fullName)}
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {member.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                    {member.completedTasks}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {member.onTimeRate}%
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {member.averageCompletionTime}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {member.bugsSolved}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {member.activeTasks}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        member.burnoutRisk === "Low"
                          ? "bg-emerald-50 text-emerald-700"
                          : member.burnoutRisk === "Moderate"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {member.burnoutRisk}
                    </span>
                  </td>
                </tr>
              ))}

              {productivity.members.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No member data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}