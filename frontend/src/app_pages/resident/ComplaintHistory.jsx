// src/app_pages/resident/ComplaintHistory.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUser,
  FiImage,
  FiRefreshCw,
  FiX,
  FiFileText,
  FiTool
} from "react-icons/fi";
import { format } from "date-fns";

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/complaints/my-complaints");
      setComplaints(res.data.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load complaint history";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Accepted: "bg-blue-100 text-blue-800 border-blue-300",
      "In Progress": "bg-indigo-100 text-indigo-800 border-indigo-300",
      Completed: "bg-green-100 text-green-800 border-green-300",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
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
          <p className="text-gray-600 dark:text-gray-300">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiFileText className="text-blue-600" />
            My Complaint History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all your raised maintenance requests
          </p>
        </div>

        <button
          onClick={fetchComplaints}
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

      {complaints.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center text-gray-500 dark:text-gray-400">
          <FiAlertCircle className="mx-auto text-6xl mb-4 opacity-50" />
          <p className="text-xl font-medium">No complaints found</p>
          <p className="mt-2">Raise a new complaint from the dashboard when needed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedComplaint(c)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {c.title}
                </h3>
                {getStatusBadge(c.status)}
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <FiMapPin size={16} className="text-gray-500" />
                  <span>
                    {c.block} • Floor {c.floor} • Room {c.roomNumber}
                  </span>
                </div>

                {c.department && (
                  <div className="flex items-center gap-2">
                    <FiTool size={16} className="text-gray-500" />
                    <span>{c.department}</span>
                  </div>
                )}

                {c.createdAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FiClock size={14} />
                    Raised: {format(new Date(c.createdAt), "dd MMM yyyy • hh:mm a")}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-3">
                Click to view full details
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FiFileText className="text-blue-600" />
                Complaint Details
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {selectedComplaint.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedComplaint.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        Block {selectedComplaint.block} • Floor {selectedComplaint.floor} • Room{" "}
                        {selectedComplaint.roomNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiTool className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedComplaint.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised on</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {format(new Date(selectedComplaint.createdAt), "dd MMM yyyy • hh:mm a")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle
                      className={
                        selectedComplaint.status === "Completed"
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                      size={18}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                    </div>
                  </div>

                  {selectedComplaint.worker && (
                    <div className="flex items-center gap-3">
                      <FiUser className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Assigned Worker
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedComplaint.worker.username || "Assigned"}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedComplaint.acceptedAt && (
                    <div className="flex items-center gap-3">
                      <FiClock className="text-blue-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Accepted on
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {format(new Date(selectedComplaint.acceptedAt), "dd MMM yyyy • hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedComplaint.completedAt && (
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="text-green-600" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Completed on
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {format(new Date(selectedComplaint.completedAt), "dd MMM yyyy • hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedComplaint.images?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <FiImage size={16} /> Attached Images
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedComplaint.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(img, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;