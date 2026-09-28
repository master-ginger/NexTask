"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [projectData, setProjectData] = useState({
    name: "",
    startDate: "",
    deadline: "",
    members: [],
  });

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();

      if (data.success) {
        setMembers(data.members);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createProject = async () => {
    try {
      if (!projectData.name.trim()) {
        alert("Please enter a project name.");
        return;
      }

      if (!projectData.startDate) {
        alert("Please select a start date.");
        return;
      }

      if (!projectData.deadline) {
        alert("Please select a deadline.");
        return;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Project created successfully!");

      setShowModal(false);

      setProjectData({
        name: "",
        startDate: "",
        deadline: "",
        members: [],
      });

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMemberSelection = (userId) => {
    if (projectData.members.includes(userId)) {
      setProjectData({
        ...projectData,
        members: projectData.members.filter(
          (id) => id !== userId
        ),
      });
    } else {
      setProjectData({
        ...projectData,
        members: [...projectData.members, userId],
      });
    }
  };

  /*
   * Filter + sort projects
   */
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search
    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      result = result.filter((project) =>
        project.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.startDate) -
            new Date(a.startDate)
          );

        case "oldest":
          return (
            new Date(a.startDate) -
            new Date(b.startDate)
          );

        case "progress-high":
          return b.progress - a.progress;

        case "progress-low":
          return a.progress - b.progress;

        case "alphabetical":
          return a.name.localeCompare(b.name);

        case "alphabetical-reverse":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    return result;
  }, [projects, search, sortBy]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Projects
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your projects.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
        >
          <option value="newest">
            Created: Newest
          </option>

          <option value="oldest">
            Created: Oldest
          </option>

          <option value="progress-high">
            Progress: High → Low
          </option>

          <option value="progress-low">
            Progress: Low → High
          </option>

          <option value="alphabetical">
            Name: A → Z
          </option>

          <option value="alphabetical-reverse">
            Name: Z → A
          </option>
        </select>
      </div>

      {/* Project count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1
            ? "project"
            : "projects"}
        </p>

        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs font-medium text-slate-500 hover:text-black"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="text-3xl">📁</div>

          <h3 className="mt-3 font-semibold text-slate-800">
            No projects found
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Try changing your search or create a new project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                router.push(`/projects/${project.id}`)
              }
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-slate-900">
                    {project.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Started{" "}
                    {new Date(
                      project.startDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-lg text-slate-300 transition group-hover:text-black">
                  →
                </span>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Progress
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Members
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700 text-center">
                      {project._count?.projectUsers ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Tasks
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700 text-center">
                      {project._count?.tasks ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Completed
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-emerald-600 text-center">
                      {project.tasks?.filter(
                        (task) =>
                          task.status === "Completed"
                      ).length ?? 0}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Deadline
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {new Date(
                      project.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white p-7 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Project
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set up your project and assign members.
              </p>
            </div>

            {/* Project Name */}
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project Name
            </label>

            <input
              placeholder="Enter project name"
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              value={projectData.name}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  name: e.target.value,
                })
              }
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  value={projectData.startDate}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Deadline
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  value={projectData.deadline}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Members */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assign Members
              </label>

              <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {members.length === 0 ? (
                  <p className="p-3 text-sm text-slate-400">
                    No members available.
                  </p>
                ) : (
                  members.map((member) => (
                    <label
                      key={member.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={projectData.members.includes(
                          member.id
                        )}
                        onChange={() =>
                          handleMemberSelection(member.id)
                        }
                        className="h-4 w-4 rounded border-slate-300"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {member.fullName}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}