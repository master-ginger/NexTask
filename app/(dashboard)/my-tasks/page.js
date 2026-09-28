"use client";

import { useEffect, useState } from "react";

const columns = [
  {
    key: "Todo",
    title: "To Do",
    icon: "○",
  },
  {
    key: "In Progress",
    title: "In Progress",
    icon: "◐",
  },
  {
    key: "Completed",
    title: "Completed",
    icon: "✓",
  },
];

const initialTaskData = {
  title: "",
  description: "",
  projectId:"",
  priority: "Medium",
  deadline: "",
  taskType: "TASK",
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskData, setTaskData] = useState(initialTaskData);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(storedUser);
      setUser(currentUser);

      const res = await fetch(
        `/api/tasks?assigneeId=${currentUser.id}`
      );

      const data = await res.json();

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const previousTasks = tasks;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTask.id
          ? {
              ...task,
              status: newStatus,
              completedAt:
                newStatus === "Completed" ? new Date() : null,
            }
          : task
      )
    );

    try {
      const res = await fetch(`/api/tasks/${draggedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setTasks(previousTasks);
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setTasks(previousTasks);
    }

    setDraggedTask(null);
  };

  const handleOpenAddTask = () => {
    setTaskData(initialTaskData);
    setShowModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!taskData.title.trim()) {
      return;
    }

    if (!taskData.deadline) {
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          projectId: taskData.projectId,
          priority: taskData.priority,
          status: "Todo",
          deadline: taskData.deadline,
          taskType: taskData.taskType,
          assigneeId: user.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setTaskData(initialTaskData);
        fetchTasks();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSaving(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50 px-6 py-5 lg:px-7">

      {/* Header */}
      <div className="mb-5 flex shrink-0 items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white">
              ✓
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                My Tasks
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage and track your assigned tasks.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAddTask}
          className="flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md"
        >
          <span className="text-lg leading-none">+</span>
          Add Task
        </button>
      </div>

      {/* Kanban board */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-3">

          {columns.map((column, index) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.key
            );

            return (
              <div
                key={column.key}
                className={`flex min-h-0 flex-col bg-slate-50/70 ${
                  index !== columns.length - 1
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.key)}
              >
                {/* Column header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                      {column.icon}
                    </div>

                    <h2 className="text-sm font-semibold text-slate-800">
                      {column.title}
                    </h2>
                  </div>

                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Scroll only inside column */}
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">

                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        onDragEnd={() => setDraggedTask(null)}
                        className="group cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md active:cursor-grabbing"
                      >
                        {/* Task title */}
                        <div className="mb-3">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Project */}
                        {task.project && (
                          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                              📁
                            </span>

                            <span className="truncate font-medium">
                              {task.project.name}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getTaskTypeStyle(
                              task.taskType
                            )}`}
                          >
                            {task.taskType}
                          </span>

                          <span
                            className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[11px] font-medium text-slate-400">
                            Deadline
                          </span>

                          <span className="text-xs font-semibold text-slate-600">
                            {formatDate(task.deadline)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Empty state */}
                    {columnTasks.length === 0 && (
                      <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center">
                        <div>
                          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-400">
                            {column.icon}
                          </div>

                          <p className="text-xs font-medium text-slate-400">
                            No tasks here
                          </p>

                          <p className="mt-1 text-[11px] text-slate-300">
                            Drop a task here
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Task
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a task and add it to your To Do list.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4 px-6 py-5">

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Task Title
                  </label>

                  <input
                    type="text"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter task title"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the task..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Type + Priority */}
                <div className="grid grid-cols-2 gap-4">

                  <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Project
                  </label>

                  <select
                    value={taskData.projectId}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        projectId: e.target.value,
                      })
                    }
                    required
                    className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  >
                    <option value="">Select project</option>

                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                      className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="TASK">Task</option>
                      <option value="FEATURE">Feature</option>
                      <option value="BUG">Bug</option>
                      <option value="IMPROVEMENT">Improvement</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                      className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Deadline
                  </label>

                  <input
                    type="date"
                    value={taskData.deadline}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        deadline: e.target.value,
                      })
                    }
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}