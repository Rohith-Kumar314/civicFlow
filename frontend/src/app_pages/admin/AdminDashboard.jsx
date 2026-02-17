import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaTools,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import CountUp from "react-countup";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");

        setStats(res.data.data);
        setRecentComplaints(res.data.data.recentComplaints || []);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load dashboard</div>;

  const statCards = [
    {
      title: "Total Residents",
      value: stats.totalResidents,
      icon: <FaUsers />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Workers",
      value: stats.activeWorkers,
      icon: <FaTools />,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Open Complaints",
      value: stats.openComplaints,
      icon: <FaClipboardList />,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Resolved",
      value: stats.resolvedComplaints,
      icon: <FaCheckCircle />,
      gradient: "from-purple-500 to-indigo-600",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-indigo-100 text-indigo-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-10">
      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.gradient} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">{item.title}</p>
                <h3 className="text-3xl font-bold mt-2">
                  <CountUp end={item.value || 0} duration={2} />
                </h3>
              </div>
              <div className="text-3xl opacity-80">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== RECENT COMPLAINTS ===== */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">
          Recent Complaints
        </h3>

        {recentComplaints.length === 0 ? (
          <p className="text-gray-500">No complaints found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 text-left">Resident</th>
                  <th className="text-left">Issue</th>
                  <th className="text-left">Worker</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {recentComplaints.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3">
                      {c.resident?.name || c.resident?.username || "Unknown"}
                    </td>

                    <td>{c.title}</td>

                    <td>
                      {c.worker?.name ||
                        c.worker?.username ||
                        "Not Assigned"}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
