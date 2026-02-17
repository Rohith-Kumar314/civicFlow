// src/app_pages/resident/ResidentNavbar.jsx
import React, { useState } from "react";
import { FiMenu, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const ResidentNavbar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Left: Logo / Title + Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden transition"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Resident Dashboard
        </h1>
      </div>

      {/* Right: User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
            {user?.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {user?.username || "Resident"}
            </span>
            <FiChevronDown
              className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {profileOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-10 md:hidden"
              onClick={() => setProfileOpen(false)}
            />

            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transform origin-top-right transition-all duration-200 scale-100">
              {/* User Info Header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.username || "Resident"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {user?.email || ""}
                </p>
              </div>

              {/* Actions */}
              <div className="py-2">
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
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

export default ResidentNavbar;