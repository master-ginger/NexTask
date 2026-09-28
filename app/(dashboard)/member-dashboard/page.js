"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.error("User not found");
        return;
      }

      const user = JSON.parse(storedUser);

      const res = await fetch(
        `/api/member-dashboard?userId=${user.id}`
      );

      const data = await res.json();

      if (data.success) {
        setDashboard(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!dashboard) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600";
      case "Medium":
        return "bg-amber-50 text-amber-700";
      case "Low":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTaskTypeStyle = (type) => {
    switch (type) {
      case "BUG":
        return "bg-red-50 text-red-600";
      case "FEATURE":
        return "bg-blue-50 text-blue-600";
      case "IMPROVEMENT":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-4 lg:px-7">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M3 12l9-8 9 8" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Dashboard
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Here's an overview of your tasks and upcoming work.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Tasks
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {dashboard.stats.totalTasks}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M8 9h8M8 13h8M8 17h5" />
              </svg>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Assigned to you
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {dashboard.stats.completedTasks}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              ✓
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Tasks successfully completed
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                In Progress
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {dashboard.stats.inProgressTasks}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              ◷
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Currently being worked on
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Task Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Task Distribution
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Breakdown by task type
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {dashboard.stats.totalTasks} total
              </span>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4">
            {dashboard.taskTypes.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No task data available.
              </div>
            ) : (
              dashboard.taskTypes.map((item) => {
                const total = dashboard.stats.totalTasks;

                const percentage =
                  total > 0
                    ? Math.round((item.count / total) * 100)
                    : 0;

                return (
                  <div key={item.type}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.type}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {item.count} · {percentage}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Today's Tasks
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Tasks that need to be completed today.
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {dashboard.todaysTasks.length} tasks
            </span>
          </div>

          {dashboard.todaysTasks.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center px-5 text-center">
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  ✓
                </div>

                <p className="text-sm font-medium text-slate-700">
                  No tasks due today
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  You're all caught up 🎉
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboard.todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {task.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {task.project.name}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getTaskTypeStyle(
                        task.taskType
                      )}`}
                    >
                      {task.taskType}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attention Section */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Overdue */}
        <div className="rounded-xl border border-red-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                !
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Overdue Tasks
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Tasks that need your attention.
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
              {dashboard.overdueTasks.length}
            </span>
          </div>

          {dashboard.overdueTasks.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No overdue tasks
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Great job staying on schedule 🎉
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboard.overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-5 py-3.5 transition hover:bg-red-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {task.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {task.project.name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                    <span>Due</span>
                    <span className="font-medium">
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approaching Deadlines */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                ◷
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Approaching Deadlines
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Tasks that need attention soon.
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {dashboard.upcomingTasks.length}
            </span>
          </div>

          {dashboard.upcomingTasks.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No upcoming deadlines
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Nothing urgent right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboard.upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-5 py-3.5 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {task.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {task.project.name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Due</span>
                    <span className="font-medium text-slate-700">
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}