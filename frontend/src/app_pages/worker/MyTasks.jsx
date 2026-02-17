// src/app_pages/worker/MyTasks.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/complaints/worker/my-tasks");
      setTasks(res.data.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const startWork = async (id) => {
    await API.put(`/complaints/worker/start/${id}`);
    toast.success("Work started");
    fetchTasks();
  };

  const completeWork = async (id) => {
    await API.put(`/complaints/worker/complete/${id}`);
    toast.success("Work completed");
    fetchTasks();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (tasks.length === 0) return <div className="p-6">No active tasks.</div>;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {tasks.map((t) => (
        <div key={t._id} className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-500">
            {t.block}/{t.floor}/{t.roomNumber}
          </p>
          <p className="text-xs mt-1">Status: {t.status}</p>

          <div className="mt-3 flex gap-2">
            {t.status === "Accepted" && (
              <button
                onClick={() => startWork(t._id)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Start Work
              </button>
            )}
            {t.status === "In Progress" && (
              <button
                onClick={() => completeWork(t._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTasks;
