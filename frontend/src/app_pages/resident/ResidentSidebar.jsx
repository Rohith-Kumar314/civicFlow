// src/app_pages/resident/ResidentSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiEdit, FiList } from "react-icons/fi";

const ResidentSidebar = ({ collapsed }) => {
  const linkClasses = "flex items-center gap-3 p-3 rounded hover:bg-gray-200";

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} hidden md:flex flex-col`}
    >
      <div className="p-6 border-b">
        {!collapsed && (
          <>
            <h2 className="text-xl font-bold text-blue-600">CivicFlow</h2>
            <p className="text-xs text-gray-500">Resident Panel</p>
          </>
        )}
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        <NavLink to="/resident/dashboard" className={linkClasses}>
          <FiHome />
          {!collapsed && "Dashboard"}
        </NavLink>
        <NavLink to="/resident/raise-complaint" className={linkClasses}>
          <FiEdit />
          {!collapsed && "Raise Complaint"}
        </NavLink>
        <NavLink to="/resident/complaint-history" className={linkClasses}>
          <FiList />
          {!collapsed && "Complaint History"}
        </NavLink>
      </nav>
    </aside>
  );
};

export default ResidentSidebar;
