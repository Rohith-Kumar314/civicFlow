// src/app_pages/resident/RaiseComplaint.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const RaiseComplaint = () => {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "Electrician",
    block: "",
    floor: "",
    roomNumber: "",
    images: [],
  });

  const departments = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Technical",
    "Other",
  ];

  // ================= LOAD BUILDINGS =================
  useEffect(() => {
    API.get("/buildings")
      .then((res) => setBuildings(res.data))
      .catch(() => toast.error("Failed to load buildings"));
  }, []);

  // ================= BLOCK CHANGE =================
  const handleBlockChange = (e) => {
    const block = e.target.value;
    const building = buildings.find((b) => b.block === block);

    const floorList = [];
    for (let i = 1; i <= building.totalFloors; i++) {
      floorList.push(i);
    }

    setFloors(floorList);
    setRooms([]);

    setForm({
      ...form,
      block,
      floor: "",
      roomNumber: "",
    });
  };

  // ================= FLOOR CHANGE =================
  const handleFloorChange = async (e) => {
    const floor = e.target.value;

    try {
      const res = await API.get(
        `/buildings/rooms?block=${form.block}&floor=${floor}`
      );

      setRooms(res.data.rooms);
      setForm({ ...form, floor, roomNumber: "" });
    } catch {
      toast.error("Failed to load rooms");
    }
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images") data.append(key, value);
      });

      form.images.forEach((img) => data.append("images", img));

      await API.post("/complaints/raise", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Complaint raised successfully");

      setForm({
        title: "",
        description: "",
        department: "Electrician",
        block: "",
        floor: "",
        roomNumber: "",
        images: [],
      });

      setFloors([]);
      setRooms([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Raise a Complaint
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Complaint Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border rounded-lg p-3"
        />

        <textarea
          placeholder="Describe the issue"
          required
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border rounded-lg p-3"
        />

        <select
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
          className="w-full border rounded-lg p-3"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-3">
          <select
            value={form.block}
            onChange={handleBlockChange}
            required
            className="border rounded-lg p-3"
          >
            <option value="">Block</option>
            {buildings.map((b) => (
              <option key={b.block}>{b.block}</option>
            ))}
          </select>

          <select
            value={form.floor}
            onChange={handleFloorChange}
            required
            disabled={!floors.length}
            className="border rounded-lg p-3"
          >
            <option value="">Floor</option>
            {floors.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <select
            value={form.roomNumber}
            onChange={(e) =>
              setForm({ ...form, roomNumber: e.target.value })
            }
            required
            disabled={!rooms.length}
            className="border rounded-lg p-3"
          >
            <option value="">Room</option>
            {rooms.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default RaiseComplaint;


// // src/app_pages/resident/RaiseComplaint.jsx
// import React, { useState } from "react";
// import { toast } from "react-toastify"; // optional for notifications

// const RaiseComplaint = () => {
//   const [complaint, setComplaint] = useState({
//     title: "",
//     description: "",
//     department: "Electrician",
//     images: [],
//     block: "",
//     floor: "",
//     room: "",
//   });

//   const departments = ["Electrician", "Plumber", "Technical", "Cleaning", "Gardening", "Security", "IT & Wi-Fi"];

//   const handleChange = (e) => {
//     setComplaint({ ...complaint, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setComplaint({ ...complaint, images: Array.from(e.target.files) });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you can send complaint to API
//     console.log("Submitting complaint:", complaint);
//     toast.success("Complaint submitted successfully!");
//     setComplaint({ title: "", description: "", department: "Electrician", images: [], block: "", floor: "", room: "" });
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Raise a Complaint</h1>

//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
//         <div>
//           <label className="block font-semibold text-gray-700">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={complaint.title}
//             onChange={handleChange}
//             required
//             className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700">Description</label>
//           <textarea
//             name="description"
//             value={complaint.description}
//             onChange={handleChange}
//             required
//             rows={4}
//             className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700">Department</label>
//           <select
//             name="department"
//             value={complaint.department}
//             onChange={handleChange}
//             className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//           >
//             {departments.map((d) => <option key={d} value={d}>{d}</option>)}
//           </select>
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700">Block / Floor / Room</label>
//           <div className="grid grid-cols-3 gap-2 mt-1">
//             <input type="text" name="block" value={complaint.block} onChange={handleChange} placeholder="Block" className="border-gray-300 rounded-lg p-2" required />
//             <input type="text" name="floor" value={complaint.floor} onChange={handleChange} placeholder="Floor" className="border-gray-300 rounded-lg p-2" required />
//             <input type="text" name="room" value={complaint.room} onChange={handleChange} placeholder="Room" className="border-gray-300 rounded-lg p-2" required />
//           </div>
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700">Upload Images (Optional)</label>
//           <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1" />
//         </div>

//         <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
//           Submit Complaint
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RaiseComplaint;
