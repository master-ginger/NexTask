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
      <main className="min-h-screen bg-gray-100 p-8">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back! Here's an overview of your projects.
        </p>

      </div>


      {/* Stats */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Projects
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.stats.totalProjects}
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.stats.totalTasks}
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {dashboard.stats.completedTasks}
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Overdue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {dashboard.stats.overdueTasks}
          </h2>
        </div>

      </div>


      {/* Main Dashboard */}

      <div className="grid grid-cols-3 gap-6 items-stretch">

        {/* LEFT SIDE */}

        <div className="col-span-2 flex flex-col gap-6">

          {/* Active Projects */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold">
                Active Projects
              </h2>

              <button className="text-sm font-medium">
                View All
              </button>

            </div>


            <div className="space-y-5">

              {dashboard.projects.map((project) => (

                <div
                  key={project.id}
                  className="rounded-xl border p-5 hover:border-black transition"
                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-semibold text-lg">
                        {project.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {project.members} Members
                      </p>

                    </div>

                    <span className="text-sm text-slate-500">
                      {new Date(
                        project.deadline
                      ).toLocaleDateString()}
                    </span>

                  </div>


                  <div className="mt-4 h-2 rounded-full bg-gray-200">

                    <div
                      className="h-2 rounded-full bg-black"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />

                  </div>


                  <p className="mt-2 text-sm text-slate-500">
                    {project.progress}% Completed
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* Completion Trend */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                Task Completion Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Tasks completed over the last 30 days
              </p>

            </div>


            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={dashboard.completionTrend}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="completed"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex flex-col gap-6">

          {/* Top Performers */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Top Performers
            </h2>


            <div className="space-y-4">

              {dashboard.topPerformers.map(
                (member, index) => (

                  <div
                    key={member.id}
                    className="flex items-center gap-3"
                  >

                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
                      {index + 1}
                    </div>

                    <div>

                      <p className="font-medium">
                        {member.fullName}
                      </p>

                      <p className="text-sm text-slate-500">
                        {member.completedTasks} Tasks Completed
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* High Priority Tasks */}

          <div className="rounded-2xl bg-white p-6 shadow flex-1">

            <h2 className="mb-5 text-xl font-semibold">
              High Priority Tasks
            </h2>


            <div className="space-y-4">

              {dashboard.highPriorityTasks.length === 0 ? (

                <p className="text-sm text-slate-500">
                  No pending high priority tasks.
                </p>

              ) : (

                dashboard.highPriorityTasks.map(
                  (task) => (

                    <div
                      key={task.id}
                      className="border-b last:border-none pb-4"
                    >

                      <p className="font-medium">
                        {task.title}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {task.project.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {task.assignee.fullName}
                      </p>

                      <p className="text-xs text-red-500 mt-1">
                        Due:{" "}
                        {new Date(
                          task.deadline
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}