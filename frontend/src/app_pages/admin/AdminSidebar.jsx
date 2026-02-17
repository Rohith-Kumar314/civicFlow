// src/app_pages/admin/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaUserTie, FaClipboardList, FaCogs, FaFileAlt } from "react-icons/fa";

const AdminSidebar = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaClipboardList />, path: "/admin" },
    { name: "Residents", icon: <FaUsers />, path: "/admin/residents" },
    { name: "Workers", icon: <FaUserTie />, path: "/admin/workers" },
    { name: "Complaints", icon: <FaFileAlt />, path: "/admin/complaints" },
    { name: "Settings", icon: <FaCogs />, path: "/admin/settings" },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} hidden md:flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b dark:border-gray-700">
        {!collapsed && (
          <>
            <h2 className="text-xl font-bold text-blue-600">CivicFlow</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
          </>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition 
                ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
