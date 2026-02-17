// src/app_pages/admin/ComplaintsManagement.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Select from "react-select";
import { debounce } from "lodash";

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [residents, setResidents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    residentId: "",
    workerId: "",
    department: "",
    title: "",
    description: "",
    block: "",
    floor: "",
    roomNumber: "",
    status: "Pending",
    images: [], // array of URLs
  });

  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    department: "",
    block: "",
    residentName: "",
    workerName: "",
  });

  const [loading, setLoading] = useState(true);

  const departments = ["Electrician", "Plumber", "Carpenter", "Technical", "Other"];
  const statuses = ["Pending", "Accepted", "In Progress", "Completed"];

  // Fetch supporting data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, workRes, buildRes] = await Promise.all([
          API.get("/admin/residents"),
          API.get("/admin/workers"),
          API.get("/buildings"),
        ]);
        setResidents(resRes.data.data || []);
        setWorkers(workRes.data.data || []);
        setBuildings(buildRes.data || []);
      } catch (err) {
        toast.error("Failed to load supporting data");
      }
    };
    fetchData();
  }, []);

  // Debounced fetch for complaints
  const debouncedFetchComplaints = useMemo(
    () =>
      debounce(async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams(filters).toString();
          const res = await API.get(`/admin/complaints?${params}`);
          setComplaints(res.data.data || []);
        } catch (err) {
          toast.error("Failed to load complaints");
        } finally {
          setLoading(false);
        }
      }, 400),
    [filters]
  );

  useEffect(() => {
    debouncedFetchComplaints();
    return () => debouncedFetchComplaints.cancel();
  }, [debouncedFetchComplaints]);

  // Block → floors
  useEffect(() => {
    const block = formData.block;
    if (block) {
      const building = buildings.find((b) => b.block === block);
      if (building) {
        setFloors(Array.from({ length: building.totalFloors }, (_, i) => i + 1));
      } else {
        setFloors([]);
      }
    } else {
      setFloors([]);
      setRooms([]);
    }
  }, [formData.block, buildings]);

  // Floor → rooms (all rooms for admin)
  useEffect(() => {
    const block = formData.block;
    const floor = formData.floor;
    if (block && floor) {
      const fetchRooms = async () => {
        try {
          const res = await API.get(`/buildings/rooms?block=${block}&floor=${floor}`);
          setRooms(res.data.rooms || []);
        } catch {
          toast.error("Failed to load rooms");
          setRooms([]);
        }
      };
      fetchRooms();
    } else {
      setRooms([]);
    }
  }, [formData.block, formData.floor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/complaints/${editingId}`, formData);
        toast.success("Complaint updated successfully");
      } else {
        await API.post("/admin/complaints", formData);
        toast.success("Complaint created successfully");
      }
      resetForm();
      debouncedFetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (complaint) => {
    setFormData({
      residentId: complaint.resident?._id || "",
      workerId: complaint.worker?._id || "",
      department: complaint.department || "",
      title: complaint.title || "",
      description: complaint.description || "",
      block: complaint.block || "",
      floor: complaint.floor || "",
      roomNumber: complaint.roomNumber || "",
      status: complaint.status || "Pending",
      images: complaint.images || [],
    });
    setEditingId(complaint._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await API.delete(`/admin/complaints/${id}`);
      toast.success("Complaint deleted");
      debouncedFetchComplaints();
    } catch {
      toast.error("Failed to delete complaint");
    }
  };

  const resetForm = () => {
    setFormData({
      residentId: "",
      workerId: "",
      department: "",
      title: "",
      description: "",
      block: "",
      floor: "",
      roomNumber: "",
      status: "Pending",
      images: [],
    });
    setEditingId(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const urls = e.target.value
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
    setFormData({ ...formData, images: urls });
  };

  // Prepare options for react-select
  const residentOptions = residents.map((r) => ({
    value: r._id,
    label: `${r.username} (${r.email})`,
  }));

  const workerOptions = workers.map((w) => ({
    value: w._id,
    label: `${w.username} (${w.profile?.department || "No department"})`,
  }));

  if (loading && complaints.length === 0) {
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
          Complaints Management
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

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {editingId ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-green-600" />}
            {editingId ? "Edit Complaint" : "Add New Complaint"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resident *
            </label>
            <Select
              value={residentOptions.find((opt) => opt.value === formData.residentId) || null}
              onChange={(selected) => setFormData({ ...formData, residentId: selected?.value || "" })}
              options={residentOptions}
              isSearchable
              placeholder="Search resident by name or email..."
              classNamePrefix="react-select"
              isClearable
              required={!editingId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assign Worker (optional)
            </label>
            <Select
              value={workerOptions.find((opt) => opt.value === formData.workerId) || null}
              onChange={(selected) => setFormData({ ...formData, workerId: selected?.value || "" })}
              options={workerOptions}
              isSearchable
              placeholder="Search worker by name or department..."
              classNamePrefix="react-select"
              isClearable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Block *
            </label>
            <select
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            >
              <option value="">Select Block</option>
              {buildings.map((b) => (
                <option key={b.block} value={b.block}>
                  {b.block}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Floor *
            </label>
            <select
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              disabled={!formData.block}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
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
              Room Number *
            </label>
            <select
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: Number(e.target.value) })}
              disabled={!formData.floor}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
              required
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URLs (comma separated, optional)
            </label>
            <input
              type="text"
              value={formData.images.join(", ")}
              onChange={handleImagesChange}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
              {editingId ? "Update Complaint" : "Add Complaint"}
            </button>
          </div>
        </form>
      </div>

      {/* Filters & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            All Complaints ({complaints.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="block"
              value={filters.block}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Blocks</option>
              {buildings.map((b) => (
                <option key={b.block} value={b.block}>
                  {b.block}
                </option>
              ))}
            </select>

            <input
              name="residentName"
              value={filters.residentName}
              onChange={handleFilterChange}
              placeholder="Resident name..."
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="workerName"
              value={filters.workerName}
              onChange={handleFilterChange}
              placeholder="Worker name..."
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {c.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.resident?.username || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.worker?.username || "Not Assigned"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.block ? `${c.block}-${c.floor}-${c.roomNumber}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          c.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : c.status === "In Progress"
                            ? "bg-indigo-100 text-indigo-800"
                            : c.status === "Accepted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsManagement;