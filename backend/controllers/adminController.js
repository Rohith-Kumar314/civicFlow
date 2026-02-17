const User = require("../models/User");
const Complaint = require("../models/Complaint");
const WorkerProfile = require("../models/WorkerProfile");


// Add these requires if not already present
const ResidentProfile = require("../models/ResidentProfiles"); // Note: Matching your filename
const Building = require("../models/Building");
const bcrypt = require("bcryptjs");

// Get all residents
exports.getResidents = async (req, res) => {
  try {
    const users = await User.find({ role: "resident" }).select("-password");
    const residents = await Promise.all(
      users.map(async (user) => {
        const profile = await ResidentProfile.findOne({ user: user._id });
        return { ...user.toObject(), profile: profile || null };
      })
    );
    res.json({ success: true, data: residents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new resident
exports.addResident = async (req, res) => {
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

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate block
    const building = await Building.findOne({ block });
    if (!building) {
      return res.status(400).json({ message: "Invalid block" });
    }

    // Validate floor and room
    if (floor < 1 || floor > building.totalFloors) {
      return res.status(400).json({ message: "Invalid floor number" });
    }
    if (roomNumber < 1 || roomNumber > building.roomsPerFloor) {
      return res.status(400).json({ message: "Invalid room number" });
    }

    // Check room occupancy
    const occupied = await ResidentProfile.findOne({ block, floor, roomNumber });
    if (occupied) {
      return res.status(400).json({ message: "Room already occupied" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "resident",
    });

    // Create profile
    await ResidentProfile.create({
      user: user._id,
      block,
      floor,
      roomNumber,
      contactNumber,
    });

    res.status(201).json({ success: true, message: "Resident added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update resident
exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      block,
      floor,
      roomNumber,
      contactNumber,
    } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user || user.role !== "resident") {
      return res.status(404).json({ message: "Resident not found" });
    }

    // Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    // Find profile
    const profile = await ResidentProfile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Prepare new values (use existing if not provided)
    const newBlock = block || profile.block;
    const newFloor = floor || profile.floor;
    const newRoomNumber = roomNumber || profile.roomNumber;
    const newContactNumber = contactNumber || profile.contactNumber;

    // If room details changed, validate
    if (
      newBlock !== profile.block ||
      newFloor !== profile.floor ||
      newRoomNumber !== profile.roomNumber
    ) {
      const building = await Building.findOne({ block: newBlock });
      if (!building) {
        return res.status(400).json({ message: "Invalid block" });
      }
      if (newFloor < 1 || newFloor > building.totalFloors) {
        return res.status(400).json({ message: "Invalid floor number" });
      }
      if (newRoomNumber < 1 || newRoomNumber > building.roomsPerFloor) {
        return res.status(400).json({ message: "Invalid room number" });
      }
      const occupied = await ResidentProfile.findOne({
        block: newBlock,
        floor: newFloor,
        roomNumber: newRoomNumber,
      });
      if (occupied) {
        return res.status(400).json({ message: "Room already occupied" });
      }
    }

    // Update profile
    profile.block = newBlock;
    profile.floor = newFloor;
    profile.roomNumber = newRoomNumber;
    profile.contactNumber = newContactNumber;
    await profile.save();

    res.json({ success: true, message: "Resident updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete resident
exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user || user.role !== "resident") {
      return res.status(404).json({ message: "Resident not found" });
    }

    await ResidentProfile.deleteOne({ user: id });

    res.json({ success: true, message: "Resident deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalResidents = await User.countDocuments({ role: "resident" });
    const activeWorkers = await User.countDocuments({ role: "worker" });

    const openComplaints = await Complaint.countDocuments({
      status: { $in: ["Pending", "Accepted", "In Progress"] },
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: "Completed",
    });

    const recentComplaints = await Complaint.find()
      .populate("resident", "name username")
      .populate("worker", "name username")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalResidents,
        activeWorkers,
        openComplaints,
        resolvedComplaints,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Worker

// Get all workers
exports.getWorkers = async (req, res) => {
  try {
    const users = await User.find({ role: "worker" }).select("-password");
    const workers = await Promise.all(
      users.map(async (user) => {
        const profile = await WorkerProfile.findOne({ user: user._id });
        return { ...user.toObject(), profile: profile || null };
      })
    );
    res.json({ success: true, data: workers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new worker
exports.addWorker = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      department,
      contactNumber,
      assignedBlocks = [],
    } = req.body;

    // Validate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate department (enum match)
    const validDepts = ["Electrician", "Plumber", "Carpenter", "Technical", "Other"];
    if (!validDepts.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    // Optional: Validate assignedBlocks exist (if you want strict check)
    // For now we allow any string blocks – you can add Building.exists() if needed

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "worker",
    });

    await WorkerProfile.create({
      user: user._id,
      department,
      assignedBlocks,
      contactNumber,
    });

    res.status(201).json({ success: true, message: "Worker added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update worker
exports.updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      department,
      contactNumber,
      assignedBlocks = [],
    } = req.body;

    const user = await User.findById(id);
    if (!user || user.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    const profile = await WorkerProfile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (department) {
      const validDepts = ["Electrician", "Plumber", "Carpenter", "Technical", "Other"];
      if (!validDepts.includes(department)) {
        return res.status(400).json({ message: "Invalid department" });
      }
      profile.department = department;
    }

    profile.assignedBlocks = assignedBlocks;
    profile.contactNumber = contactNumber || profile.contactNumber;
    await profile.save();

    res.json({ success: true, message: "Worker updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete worker
exports.deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await WorkerProfile.deleteOne({ user: id });
    res.json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// Complaint Related,,
// Get all complaints with filters
exports.getComplaints = async (req, res) => {
  try {
    const { status, department, block, residentName, workerName } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (block) filter.block = block;

    if (residentName) {
      const residents = await User.find({
        role: "resident",
        username: { $regex: residentName, $options: "i" },
      }).select("_id");
      if (residents.length > 0) {
        filter.resident = { $in: residents.map((r) => r._id) };
      } else {
        return res.json({ success: true, data: [] }); // No match
      }
    }

    if (workerName) {
      const workers = await User.find({
        role: "worker",
        username: { $regex: workerName, $options: "i" },
      }).select("_id");
      if (workers.length > 0) {
        filter.worker = { $in: workers.map((w) => w._id) };
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    const complaints = await Complaint.find(filter)
      .populate("resident", "username")
      .populate("worker", "username")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new complaint (admin creates on behalf of resident)
exports.addComplaint = async (req, res) => {
  try {
    const {
      residentId,
      department,
      title,
      description,
      block,
      floor,
      roomNumber,
      images = [],
    } = req.body;

    // Validate resident exists
    const resident = await User.findById(residentId);
    if (!resident || resident.role !== "resident") {
      return res.status(400).json({ message: "Invalid resident" });
    }

    // Validate block/floor/room (similar to residents add)
    const building = await Building.findOne({ block });
    if (!building) return res.status(400).json({ message: "Invalid block" });
    if (floor < 1 || floor > building.totalFloors) {
      return res.status(400).json({ message: "Invalid floor" });
    }
    if (roomNumber < 1 || roomNumber > building.roomsPerFloor) {
      return res.status(400).json({ message: "Invalid room number" });
    }

    // Optional: Check if room matches resident's profile (but admin might override)

    const complaint = await Complaint.create({
      resident: residentId,
      department,
      title,
      description,
      block,
      floor: Number(floor),
      roomNumber: Number(roomNumber),
      images,
      status: "Pending",
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update complaint (e.g., assign worker, change status, edit details)
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      workerId,
      status,
      title,
      description,
      department,
      block,
      floor,
      roomNumber,
      images,
    } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update fields if provided
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (department) complaint.department = department;
    if (block) complaint.block = block;
    if (floor) complaint.floor = Number(floor);
    if (roomNumber) complaint.roomNumber = Number(roomNumber);
    if (images) complaint.images = images;

    if (status) {
      const validStatuses = ["Pending", "Accepted", "In Progress", "Completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      complaint.status = status;
      if (status === "Accepted") complaint.acceptedAt = new Date();
      if (status === "Completed") complaint.completedAt = new Date();
    }

    if (workerId) {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== "worker") {
        return res.status(400).json({ message: "Invalid worker" });
      }
      complaint.worker = workerId;
    }

    await complaint.save();
    res.json({ success: true, message: "Complaint updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await Complaint.findByIdAndDelete(id);
    res.json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all buildings (already exists, but for completeness)
exports.getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json({ success: true, data: buildings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add building
exports.addBuilding = async (req, res) => {
  try {
    const { block, totalFloors, roomsPerFloor } = req.body;
    const existing = await Building.findOne({ block });
    if (existing) return res.status(400).json({ message: "Block already exists" });

    const building = await Building.create({ block, totalFloors, roomsPerFloor });
    res.status(201).json({ success: true, data: building });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update building
exports.updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { block, totalFloors, roomsPerFloor } = req.body;
    const building = await Building.findByIdAndUpdate(id, { block, totalFloors, roomsPerFloor }, { new: true });
    if (!building) return res.status(404).json({ message: "Building not found" });
    res.json({ success: true, data: building });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete building
exports.deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    // Optional: Check if occupied before delete
    const occupied = await ResidentProfile.findOne({ block: (await Building.findById(id)).block });
    if (occupied) return res.status(400).json({ message: "Cannot delete occupied block" });

    await Building.findByIdAndDelete(id);
    res.json({ success: true, message: "Building deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};