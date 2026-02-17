const Building = require("../models/Building");
const ResidentProfile = require("../models/ResidentProfiles");

// ================= GET ALL BUILDINGS =================
exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().select(
      "block totalFloors roomsPerFloor"
    );
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET AVAILABLE ROOMS =================
exports.getAvailableRooms = async (req, res) => {
  try {
    const { block, floor } = req.query;

    if (!block || !floor) {
      return res.status(400).json({
        message: "Block and floor are required",
      });
    }

    // 1️⃣ Check building exists
    const building = await Building.findOne({ block });
    if (!building) {
      return res.status(400).json({ message: "Invalid block" });
    }

    // 2️⃣ Validate floor
    if (floor < 1 || floor > building.totalFloors) {
      return res.status(400).json({ message: "Invalid floor" });
    }

    // 3️⃣ Get occupied rooms
    const occupiedRooms = await ResidentProfile.find({
      block,
      floor,
    }).select("roomNumber");

    const occupiedSet = new Set(
      occupiedRooms.map((r) => r.roomNumber)
    );

    // 4️⃣ Generate available rooms
    const availableRooms = [];
    for (let i = 1; i <= building.roomsPerFloor; i++) {
      if (!occupiedSet.has(i)) {
        availableRooms.push(i);
      }
    }

    res.json({ rooms: availableRooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL ROOMS (FOR COMPLAINTS) =================
exports.getAllRoomsByFloor = async (req, res) => {
  try {
    const { block, floor } = req.query;

    if (!block || !floor) {
      return res.status(400).json({
        message: "Block and floor are required",
      });
    }

    const building = await Building.findOne({ block });
    if (!building) {
      return res.status(400).json({ message: "Invalid block" });
    }

    const floorNumber = parseInt(floor);

    if (floorNumber < 1 || floorNumber > building.totalFloors) {
      return res.status(400).json({ message: "Invalid floor" });
    }

    const rooms = [];
    for (let i = 1; i <= building.roomsPerFloor; i++) {
      rooms.push(i);
    }

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// NEW FUNCTION - returns available rooms + optionally the current resident's room
exports.getAvailableRoomsForEdit = async (req, res) => {
  try {
    const { block, floor, excludeResidentId } = req.query;

    if (!block || !floor) {
      return res.status(400).json({ message: "Block and floor are required" });
    }

    const building = await Building.findOne({ block });
    if (!building) {
      return res.status(400).json({ message: "Invalid block" });
    }

    const floorNum = parseInt(floor);
    if (floorNum < 1 || floorNum > building.totalFloors) {
      return res.status(400).json({ message: "Invalid floor" });
    }

    // Get all occupied rooms on this floor/block
    const occupiedQuery = { block, floor: floorNum };
    if (excludeResidentId) {
      // Exclude this resident's room from "occupied" check
      const residentProfile = await ResidentProfile.findOne({ user: excludeResidentId });
      if (residentProfile && residentProfile.block === block && residentProfile.floor === floorNum) {
        occupiedQuery.roomNumber = { $ne: residentProfile.roomNumber }; // exclude his own room
      }
    }

    const occupiedRooms = await ResidentProfile.find(occupiedQuery).select("roomNumber");
    const occupiedSet = new Set(occupiedRooms.map(r => r.roomNumber));

    // Generate all possible rooms + add back the excluded one if applicable
    const allRooms = [];
    for (let i = 1; i <= building.roomsPerFloor; i++) {
      allRooms.push(i);
    }

    // Filter: keep only not-occupied OR the one belonging to excludeResidentId
    const resultRooms = allRooms.filter(room => !occupiedSet.has(room));

    // If we excluded someone and his room was on this floor, make sure it's included
    if (excludeResidentId) {
      const profile = await ResidentProfile.findOne({ user: excludeResidentId });
      if (profile && profile.block === block && profile.floor === floorNum) {
        if (!resultRooms.includes(profile.roomNumber)) {
          resultRooms.push(profile.roomNumber);
        }
        // Sort for nicer UX
        resultRooms.sort((a, b) => a - b);
      }
    }

    res.json({ rooms: resultRooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};