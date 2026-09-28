"use client";
import { useEffect, useState } from "react";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    const [selectedProject, setSelectedProject] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [members, setMembers] = useState([]);

    const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    priority: "Medium",
    status: "Todo",
    deadline: "",
    taskType:"TASK"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    const fetchMembers = async (projectId) => {
        if (!projectId) {
            setMembers([]);
            return;
        }

        try {
            const res = await fetch(`/api/projects/${projectId}/members`);
            const data = await res.json();

            if (data.success) {
            setMembers(data.members);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        if (data.success) {
          setProjects(data.projects);

          // Automatically select the latest project
          if (data.projects.length > 0 && !selectedProject) {
            setSelectedProject(data.projects[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    const fetchTasks = async (projectId = "all") => {
        try {

            let url = "/api/tasks";

            if (projectId !== "all") {
            url += `?projectId=${projectId}`;
            }

            

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
            setTasks(data.tasks);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const createTask = async () => {
    try {

        const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
        });

        const data = await res.json();

        if (!data.success) {
        alert(data.message);
        return;
        }

        alert("Task created successfully!");

        setShowModal(false);

        setTaskData({
        title: "",
        description: "",
        projectId: selectedProject !== "all" ? selectedProject : "",
        assigneeId: "",
        priority: "Medium",
        status: "Todo",
        deadline: "",
        taskType: "TASK",
        });

        setMembers([]);

        fetchTasks(selectedProject);

    } catch (error) {
        console.error(error);
    }
    };

    const editTask = async (task) => {

      setIsEditing(true);
      setEditingTaskId(task.id);

      await fetchMembers(task.projectId);

      setTaskData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline.substring(0, 10),
        taskType: task.taskType
      });

        setShowModal(true);
      };

    const updateTask = async () => {

      try {
        console.log("task Id: ",editingTaskId)
        const res = await fetch(`/api/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message);
          return;
        }

        alert("Task updated successfully!");

        setShowModal(false);

        setIsEditing(false);
        setEditingTaskId(null);

        setTaskData({
          title: "",
          description: "",
          projectId: "",
          assigneeId: "",
          priority: "Medium",
          status: "Todo",
          deadline: "",
        });

        setMembers([]);

        fetchTasks(selectedProject);

      } catch (error) {
        console.error(error);
      }

    };

    const deleteTask = async (taskId) => {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );

      if (!confirmDelete) return;

      try {

        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message);
          return;
        }

        alert("Task deleted successfully!");

        fetchTasks(selectedProject);

      } catch (error) {
        console.error(error);
      }

    };  

    useEffect(() => {
        fetchProjects();
        // fetchTasks();
    }, []);

    useEffect(() => {
       if (selectedProject) {
            fetchTasks(selectedProject);
            fetchMembers(selectedProject);
        }
    }, [selectedProject]);

  return (
    <div className="h-[90vh]">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg text-white">
              ✓
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tasks
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and track project tasks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Project Selector */}
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400">
              📁
            </div>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="h-12 min-w-[250px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {projects.length === 0 ? (
                <option value="">
                  No projects available
                </option>
              ) : (
                projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))
              )}
            </select>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </div>
          </div>

          {/* Add Task */}
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingTaskId(null);

              setTaskData({
                title: "",
                description: "",
                projectId: selectedProject || "",
                assigneeId: "",
                priority: "Medium",
                status: "Todo",
                deadline: "",
                taskType: "TASK",
              });

              if (selectedProject) {
                fetchMembers(selectedProject);
              } else {
                setMembers([]);
              }

              setShowModal(true);
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Add Task
          </button>

        </div>
      </div>

      {/* Table */}

     {/* Task Table */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Project Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in this project
              </p>
            </div>

            {selectedProject && (
              <div className="hidden rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
                {projects.find((p) => p.id === selectedProject)?.name}
              </div>
            )}
          </div>

          {/* ONLY THIS AREA SCROLLS */}
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-auto">
            <table className="w-full min-w-[900px]">

              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Task
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Assignee
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Deadline
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                        {tasks.map((task, index) => (

                          <tr
                            key={task.id}
                            className="group transition hover:bg-slate-50/70"
                          >

                            {/* Number */}
                            <td className="px-6 py-5 text-sm text-slate-400">
                              {String(index + 1).padStart(2, "0")}
                            </td>

                            {/* Task */}
                            <td className="max-w-[280px] px-6 py-5">

                              <div className="flex items-center gap-3">

                                

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-800">
                                    {task.title}
                                  </p>

                                  {task.description && (
                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                              </div>

                            </td>

                            {/* Assignee */}
                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2.5">

                              

                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                  {task.assignee?.fullName || "Unassigned"}
                                </span>

                              </div>

                            </td>

                            {/* Type */}
                            <td className="px-6 py-5">

                              <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {task.taskType}
                              </span>

                            </td>

                            {/* Priority */}
                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                  task.priority === "High"
                                    ? "bg-red-50 text-red-600"
                                    : task.priority === "Medium"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                {task.priority}
                              </span>

                            </td>

                            {/* Status */}
                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                  task.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : task.status === "In Progress"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    task.status === "Completed"
                                      ? "bg-emerald-500"
                                      : task.status === "In Progress"
                                      ? "bg-blue-500"
                                      : "bg-slate-400"
                                  }`}
                                />

                                {task.status}
                              </span>

                            </td>

                            {/* Deadline */}
                            <td className="px-6 py-5">

                              <span className="whitespace-nowrap text-sm text-slate-600">
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "—"}
                              </span>

                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">

                              <div className="flex justify-end gap-2 opacity-70 transition group-hover:opacity-100">

                                <button
                                  onClick={() => editTask(task)}
                                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-black"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 7.125 16.875 4.5"
                                    />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.558 0a48.108 48.108 0 0 1 3.478-.397m7.5 0V4.5c0-1.125-.875-2.025-2-2.025h-2.25c-1.125 0-2.025.9-2.025 2.025v.893m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>

                              </div>

                            </td>

                          </tr>

                        ))}

                      </tbody>

            </table>
          </div>
        </div>

     {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="border-b border-slate-100 px-7 py-3">

              <div className="flex items-start justify-between">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg text-white">
                      {isEditing ? "✎" : "+"}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {isEditing ? "Edit Task" : "Create Task"}
                      </h2>

                      <p className="mt-0.5 text-sm text-slate-500">
                        {isEditing
                          ? "Update the task details below."
                          : "Add a new task to your project."}
                      </p>
                    </div>

                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setMembers([]);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* Modal Body */}
            <div className=" px-7 py-5">

              <div className="space-y-5">

                {/* Task Title */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Task Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Implement login page"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </label>

                  <textarea
                    placeholder="Describe what needs to be done..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Project + Assignee */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Project */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        📁
                      </span>

                      <select
                        value={taskData.projectId}
                        onChange={(e) => {
                          setTaskData({
                            ...taskData,
                            projectId: e.target.value,
                            assigneeId: "",
                          });

                          fetchMembers(e.target.value);
                        }}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="">Select project</option>

                        {projects.map((project) => (
                          <option
                            key={project.id}
                            value={project.id}
                          >
                            {project.name}
                          </option>
                        ))}
                      </select>

                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        ▼
                      </span>

                    </div>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Assignee
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        👤
                      </span>

                      <select
                        value={taskData.assigneeId}
                        onChange={(e) =>
                          setTaskData({
                            ...taskData,
                            assigneeId: e.target.value,
                          })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="">Select assignee</option>

                        {members.map((member) => (
                          <option
                            key={member.user.id}
                            value={member.user.id}
                          >
                            {member.user.fullName}
                          </option>
                        ))}
                      </select>

                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        ▼
                      </span>

                    </div>
                  </div>

                </div>

                {/* Priority / Type / Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  {/* Priority */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </label>

                    <select
                      value={taskData.priority}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          priority: e.target.value,
                        })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Task Type
                    </label>

                    <select
                      value={taskData.taskType}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          taskType: e.target.value,
                        })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="TASK">Task</option>
                      <option value="FEATURE">Feature</option>
                      <option value="BUG">Bug</option>
                      <option value="IMPROVEMENT">
                        Improvement
                      </option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </label>

                    <select
                      value={taskData.status}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          status: e.target.value,
                        })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                      <option>Todo</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                </div>

                {/* Deadline */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Deadline
                  </label>

                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    value={taskData.deadline}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-7 py-4">

              <p className="hidden text-xs text-slate-400 sm:block">
                {isEditing
                  ? "Changes will be saved immediately."
                  : "Make sure all required details are filled."}
              </p>

              <div className="ml-auto flex gap-3">

                <button
                  onClick={() => {
                    setShowModal(false);
                    setMembers([]);
                    setIsEditing(false);
                    setEditingTaskId(null);

                    setTaskData({
                      title: "",
                      description: "",
                      projectId: "",
                      assigneeId: "",
                      priority: "Medium",
                      status: "Todo",
                      deadline: "",
                      taskType: "TASK",
                    });
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  onClick={isEditing ? updateTask : createTask}
                  className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md"
                >
                  {isEditing ? "Save Changes" : "Create Task"}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}