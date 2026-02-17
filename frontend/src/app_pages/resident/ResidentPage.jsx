// src/app_pages/resident/ResidentPage.jsx
import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle } from "react-icons/fi";

// Mock user data (in real app, get from auth/user context)
const mockUser = {
  name: "John Doe",
  block: "B",
  floor: "3",
  room: "305",
};

const ResidentPage = () => {
  // Pre-fill with user data
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  // Complaint form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [images, setImages] = useState([]);

  const [complaints, setComplaints] = useState([]);
  const departments = ["Electrician", "Plumber", "Technical", "Sanitation"];

  useEffect(() => {
    // Pre-fill from user model
    setBlock(mockUser.block);
    setFloor(mockUser.floor);
    setRoom(mockUser.room);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      id: Date.now(),
      title,
      description,
      department,
      images,
      block,
      floor,
      room,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    setComplaints([newComplaint, ...complaints]);

    // Reset form (but keep block/floor/room pre-filled)
    setTitle("");
    setDescription("");
    setDepartment("");
    setImages([]);
  };

  return (
    <div className="p-6 md:p-10 space-y-10">

      {/* ================= RAISE COMPLAINT ================= */}
      <section className="bg-white shadow-lg rounded-xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Raise a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Block No"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Room No"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />

          <textarea
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border rounded"
            rows={4}
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="w-full p-3 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Complaint
          </button>
        </form>
      </section>

      {/* ================= COMPLAINT HISTORY ================= */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Complaints
        </h2>

        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints submitted yet.</p>
        ) : (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-gray-600">{c.description}</p>
                  <p className="text-sm text-gray-500">
                    Department: {c.department} | Location: Block {c.block}, Floor {c.floor}, Room {c.room}
                  </p>
                  {c.images.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {Array.from(c.images).map((img, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(img)}
                          alt="complaint"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <p className={`font-semibold ${c.status === "Resolved" ? "text-green-600" : "text-yellow-600"}`}>
                    {c.status}
                  </p>
                  <p className="text-gray-500 text-sm">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ResidentPage;
