import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiCheckCircle, FiClock } from "react-icons/fi";

const WorkerSidebar = () => {
  const links = [
    { name: "Dashboard", path: "/worker", icon: <FiHome /> },
    { name: "My Tasks", path: "/worker/tasks", icon: <FiClock /> },
    { name: "Completed Tasks", path: "/worker/completed", icon: <FiCheckCircle /> },
  ];

  return (
    <aside className="bg-white shadow-lg w-64 hidden md:flex flex-col p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Worker Panel</h2>
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.name === "Dashboard"} // Only Dashboard uses exact matching
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 transition ${
                isActive ? "bg-blue-100 font-semibold" : "text-gray-700"
              }`
            }
          >
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default WorkerSidebar;