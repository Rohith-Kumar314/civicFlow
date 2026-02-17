// src/app_pages/worker/WorkerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPlayCircle,
  FiRefreshCw,
  FiMapPin,
  FiUser,
  FiTool,
} from "react-icons/fi";
import { format } from "date-fns";

const WorkerDashboard = () => {
  const { user } = useAuth();

  const [available, setAvailable] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [availableRes, myTasksRes, completedRes] = await Promise.all([
        API.get("/complaints/worker/available"),
        API.get("/complaints/worker/my-tasks"),
        API.get("/complaints/worker/completed"),
      ]);

      setAvailable(availableRes.data.data || []);
      setMyTasks(myTasksRes.data.data || []);
      setCompleted(completedRes.data.data || []);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to load dashboard data";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAccept = async (id) => {
    if (!window.confirm("Accept this complaint?")) return;

    try {
      await API.put(`/complaints/worker/accept/${id}`);
      toast.success("Task accepted successfully");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept task");
    }
  };

  // Quick stats calculation
  const stats = {
    totalTasks: myTasks.length + completed.length,
    accepted: myTasks.filter((c) => c.status === "Accepted").length,
    inProgress: myTasks.filter((c) => c.status === "In Progress").length,
    completed: completed.length,
    pendingAcceptance: myTasks.filter((c) => c.status === "Accepted" && !c.acceptedAt).length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Accepted: "bg-blue-100 text-blue-800 border-blue-300",
      "In Progress": "bg-indigo-100 text-indigo-800 border-indigo-300",
      Completed: "bg-green-100 text-green-800 border-green-300",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username || "Worker"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your assigned maintenance tasks
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium shadow-sm transition disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
        <StatCard
          icon={<FiAlertCircle className="text-amber-600" />}
          title="Total Tasks"
          value={stats.totalTasks}
          color="amber"
        />
        <StatCard
          icon={<FiClock className="text-blue-600" />}
          title="Accepted"
          value={stats.accepted}
          color="blue"
        />
        <StatCard
          icon={<FiPlayCircle className="text-indigo-600" />}
          title="In Progress"
          value={stats.inProgress}
          color="indigo"
        />
        <StatCard
          icon={<FiCheckCircle className="text-green-600" />}
          title="Completed"
          value={stats.completed}
          color="green"
        />
        <StatCard
          icon={<FiTool className="text-purple-600" />}
          title="Pending Start"
          value={stats.inProgress + stats.accepted}
          color="purple"
        />
      </div>

      {/* Available Complaints Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAlertCircle className="text-amber-600" />
            Available Complaints ({available.length})
          </h2>
          {available.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              From your department • Click to accept
            </span>
          )}
        </div>

        {available.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            <FiAlertCircle className="mx-auto text-5xl mb-4 opacity-50" />
            <p className="text-lg">No pending complaints available right now.</p>
            <p className="mt-1">New tasks will appear here when residents raise issues in your department.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {available.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {complaint.title}
                  </h3>
                  {getStatusBadge(complaint.status)}
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-500" size={16} />
                    <span>
                      {complaint.block} • Floor {complaint.floor} • Room {complaint.roomNumber}
                    </span>
                  </div>

                  {complaint.resident && (
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-500" size={16} />
                      <span>Raised by: {complaint.resident.username}</span>
                    </div>
                  )}

                  {complaint.createdAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Reported {format(new Date(complaint.createdAt), "dd MMM yyyy • hh:mm a")}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAccept(complaint._id)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm flex items-center justify-center gap-2"
                >
                  <FiPlayCircle size={18} />
                  Accept Task
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Tasks Section - could be expanded later */}
      {myTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTool className="text-indigo-600" />
              My Active Tasks ({myTasks.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {myTasks.slice(0, 5).map((task) => (  // show only first 5 for dashboard
              <div key={task._id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {task.block} • Floor {task.floor} • Room {task.roomNumber}
                    </p>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
              </div>
            ))}
            {myTasks.length > 5 && (
              <div className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                + {myTasks.length - 5} more tasks • View all in "My Tasks" page
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color = "gray" }) => {
  const colorMap = {
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200",
    green: "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 border-purple-200",
    gray: "text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200",
  };

  return (
    <div
      className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${colorMap[color] || colorMap.gray}`}
    >
      <div className="text-3xl opacity-90">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
      </div>
    </div>
  );
};

export default WorkerDashboard;