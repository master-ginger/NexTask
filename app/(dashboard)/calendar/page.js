export default function CalendarPage() {
  const upcomingTasks = [
    {
      task: "Design Dashboard UI",
      project: "NexTask",
      due: "14 Jul",
      assignee: "John",
    },
    {
      task: "API Integration",
      project: "HR Portal",
      due: "15 Jul",
      assignee: "Sarah",
    },
    {
      task: "Testing Sprint 2",
      project: "Inventory System",
      due: "17 Jul",
      assignee: "Alex",
    },
    {
      task: "Deploy Production",
      project: "NexTask",
      due: "20 Jul",
      assignee: "Emma",
    },
  ];

  return (
    <div>
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-slate-500 mt-1">
            Track deadlines and upcoming work.
          </p>
        </div>

        <button className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800 transition">
          + Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Calendar Placeholder */}

        <div className="col-span-2 bg-white rounded-2xl shadow p-6">

          <div className="flex items-center justify-between mb-6">
            <button className="text-lg font-medium">&lt;</button>

            <h2 className="text-xl font-semibold">
              July 2026
            </h2>

            <button className="text-lg font-medium">&gt;</button>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold text-slate-500 mb-4">
            <p>Sun</p>
            <p>Mon</p>
            <p>Tue</p>
            <p>Wed</p>
            <p>Thu</p>
            <p>Fri</p>
            <p>Sat</p>
          </div>

          <div className="grid grid-cols-7 gap-3">

            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl border flex items-center justify-center cursor-pointer transition
                  ${
                    index === 14
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {index + 1 <= 31 ? index + 1 : ""}
              </div>
            ))}

          </div>

        </div>

        {/* Upcoming Deadlines */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Upcoming Tasks
          </h2>

          <div className="space-y-5">

            {upcomingTasks.map((task) => (
              <div
                key={task.task}
                className="border rounded-xl p-4 hover:border-black transition"
              >
                <h3 className="font-semibold">
                  {task.task}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {task.project}
                </p>

                <div className="flex justify-between mt-4 text-sm">
                  <span>{task.assignee}</span>

                  <span className="font-medium text-red-500">
                    {task.due}
                  </span>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}