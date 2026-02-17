const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ResidentProfile = require("../models/ResidentProfiles");
const Building = require("../models/Building");
const generateToken = require("../utils/generateToken");


// ================= REGISTER RESIDENT =================
exports.registerResident = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      block,
      floor,
      roomNumber,
      contactNumber,
    } = req.body;

    // 1️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2️⃣ Validate block exists
    const building = await Building.findOne({ block });
    if (!building) {
      return res.status(400).json({ message: "Invalid block" });
    }

    // 3️⃣ Validate floor
    if (floor > building.totalFloors || floor < 1) {
      return res.status(400).json({ message: "Invalid floor number" });
    }

    // 4️⃣ Validate room number
    if (roomNumber > building.roomsPerFloor || roomNumber < 1) {
      return res.status(400).json({ message: "Invalid room number" });
    }

    // 5️⃣ Check room occupancy
    const occupied = await ResidentProfile.findOne({
      block,
      floor,
      roomNumber,
    });

    if (occupied) {
      return res.status(400).json({
        message: "Room already occupied",
      });
    }

    // 6️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7️⃣ Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "resident",
    });

    // 8️⃣ Create resident profile
    await ResidentProfile.create({
      user: user._id,
      block,
      floor,
      roomNumber,
      contactNumber,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Resident registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CENTRALIZED LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET CURRENT USER =================
exports.getMe = async (req, res) => {
  res.json({
    user: req.user,
  });
};
