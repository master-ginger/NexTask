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
    <div>
      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-slate-500 mt-1">
            Manage project tasks.
          </p>
        </div>

        <div className="flex gap-4">

          <select
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="">
                    Select Project
                </option>
            {projects.map((project) => (

                <option
                    key={project.id}
                    value={project.id}
                >
                    {project.name}
                </option>

            ))}
          </select>

          <button
            onClick={() => {
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

  setShowModal(true);
}}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800"
          >
            + Add Task
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-5">
                #
              </th>

              <th className="text-left p-5">
                Title
              </th>

              <th className="text-left p-5">
                Project
              </th>

              <th className="text-left p-5">
                Assignee
              </th>

              <th className="text-left p-5">
                Priority
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.map((task, index) => (

              <tr
                key={task.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-5">
                  {index + 1}
                </td>

                <td className="p-5 font-medium">
                  {task.title}
                </td>

                <td className="p-5">
                  {task.project.name}
                </td>

                <td className="p-5">
                  {task.assignee.fullName}
                </td>

                <td className="p-5">
                  <span className="px-3 py-1 rounded-full bg-gray-100">
                    {task.priority}
                  </span>
                </td>

                <td className="p-5">
                  <span className="px-3 py-1 rounded-full bg-gray-100">
                    {task.status}
                  </span>
                </td>

                <td className="p-5">
  <div className="flex gap-3">

    <button
      onClick={() => editTask(task)}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>

    <button
      onClick={() => deleteTask(task.id)}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>

  </div>
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white w-[550px] rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">
    {isEditing ? "Edit Task" : "Create Task"}
</h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Task Title"
                className="w-full border rounded-xl px-4 py-3"
                value={taskData.title}
                onChange={(e) =>
                    setTaskData({
                    ...taskData,
                    title: e.target.value,
                    })
                }
              />

              <textarea
                placeholder="Description"
                rows={4}
                className="w-full border rounded-xl px-4 py-3"
                value={taskData.description}
                 onChange={(e) =>
                    setTaskData({
                    ...taskData,
                    description: e.target.value,
                    })
                }
              />

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
                className="w-full border rounded-xl px-4 py-3"
                >
                <option value="">Select Project</option>

                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                    {project.name}
                    </option>
                ))}
                </select>

                <select
                value={taskData.assigneeId}
                onChange={(e) =>
                    setTaskData({
                    ...taskData,
                    assigneeId: e.target.value,
                    })
                }
                className="w-full border rounded-xl px-4 py-3"
                >
                <option value="">Select Assignee</option>

                {members.map((member) => (
                    <option
                    key={member.user.id}
                    value={member.user.id}
                    >
                    {member.user.fullName}
                    </option>
                ))}
                </select>

              <div className="grid grid-cols-3 gap-4">

                <select className="border rounded-xl px-4 py-3"
                    value={taskData.priority}
                    onChange={(e) =>
                    setTaskData({
                    ...taskData,
                    priority: e.target.value,
                    })
                }>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                 <select
                  value={taskData.taskType}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      taskType: e.target.value,
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                >
                  <option value="TASK">Task</option>
                  <option value="FEATURE">Feature</option>
                  <option value="BUG">Bug</option>
                  <option value="IMPROVEMENT">Improvement</option>
                </select>
                <select 
                    className="border rounded-xl px-4 py-3"
                    value={taskData.status}
                    onChange={(e) =>
                        setTaskData({
                        ...taskData,
                        status: e.target.value,
                        })
                    }
                >
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

              </div>

              <input
                type="date"
                className="w-full border rounded-xl px-4 py-3"
                value={taskData.deadline}
                onChange={(e) =>
                    setTaskData({
                    ...taskData,
                    deadline: e.target.value,
                    })
                }
              />

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => {
                    setShowModal(false);
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
                }}
                className="border px-5 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
    className="bg-black text-white px-5 py-2 rounded-xl"
    onClick={isEditing ? updateTask : createTask}
>
    {isEditing ? "Update" : "Create"}
</button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}