export default function ProjectsPage() {
  const projects = [
    {
      name: "NexTask",
      members: 5,
      progress: 72,
      deadline: "20 Jul 2026",
    },
    {
      name: "HR Portal",
      members: 3,
      progress: 45,
      deadline: "15 Aug 2026",
    },
    {
      name: "Inventory System",
      members: 7,
      progress: 90,
      deadline: "30 Jul 2026",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-slate-500 mt-1">
            Manage all your active projects.
          </p>
        </div>

        <button className="bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800">
          + New Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-white rounded-2xl p-6 shadow border"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-slate-500">
                  {project.members} Members
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {project.deadline}
              </span>
            </div>

            <div className="mt-5 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-black rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {project.progress}% Completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}