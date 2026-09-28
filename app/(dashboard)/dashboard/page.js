"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      if (data.success) {
        setDashboard(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-[#f7f7f8] p-6">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    );
  }

  const stats = [
    {
      label: "Projects",
      value: dashboard.stats.totalProjects,
      icon: "📁",
      description: "Active projects",
    },
    {
      label: "Tasks",
      value: dashboard.stats.totalTasks,
      icon: "✓",
      description: "Total assigned",
    },
    {
      label: "Completed",
      value: dashboard.stats.completedTasks,
      icon: "✓",
      description: "Tasks completed",
      valueClass: "text-emerald-600",
    },
    {
      label: "Overdue",
      value: dashboard.stats.overdueTasks,
      icon: "!",
      description: "Need attention",
      valueClass:
        dashboard.stats.overdueTasks > 0
          ? "text-red-500"
          : "text-slate-900",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f8] ">
      {/* Header */}
      <div className=" flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            A quick overview of your projects and team activity.
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Overview
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            Last 30 days
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>

                <h2
                  className={`mt-2 text-3xl font-bold tracking-tight ${
                    stat.valueClass || "text-slate-900"
                  }`}
                >
                  {stat.value}
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                {stat.icon}
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left / Main Content */}
        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* Active Projects */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Active Projects
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Current project progress
                </p>
              </div>

              <button className="text-xs font-semibold text-slate-600 transition hover:text-black">
                View all →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboard.projects.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                  No active projects.
                </div>
              ) : (
                dashboard.projects.map((project) => (
                  <div
                    key={project.id}
                    className="px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {project.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {project.members}{" "}
                          {project.members === 1 ? "Member" : "Members"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-slate-700">
                          {project.progress}%
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Due{" "}
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-black transition-all"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Completion Trend */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Task Completion Trend
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Tasks completed over the last 30 days
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Completed
                </p>

                <p className="text-sm font-bold text-slate-900">
                  {dashboard.stats.completedTasks}
                </p>
              </div>
            </div>

            <div className="h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboard.completionTrend}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#111827"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-5">
          {/* Top Performers */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Top Performers
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Based on completed tasks
              </p>
            </div>

            <div className="p-2">
              {dashboard.topPerformers.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-400">
                  No performance data available.
                </p>
              ) : (
                dashboard.topPerformers.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-slate-50"
                  >
                    {/* Rank */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      {member.fullName
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {member.fullName}
                      </p>

                      <p className="text-xs text-slate-400">
                        {member.completedTasks} tasks completed
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      #{index + 1}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* High Priority Tasks */}
          <section className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    High Priority
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Pending tasks requiring attention
                  </p>
                </div>

                {dashboard.highPriorityTasks.length > 0 && (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-500">
                    {dashboard.highPriorityTasks.length}
                  </span>
                )}
              </div>
            </div>

            <div className="p-2">
              {dashboard.highPriorityTasks.length === 0 ? (
                <div className="px-3 py-10 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-600">
                    ✓
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    All clear
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    No pending high priority tasks.
                  </p>
                </div>
              ) : (
                dashboard.highPriorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg px-3 py-3 transition hover:bg-slate-50"
                  >
                    <div className="flex gap-3">
                      {/* Priority indicator */}
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {task.title}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-400">
                          <span>{task.project.name}</span>
                          <span>•</span>
                          <span>{task.assignee.fullName}</span>
                        </div>

                        <p className="mt-1.5 text-[11px] font-medium text-red-500">
                          Due{" "}
                          {new Date(
                            task.deadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}