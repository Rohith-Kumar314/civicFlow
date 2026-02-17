// src/app_pages/resident/ResidentDashboard.jsx
import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const ResidentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/complaints/my-complaints");
        setComplaints(res.data.data);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Metrics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter(
    (c) => c.status === "Completed"
  ).length;

  const metrics = [
    {
      title: "Total Complaints",
      value: total,
      icon: <FiAlertCircle className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      title: "Pending",
      value: pending,
      icon: <FiClock className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: <FiCheckCircle className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-green-400 to-green-600",
    },
  ];

  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, Resident!
      </h1>

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`flex items-center p-6 rounded-xl shadow-lg ${metric.color} text-white hover:scale-105 transition`}
          >
            <div className="mr-4">{metric.icon}</div>
            <div>
              <p className="text-xl font-semibold">{metric.value}</p>
              <p className="text-sm">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RECENT COMPLAINTS ================= */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Complaints
        </h2>

        {complaints.length === 0 ? (
          <p className="text-gray-500">
            No complaints yet.{" "}
            <Link
              to="/resident/raise-complaint"
              className="text-blue-600 underline"
            >
              Raise your first complaint
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {complaints.slice(0, 5).map((c) => (
              <li
                key={c._id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {c.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {c.department} • {c.block}/{c.floor}/{c.roomNumber}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      c.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;




// // src/app_pages/resident/ResidentDashboard.jsx
// import React from "react";
// import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const ResidentDashboard = ({ recentComplaints = [] }) => {
//   // Sample data for metrics
//   const metrics = [
//     { title: "Total Complaints", value: 25, icon: <FiAlertCircle className="text-3xl text-white" />, color: "bg-gradient-to-r from-blue-500 to-blue-700" },
//     { title: "Pending", value: 8, icon: <FiClock className="text-3xl text-white" />, color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
//     { title: "Resolved", value: 17, icon: <FiCheckCircle className="text-3xl text-white" />, color: "bg-gradient-to-r from-green-400 to-green-600" },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Resident!</h1>

//       {/* Metrics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//         {metrics.map((metric, idx) => (
//           <div key={idx} className={`flex items-center p-6 rounded-xl shadow-lg ${metric.color} text-white hover:scale-105 transition`}>
//             <div className="mr-4">{metric.icon}</div>
//             <div>
//               <p className="text-xl font-semibold">{metric.value}</p>
//               <p className="text-sm">{metric.title}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Complaints */}
//       <div className="bg-white shadow-md rounded-xl p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
//         {recentComplaints.length === 0 ? (
//           <p className="text-gray-500">No complaints yet. <Link to="/resident/raise-complaint" className="text-blue-600 underline">Raise your first complaint</Link></p>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {recentComplaints.slice(0, 5).map((c, idx) => (
//               <li key={idx} className="py-3 flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold text-gray-700">{c.title}</p>
//                   <p className="text-sm text-gray-500">{c.department} • {c.block}/{c.floor}/{c.room}</p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold 
//                   ${c.status === "Resolved" ? "bg-green-100 text-green-700" : c.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
//                   {c.status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResidentDashboard;
