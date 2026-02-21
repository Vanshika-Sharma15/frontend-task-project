import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [title, setTitle] = useState("");
 

  // fetch tasks from backend
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://frontend-task-project.onrender.com/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTasks(data);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://frontend-task-project.onrender.com/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProfile(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  // add task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title) return alert("Enter task");

    if (editId) {
      // update task
      await fetch(`https://frontend-task-project.onrender.com/api/tasks/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      setEditId(null);

    } else {
      // create task
      const token = localStorage.getItem("token");

      await fetch("https://frontend-task-project.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
    }

    setTitle("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`https://frontend-task-project.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  const handleUpdateTask = async (id) => {
    if (!editText) return alert("Enter task");

    const token = localStorage.getItem("token");

    await fetch(`https://frontend-task-project.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editText }),
    });

    setEditId(null);
    setEditText("");
    fetchTasks();
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* User Profile */}
        {profile && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-semibold">
              Welcome, {profile.name}
            </h2>
            <p className="text-gray-600">
              Email: {profile.email}
            </p>
          </div>
        )}

      {/* Content */}
      <div className="p-6 max-w-xl mx-auto">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Add Task */}
        <form
          onSubmit={handleAddTask}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition cursor-pointer">
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Your Tasks</h2>

          {tasks.length === 0 ? (
            <p>No tasks yet</p>
          ) : (
            <ul className="space-y-2">
              {tasks
                .filter((task) =>
                  task.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((task) => (
                <li
                  key={task.id}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  {editId === task.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded flex-1 mr-2"
                      />

                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdateTask(task.id)}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditText("");
                          }}
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{task.title}</span>

                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setEditId(task.id);
                            setEditText(task.title);
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;