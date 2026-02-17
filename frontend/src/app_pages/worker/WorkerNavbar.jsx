// src/app_pages/worker/WorkerNavbar.jsx
import React, { useState } from "react";
import { FiLogOut, FiChevronDown, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext"; // if you want to use auth context instead of props

const WorkerNavbar = ({ workerName, onLogout }) => {
  const { user } = useAuth(); // optional: can use context if workerName comes from there
  const [open, setOpen] = useState(false);

  // Use context username if available, fallback to prop
  const displayName = user?.username || workerName || "Worker";

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Left: Title */}
      <h1 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
        Worker Panel
      </h1>

      {/* Right: Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm text-lg">
            {displayName.charAt(0).toUpperCase() || "W"}
          </div>

          {/* Name + Arrow (hidden on very small screens) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {displayName}
            </span>
            <FiChevronDown
              className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              size={14}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 z-10 md:hidden"
              onClick={() => setOpen(false)}
            />

            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transform origin-top-right transition-all duration-200 scale-100">
              {/* User Info */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {user?.email || "worker@civicflow.com"}
                </p>
              </div>

              {/* Logout Action */}
              <div className="py-2">
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setOpen(false);
                  }}
                  className="w-full px-5 py-3 text-left flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-150"
                >
                  <FiLogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default WorkerNavbar;