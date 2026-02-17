// civicFlow/backend/models/Building.js
const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  block: { type: String, required: true, unique: true },
  totalFloors: { type: Number, required: true },
  roomsPerFloor: { type: Number, required: true },
});

module.exports = mongoose.model("Building", buildingSchema);
