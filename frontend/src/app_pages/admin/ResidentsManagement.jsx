// src/app_pages/admin/ResidentsManagement.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ResidentsManagement = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);           // Now showing ALL rooms when editing
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    floor: "",
    roomNumber: "",
    contactNumber: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch buildings
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await API.get("/buildings");
        setBuildings(res.data || []);
      } catch {
        toast.error("Failed to load building blocks");
      }
    };
    fetchBuildings();
  }, []);

  // Fetch residents
  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/residents");
      setResidents(res.data.data || []);
      setFilteredResidents(res.data.data || []);
    } catch {
      toast.error("Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  // When block changes → set floors
  useEffect(() => {
    if (!selectedBlock) {
      setFloors([]);
      setRooms([]);
      return;
    }

    const building = buildings.find((b) => b.block === selectedBlock);
    if (building) {
      const floorList = Array.from({ length: building.totalFloors }, (_, i) => i + 1);
      setFloors(floorList);
    }
  }, [selectedBlock, buildings]);

  // When floor changes → load ALL rooms (not just available)
  // When floor changes OR edit mode starts → load appropriate rooms
useEffect(() => {
  if (!selectedBlock || !formData.floor) {
    setRooms([]);
    return;
  }

  const loadRooms = async () => {
    try {
      let url = `/buildings/available-rooms?block=${selectedBlock}&floor=${formData.floor}`;

      // In edit mode → use the special endpoint and pass current resident id
      if (editingId) {
        url = `/buildings/available-rooms-for-edit?block=${selectedBlock}&floor=${formData.floor}&excludeResidentId=${editingId}`;
      }

      const res = await API.get(url);
      setRooms(res.data.rooms || []);
    } catch (err) {
      toast.error("Failed to load rooms");
      setRooms([]);
    }
  };

  loadRooms();
}, [selectedBlock, formData.floor, editingId]);   // ← important: depend on editingId too

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlock) return toast.error("Please select a block");

    const payload = {
      ...formData,
      block: selectedBlock,
    };

    try {
      if (editingId) {
        await API.put(`/admin/residents/${editingId}`, payload);
        toast.success("Resident updated successfully");
      } else {
        if (!formData.password?.trim()) {
          return toast.error("Password is required when adding a new resident");
        }
        await API.post("/admin/residents", payload);
        toast.success("Resident added successfully");
      }
      resetForm();
      fetchResidents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (resident) => {
    const profile = resident.profile || {};
    setSelectedBlock(profile.block || "");
    setFormData({
      username: resident.username || "",
      email: resident.email || "",
      password: "", // never prefill password
      floor: profile.floor || "",
      roomNumber: profile.roomNumber || "",
      contactNumber: profile.contactNumber || "",
    });
    setEditingId(resident._id);
    // floors & rooms will auto-populate via useEffect
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resident permanently?")) return;
    try {
      await API.delete(`/admin/residents/${id}`);
      toast.success("Resident deleted");
      fetchResidents();
    } catch {
      toast.error("Failed to delete resident");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      floor: "",
      roomNumber: "",
      contactNumber: "",
    });
    setSelectedBlock("");
    setEditingId(null);
  };

  // Client-side search by email
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredResidents(residents);
      return;
    }
    const filtered = residents.filter((r) =>
      r.email?.toLowerCase().includes(term)
    );
    setFilteredResidents(filtered);
  }, [searchTerm, residents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Resident Management
        </h2>
        {editingId && (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition shadow-sm"
          >
            <FaTimes /> Cancel Edit
          </button>
        )}
      </div>

      {/* Form Card - Add / Edit */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {editingId ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-green-600" />}
            {editingId ? "Edit Resident" : "Add New Resident"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span className="text-red-500 text-xs">(required for new)</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Block
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            >
              <option value="">Select Block</option>
              {buildings.map((b) => (
                <option key={b._id || b.block} value={b.block}>
                  {b.block}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Floor
            </label>
            <select
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
              disabled={!selectedBlock}
            >
              <option value="">Select Floor</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room Number
            </label>
            <select
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
              disabled={!formData.floor}
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-md"
            >
              {editingId ? "Update Resident" : "Add Resident"}
            </button>
          </div>
        </form>
      </div>

      {/* Residents Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            All Residents ({filteredResidents.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Flat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No residents found {searchTerm ? "matching your search" : ""}
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => {
                  const p = resident.profile || {};
                  const flat = p.block && p.floor && p.roomNumber ? `${p.block}-${p.floor}-${p.roomNumber}` : "—";
                  return (
                    <tr key={resident._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {resident.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {resident.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {flat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {p.contactNumber || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(resident)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(resident._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentsManagement;



// // src/app_pages/admin/ResidentsManagement.jsx
// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";

// const ResidentsManagement = () => {
//   const [residents, setResidents] = useState([]);
//   const [filteredResidents, setFilteredResidents] = useState([]);
//   const [buildings, setBuildings] = useState([]);
//   const [selectedBlock, setSelectedBlock] = useState("");
//   const [floors, setFloors] = useState([]);
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     floor: "",
//     roomNumber: "",
//     contactNumber: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Fetch buildings for block dropdown
//   useEffect(() => {
//     const fetchBuildings = async () => {
//       try {
//         const res = await API.get("/buildings");
//         setBuildings(res.data);
//       } catch (err) {
//         toast.error("Failed to load buildings");
//       }
//     };
//     fetchBuildings();
//   }, []);

//   // Fetch residents
//   useEffect(() => {
//     fetchResidents();
//   }, []);

//   const fetchResidents = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/admin/residents");
//       setResidents(res.data.data);
//       setFilteredResidents(res.data.data);
//     } catch (err) {
//       toast.error("Failed to load residents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // On block change, set floors
//   useEffect(() => {
//     if (selectedBlock) {
//       const building = buildings.find((b) => b.block === selectedBlock);
//       if (building) {
//         setFloors(Array.from({ length: building.totalFloors }, (_, i) => i + 1));
//       }
//     } else {
//       setFloors([]);
//     }
//     setFormData({ ...formData, floor: "", roomNumber: "" });
//     setAvailableRooms([]);
//   }, [selectedBlock]);

//   // On floor change, fetch available rooms
//   useEffect(() => {
//     if (selectedBlock && formData.floor) {
//       const fetchAvailableRooms = async () => {
//         try {
//           const res = await API.get(
//             `/buildings/available-rooms?block=${selectedBlock}&floor=${formData.floor}`
//           );
//           setAvailableRooms(res.data.rooms);
//         } catch (err) {
//           toast.error("Failed to load available rooms");
//         }
//       };
//       fetchAvailableRooms();
//     }
//   }, [selectedBlock, formData.floor]);

//   // Handle form submit (add or update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...formData, block: selectedBlock };
//       if (editingId) {
//         await API.put(`/admin/residents/${editingId}`, payload);
//         toast.success("Resident updated");
//       } else {
//         if (!formData.password) {
//           return toast.error("Password is required for new residents");
//         }
//         await API.post("/admin/residents", payload);
//         toast.success("Resident added");
//       }
//       resetForm();
//       fetchResidents();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   // Handle edit click
//   const handleEdit = (resident) => {
//     setSelectedBlock(resident.profile.block);
//     setFormData({
//       username: resident.username,
//       email: resident.email,
//       password: "", // Password not editable here
//       floor: resident.profile.floor,
//       roomNumber: resident.profile.roomNumber,
//       contactNumber: resident.profile.contactNumber,
//     });
//     setEditingId(resident._id);
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this resident?")) {
//       try {
//         await API.delete(`/admin/residents/${id}`);
//         toast.success("Resident deleted");
//         fetchResidents();
//       } catch (err) {
//         toast.error("Error deleting resident");
//       }
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       username: "",
//       email: "",
//       password: "",
//       floor: "",
//       roomNumber: "",
//       contactNumber: "",
//     });
//     setSelectedBlock("");
//     setEditingId(null);
//   };

//   // Handle search
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = residents.filter((r) =>
//         r.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredResidents(filtered);
//     } else {
//       setFilteredResidents(residents);
//     }
//   }, [searchTerm, residents]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold">Manage Residents</h2>

//       {/* Top Section: Add/Edit Form */}
//       <div className="bg-white p-6 rounded shadow">
//         <h3 className="text-lg font-semibold mb-4">
//           {editingId ? "Edit Resident" : "Add New Resident"}
//         </h3>
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Username"
//             value={formData.username}
//             onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="p-2 border rounded"
//             required
//           />
//           {!editingId && (
//             <input
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               className="p-2 border rounded"
//               required
//             />
//           )}
//           <select
//             value={selectedBlock}
//             onChange={(e) => setSelectedBlock(e.target.value)}
//             className="p-2 border rounded"
//             required
//           >
//             <option value="">Select Block</option>
//             {buildings.map((b) => (
//               <option key={b._id} value={b.block}>
//                 {b.block}
//               </option>
//             ))}
//           </select>
//           <select
//             value={formData.floor}
//             onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
//             className="p-2 border rounded"
//             required
//             disabled={!selectedBlock}
//           >
//             <option value="">Select Floor</option>
//             {floors.map((f) => (
//               <option key={f} value={f}>
//                 {f}
//               </option>
//             ))}
//           </select>
//           <select
//             value={formData.roomNumber}
//             onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
//             className="p-2 border rounded"
//             required
//             disabled={!formData.floor}
//           >
//             <option value="">Select Room</option>
//             {availableRooms.map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="Contact Number"
//             value={formData.contactNumber}
//             onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
//             className="p-2 border rounded"
//             required
//           />
//           <button type="submit" className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded">
//             {editingId ? "Update Resident" : "Add Resident"}
//           </button>
//         </form>
//         {editingId && (
//           <button
//             onClick={resetForm}
//             className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Cancel Edit
//           </button>
//         )}
//       </div>

//       {/* Bottom Section: Residents List with Search */}
//       <div className="bg-white rounded shadow p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Residents List</h3>
//           <input
//             type="text"
//             placeholder="Search by Email"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="p-2 border rounded w-1/3"
//           />
//         </div>
//         {filteredResidents.length === 0 ? (
//           <p>No residents found.</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-left">
//                 <th className="py-2">Username</th>
//                 <th>Email</th>
//                 <th>Block</th>
//                 <th>Floor</th>
//                 <th>Room</th>
//                 <th>Contact</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredResidents.map((r) => (
//                 <tr key={r._id} className="border-b">
//                   <td className="py-2">{r.username}</td>
//                   <td>{r.email}</td>
//                   <td>{r.profile?.block || "N/A"}</td>
//                   <td>{r.profile?.floor || "N/A"}</td>
//                   <td>{r.profile?.roomNumber || "N/A"}</td>
//                   <td>{r.profile?.contactNumber || "N/A"}</td>
//                   <td className="flex gap-2">
//                     <button onClick={() => handleEdit(r)} className="text-blue-500">
//                       <FaEdit />
//                     </button>
//                     <button onClick={() => handleDelete(r._id)} className="text-red-500">
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResidentsManagement;