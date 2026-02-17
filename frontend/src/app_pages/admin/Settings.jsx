// src/app_pages/admin/Settings.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Settings = () => {
  const [buildings, setBuildings] = useState([]);
  const [formData, setFormData] = useState({
    block: "",
    totalFloors: "",
    roomsPerFloor: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/buildings");
      setBuildings(res.data.data || []);
    } catch {
      toast.error("Failed to load buildings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/buildings/${editingId}`, formData);
        toast.success("Building updated");
      } else {
        await API.post("/admin/buildings", formData);
        toast.success("Building added");
      }
      resetForm();
      fetchBuildings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (building) => {
    setFormData({
      block: building.block,
      totalFloors: building.totalFloors,
      roomsPerFloor: building.roomsPerFloor,
    });
    setEditingId(building._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this building? Ensure no residents!")) {
      try {
        await API.delete(`/admin/buildings/${id}`);
        toast.success("Building deleted");
        fetchBuildings();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error");
      }
    }
  };

  const resetForm = () => {
    setFormData({ block: "", totalFloors: "", roomsPerFloor: "" });
    setEditingId(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>

      {/* Manage Buildings Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {editingId ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-green-600" />}
            {editingId ? "Edit Building" : "Add New Building"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Block Name</label>
            <input
              type="text"
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Floors</label>
            <input
              type="number"
              min="1"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rooms per Floor</label>
            <input
              type="number"
              min="1"
              value={formData.roomsPerFloor}
              onChange={(e) => setFormData({ ...formData, roomsPerFloor: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{editingId ? "Update" : "Add"} Building</button>
          </div>
        </form>
      </div>

      {/* Buildings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">All Buildings ({buildings.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Floors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms per Floor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {buildings.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">No buildings</td></tr>
              ) : (
                buildings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{b.block}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.totalFloors}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.roomsPerFloor}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(b)} className="text-blue-600 hover:text-blue-800 mr-4"><FaEdit size={18} /></button>
                      <button onClick={() => handleDelete(b._id)} className="text-red-600 hover:text-red-800"><FaTrash size={18} /></button>
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

export default Settings;