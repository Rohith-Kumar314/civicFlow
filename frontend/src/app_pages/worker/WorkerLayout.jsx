import { Outlet } from "react-router-dom";
import WorkerNavbar from "./WorkerNavbar";
import WorkerSidebar from "./WorkerSidebar";
import { useAuth } from "../../context/AuthContext";

const WorkerLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <WorkerSidebar />

      <div className="flex-1 flex flex-col">
        <WorkerNavbar
          workerName={user?.username}
          onLogout={logout}
        />

        <main className="p-6 overflow-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;


// // src/app_pages/worker/WorkerLayout.jsx
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import WorkerNavbar from "./WorkerNavbar";
// import WorkerSidebar from "./WorkerSidebar";

// const WorkerLayout = ({ worker }) => {
//   const handleLogout = () => {
//     console.log("Logout clicked");
//     // implement logout logic here
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <WorkerSidebar />
//       <div className="flex-1 flex flex-col">
//         <WorkerNavbar workerName={worker.name} onLogout={handleLogout} />
//         <main className="p-6 overflow-auto flex-1">
//           <Outlet context={{ worker }} />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default WorkerLayout;
