import { Outlet } from "react-router-dom";
import ResidentSidebar from "./ResidentSidebar";
import ResidentNavbar from "./ResidentNavbar";
import { useState } from "react";

const ResidentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ResidentSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <ResidentNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-6 md:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResidentLayout;
