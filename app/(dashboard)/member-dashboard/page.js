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
      <div className="p-8 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Here's an overview of your tasks and upcoming work.
        </p>
      </div>


      {/* Stats */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* Total Tasks */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-slate-500">
            Total Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.stats.totalTasks}
          </h2>

        </div>


        {/* Completed */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {dashboard.stats.completedTasks}
          </h2>

        </div>


        {/* In Progress */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-slate-500">
            In Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {dashboard.stats.inProgressTasks}
          </h2>

        </div>

      </div>


      {/* Main Grid */}

      <div className="grid grid-cols-3 gap-6">


        {/* Task Type Chart */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Task Distribution
          </h2>

          <div className="flex justify-center">

            <div className="w-full">

              {dashboard.taskTypes.map((item) => {

                const total = dashboard.stats.totalTasks;

                const percentage =
                  total > 0
                    ? Math.round((item.count / total) * 100)
                    : 0;

                return (
                  <div
                    key={item.type}
                    className="mb-4"
                  >

                    <div className="flex justify-between mb-1">

                      <span className="text-sm font-medium">
                        {item.type}
                      </span>

                      <span className="text-sm text-slate-500">
                        {item.count}
                      </span>

                    </div>

                    <div className="h-2 bg-gray-200 rounded-full">

                      <div
                        className="h-2 bg-black rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>


        {/* Today's Tasks */}

        <div className="col-span-2 bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              Today's Tasks
            </h2>

            <span className="text-sm text-slate-500">
              {dashboard.todaysTasks.length} tasks
            </span>

          </div>


          {dashboard.todaysTasks.length === 0 ? (

            <div className="py-10 text-center text-slate-500">
              No tasks due today 🎉
            </div>

          ) : (

            <div className="divide-y">

              {dashboard.todaysTasks.map((task) => (

                <div
                  key={task.id}
                  className="py-4 flex items-center justify-between"
                >

                  <div>

                    <p className="font-medium">
                      {task.title}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {task.project.name}
                    </p>

                  </div>


                  <div className="flex items-center gap-3">

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                      {task.taskType}
                    </span>

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                      {task.priority}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


      

      </div>
        <div className="grid grid-cols-2 gap-6 mt-6">

        {/* Overdue Tasks */}

        <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-5">

            <div>
                <h2 className="text-xl font-semibold">
                Overdue Tasks
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                Tasks that need your attention.
                </p>
            </div>

            <span className="text-sm font-medium text-red-500">
                {dashboard.overdueTasks.length}
            </span>

            </div>


            {dashboard.overdueTasks.length === 0 ? (

            <div className="py-8 text-center text-slate-500">
                No overdue tasks 🎉
            </div>

            ) : (

            <div className="divide-y">

                {dashboard.overdueTasks.map((task) => (

                <div
                    key={task.id}
                    className="py-4"
                >

                    <div className="flex justify-between">

                    <p className="font-medium">
                        {task.title}
                    </p>

                    <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600">
                        {task.priority}
                    </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                    {task.project.name}
                    </p>

                    <p className="text-xs text-red-500 mt-2">
                    Due:{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                    </p>

                </div>

                ))}

            </div>

            )}

        </div>


        {/* Approaching Deadlines */}

        <div className="bg-white rounded-2xl shadow p-6">

            <div className="mb-5">

            <h2 className="text-xl font-semibold">
                Approaching Deadlines
            </h2>

            <p className="text-sm text-slate-500 mt-1">
                Tasks that need your attention soon.
            </p>

            </div>


            {dashboard.upcomingTasks.length === 0 ? (

            <div className="py-8 text-center text-slate-500">
                No upcoming deadlines.
            </div>

            ) : (

            <div className="divide-y">

                {dashboard.upcomingTasks.map((task) => (

                <div
                    key={task.id}
                    className="py-4"
                >

                    <div className="flex justify-between">

                    <p className="font-medium">
                        {task.title}
                    </p>

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                        {task.priority}
                    </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                    {task.project.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                    Due:{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                    </p>

                </div>

                ))}

            </div>

            )}

        </div>

        </div>

    </main>
  );
}