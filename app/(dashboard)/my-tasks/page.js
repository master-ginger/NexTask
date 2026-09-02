"use client";

import { useEffect, useState } from "react";

const columns = [
  { key: "Todo", title: "To Do" },
  { key: "In Progress", title: "In Progress" },
  { key: "Completed", title: "Completed" },
];

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }
        const user = JSON.parse(storedUser);

        const res = await fetch(
        `/api/tasks?assigneeId=${user.id}`
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

  // When dragging starts
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // Required so that drop is allowed
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // When card is dropped
  const handleDrop = async (newStatus) => {
    if (!draggedTask) return;

    // Don't do anything if dropped in same column
    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Optimistically update UI
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
          title: draggedTask.title,
          description: draggedTask.description,
          priority: draggedTask.priority,
          status: newStatus,
          deadline: draggedTask.deadline,
          projectId: draggedTask.projectId,
          assigneeId: draggedTask.assigneeId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        console.error(data.message);

        // Reload if update failed
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);

      // Restore actual DB state
      fetchTasks();
    }

    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">My Tasks</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.key
          );

          return (
            <div
              key={column.key}
              className="min-h-[500px] rounded-xl bg-zinc-900 p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.key)}
            >
              {/* Column header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{column.title}</h2>

                <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
                  {columnTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={() => setDraggedTask(null)}
                    className="cursor-grab rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow-sm transition hover:border-zinc-500 active:cursor-grabbing"
                  >
                    <h3 className="mb-2 font-medium">
                      {task.title}
                    </h3>

                    {task.project && (
                      <p className="mb-2 text-sm text-zinc-400">
                        📁 {task.project.name}
                      </p>
                    )}

                    <div className="mb-3 flex gap-2">
                      <span className="rounded bg-zinc-700 px-2 py-1 text-xs">
                        {task.taskType}
                      </span>

                      <span className="rounded bg-zinc-700 px-2 py-1 text-xs">
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">
                      Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                {/* Empty column */}
                {columnTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-500">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}