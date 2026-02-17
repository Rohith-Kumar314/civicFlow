const express = require("express");
const router = express.Router();

const {
  getAllBuildings,
  getAvailableRooms,
  getAllRoomsByFloor,
  getAvailableRoomsForEdit
} = require("../controllers/buildingController");

router.get("/", getAllBuildings);
router.get("/available-rooms", getAvailableRooms); // for registration
router.get("/rooms", getAllRoomsByFloor); // ✅ for complaints
router.get("/available-rooms-for-edit", getAvailableRoomsForEdit);
module.exports = router;
