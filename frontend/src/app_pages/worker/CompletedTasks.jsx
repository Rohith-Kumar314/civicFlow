// src/app_pages/worker/CompletedTasks.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FiCheckCircle, FiCalendar, FiClock, FiMapPin, FiUser, FiImage, FiX } from "react-icons/fi";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await API.get("/complaints/worker/completed");
        setTasks(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load completed tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <FiCheckCircle className="mx-auto text-6xl mb-4 opacity-40" />
        <p className="text-xl">No completed tasks yet.</p>
        <p className="mt-2">Once you finish a task, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <FiCheckCircle className="text-green-600" />
        Completed Tasks ({tasks.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => setSelectedTask(task)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {task.title}
              </h2>
              <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                Completed
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <FiMapPin size={16} className="text-gray-500" />
                <span>
                  {task.block} • Floor {task.floor} • Room {task.roomNumber}
                </span>
              </div>

              {task.resident && (
                <div className="flex items-center gap-2">
                  <FiUser size={16} className="text-gray-500" />
                  <span>Resident: {task.resident.username}</span>
                </div>
              )}

              {task.completedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FiCalendar size={14} />
                  <span>Completed: {format(new Date(task.completedAt), "dd MMM yyyy • hh:mm a")}</span>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
              Click to view full details
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FiCheckCircle className="text-green-600" />
                Task Details
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {selectedTask.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedTask.block} • Floor {selectedTask.floor} • Room {selectedTask.roomNumber}
                      </p>
                    </div>
                  </div>

                  {selectedTask.resident && (
                    <div className="flex items-center gap-3">
                      <FiUser className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised by</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedTask.resident.username}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTask.createdAt && (
                    <div className="flex items-center gap-3">
                      <FiClock className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised on</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {format(new Date(selectedTask.createdAt), "dd MMM yyyy • hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedTask.acceptedAt && (
                    <div className="flex items-center gap-3">
                      <FiClock className="text-blue-500" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Accepted on</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {format(new Date(selectedTask.acceptedAt), "dd MMM yyyy • hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTask.completedAt && (
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="text-green-600" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed on</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {format(new Date(selectedTask.completedAt), "dd MMM yyyy • hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTask.images?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FiImage size={16} /> Attached Images
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {selectedTask.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Attachment ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                            onClick={() => window.open(img, "_blank")}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
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

export default CompletedTasks;