// src/app_pages/admin/AdminNavbar.jsx
import React, { useState } from "react";
import { FaBell, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Left: Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
        Admin Dashboard
      </h1>

      {/* Right: Profile + Notification (future) */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell (placeholder - can be functional later) */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative"
          aria-label="Notifications"
        >
          <FaBell size={20} />
          {/* Example notification badge */}
          {/* <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span> */}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm text-lg">
              {user?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* Name + Arrow (hidden on very small screens) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {user?.username || "Admin"}
              </span>
              <FaChevronDown
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
                    {user?.username || "Administrator"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {user?.email || "admin@civicflow.com"}
                  </p>
                </div>

                {/* Logout Action */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-150"
                  >
                    <FaSignOutAlt size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;