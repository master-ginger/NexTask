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
      <div className="p-8">
        <p className="text-slate-500">Loading productivity analysis...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Productivity Analysis
        </h1>

        <p className="text-slate-500 mt-1">
          Analyze team productivity, project performance and workload.
        </p>
      </div>


      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Productivity Score
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {productivity.stats.productivityScore}%
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Overall team performance
          </p>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Tasks Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {productivity.stats.completedTasks}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Current workload
          </p>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Avg. Completion Time
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {productivity.stats.averageCompletionTime}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Per completed task
          </p>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Overdue Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {productivity.stats.overdueRate}%
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Tasks past deadline
          </p>
        </div>

      </div>


      {/* Main Grid */}

      <div className="grid grid-cols-3 gap-6">


        {/* Productivity Trend */}

        <div className="col-span-2 bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-xl font-semibold">
                Productivity Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Tasks completed over the last 30 days
              </p>
            </div>

          </div>


          {/* Simple chart */}

          <div className="h-64 flex items-end gap-2">

            {productivity.completionTrend.map((item) => {

              const max =
                Math.max(
                  ...productivity.completionTrend.map(
                    (x) => x.completed
                  ),
                  1
                );

              const height =
                (item.completed / max) * 100;

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col justify-end items-center"
                >

                  <div
                    className="w-full bg-black rounded-t"
                    style={{
                      height: `${height}%`,
                      minHeight:
                        item.completed > 0
                          ? "4px"
                          : "0px",
                    }}
                    title={`${item.date}: ${item.completed} completed`}
                  />

                </div>
              );

            })}

          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-3">

            <span>
              {productivity.completionTrend[0]?.date}
            </span>

            <span>
              Today
            </span>

          </div>

        </div>


        {/* Top Performers */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-1">
            Top Performers
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Team highlights
          </p>


          <div className="space-y-5">

            {productivity.topPerformers.map(
              (performer, index) => (

                <div
                  key={performer.id}
                  className="flex items-center gap-4"
                >

                  <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>

                  <div className="flex-1">

                    <p className="font-medium">
                      {performer.fullName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {performer.completedTasks} tasks completed
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* Project Performance */}

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold">
            Project Performance
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Compare productivity across projects.
          </p>

        </div>


        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Project
              </th>

              <th className="text-left p-4">
                Completion
              </th>

              <th className="text-left p-4">
                On-time
              </th>

              <th className="text-left p-4">
                Overdue
              </th>

              <th className="text-left p-4">
                Health
              </th>

            </tr>

          </thead>


          <tbody>

            {productivity.projects.map((project) => (

              <tr
                key={project.id}
                className="border-t"
              >

                <td className="p-4 font-medium">
                  {project.name}
                </td>

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-32 h-2 bg-gray-200 rounded-full">

                      <div
                        className="h-2 bg-black rounded-full"
                        style={{
                          width: `${project.completion}%`,
                        }}
                      />

                    </div>

                    <span className="text-sm">
                      {project.completion}%
                    </span>

                  </div>

                </td>

                <td className="p-4">
                  {project.onTimeRate}%
                </td>

                <td className="p-4">
                  {project.overdueTasks}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      project.health === "Healthy"
                        ? "bg-green-100 text-green-700"
                        : project.health === "At Risk"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
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


      {/* Member Analysis */}

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold">
            Member Analysis
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Individual productivity and workload analysis.
          </p>

        </div>


        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Member
              </th>

              <th className="text-left p-4">
                Completed
              </th>

              <th className="text-left p-4">
                On-time
              </th>

              <th className="text-left p-4">
                Avg. Time
              </th>

              <th className="text-left p-4">
                Bugs Solved
              </th>

              <th className="text-left p-4">
                Active Tasks
              </th>

              <th className="text-left p-4">
                Burnout Risk
              </th>

            </tr>

          </thead>


          <tbody>

            {productivity.members.map((member) => (

              <tr
                key={member.id}
                className="border-t"
              >

                <td className="p-4 font-medium">
                  {member.fullName}
                </td>

                <td className="p-4">
                  {member.completedTasks}
                </td>

                <td className="p-4">
                  {member.onTimeRate}%
                </td>

                <td className="p-4">
                  {member.averageCompletionTime}
                </td>

                <td className="p-4">
                  {member.bugsSolved}
                </td>

                <td className="p-4">
                  {member.activeTasks}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.burnoutRisk === "Low"
                        ? "bg-green-100 text-green-700"
                        : member.burnoutRisk === "Moderate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.burnoutRisk}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}