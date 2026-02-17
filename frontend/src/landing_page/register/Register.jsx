import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    username: "",
    email: "",
    password: "",
    block: "",
    floor: "",
    roomNumber: "",
    contactNumber: "",
  };

  const [form, setForm] = useState(initialFormState);

  // Fetch buildings
  useEffect(() => {
    API.get("/buildings")
      .then((res) => setBuildings(res.data))
      .catch(() => toast.error("Failed to load buildings"));
  }, []);

  // When block changes
  useEffect(() => {
    if (!form.block) return;

    const building = buildings.find((b) => b.block === form.block);

    if (building) {
      setFloors(
        Array.from({ length: building.totalFloors }, (_, i) => i + 1)
      );

      setRooms([]);
      setForm((prev) => ({
        ...prev,
        floor: "",
        roomNumber: "",
      }));
    }
  }, [form.block, buildings]);

  // Fetch rooms
  useEffect(() => {
    if (!form.block || !form.floor) return;

    API.get(
      `/buildings/available-rooms?block=${form.block}&floor=${form.floor}`
    )
      .then((res) => setRooms(res.data.rooms))
      .catch(() => toast.error("Failed to load rooms"));
  }, [form.block, form.floor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);

      // ✅ Show Success Toast
      toast.success(
        "🎉 Registration successful! Please login to continue."
      );

      // ✅ Clear form
      setForm(initialFormState);
      setFloors([]);
      setRooms([]);

      // ✅ Redirect to Home after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Join <span className="text-blue-600">CivicFlow</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Create your resident account and manage complaints seamlessly.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Resident Registration
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Username"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="block"
                value={form.block}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Select Block</option>
                {buildings.map((b) => (
                  <option key={b._id} value={b.block}>
                    Block {b.block}
                  </option>
                ))}
              </select>

              <select
                name="floor"
                value={form.floor}
                onChange={handleChange}
                required
                disabled={!floors.length}
                className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100"
              >
                <option value="">Select Floor</option>
                {floors.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>

              <select
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                required
                disabled={!rooms.length}
                className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100"
              >
                <option value="">Select Room</option>
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    Room {r}
                  </option>
                ))}
              </select>

              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                placeholder="Contact Number"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
