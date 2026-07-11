export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Welcome back! Here's an overview of your projects.
          </p>
        </div>

        <button className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800 transition">
          + New Project
        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Projects</p>
          <h2 className="mt-2 text-3xl font-bold">12</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Tasks</p>
          <h2 className="mt-2 text-3xl font-bold">148</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">98</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Overdue</p>
          <h2 className="mt-2 text-3xl font-bold text-red-500">7</h2>
        </div>

      </div>

      {/* Main Grid */}

      <div className="grid grid-cols-3 gap-6">

        {/* Projects */}

        <div className="col-span-2 rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">
              Active Projects
            </h2>

            <button className="text-sm text-black font-medium">
              View All
            </button>
          </div>

          <div className="space-y-5">

            {[
              {
                name: "NexTask",
                members: 5,
                progress: 70,
                deadline: "20 Jul",
              },
              {
                name: "Inventory System",
                members: 8,
                progress: 45,
                deadline: "12 Aug",
              },
              {
                name: "HR Portal",
                members: 4,
                progress: 92,
                deadline: "28 Jul",
              },
            ].map((project) => (
              <div
                key={project.name}
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
                    {project.deadline}
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

        {/* Right Panel */}

        <div className="space-y-6">

          {/* Team */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Team
            </h2>

            {[
              "John Doe",
              "Sarah",
              "Alex",
              "Emma",
            ].map((member) => (
              <div
                key={member}
                className="flex items-center justify-between py-3 border-b last:border-none"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                    {member[0]}
                  </div>

                  <p>{member}</p>

                </div>

                <span className="text-xs text-green-600">
                  Active
                </span>

              </div>
            ))}

          </div>

          {/* Recent Tasks */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Recent Tasks
            </h2>

            {[
              "Design Login Page",
              "Fix Dashboard API",
              "Review PR #21",
              "Testing Module",
            ].map((task) => (
              <div
                key={task}
                className="flex items-center justify-between py-3 border-b last:border-none"
              >
                <p>{task}</p>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  Todo
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}