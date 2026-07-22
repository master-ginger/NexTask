"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [projectData, setProjectData] = useState({
    name: "",
    startDate: "",
    deadline: "",
  });

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

  const createProject = async () => {
    try {
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
      });

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-slate-500 mt-1">
            Manage all your active projects.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800">
          + New Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-6 shadow border"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {project.name}
                </h2>

                <p className="text-slate-500">
                  Deadline:{" "}
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-black rounded-full"
                style={{ width: "0%" }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Progress will be calculated later
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-[500px]">
            <h2 className="text-2xl font-bold mb-6">
              Create Project
            </h2>

            <input
              placeholder="Project Name"
              className="w-full border rounded-xl px-4 py-3 mb-4"
              value={projectData.name}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="w-full border rounded-xl px-4 py-3 mb-4"
              value={projectData.startDate}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  startDate: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="w-full border rounded-xl px-4 py-3 mb-6"
              value={projectData.deadline}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  deadline: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button onClick={createProject} className="bg-black text-white px-5 py-2 rounded-xl">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}