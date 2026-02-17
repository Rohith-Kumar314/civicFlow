// civicFlow/backend/models/ResidentProfile.js
const mongoose = require("mongoose");

const residentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    block: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple residents from occupying the same room
residentProfileSchema.index(
  { block: 1, floor: 1, roomNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("ResidentProfile", residentProfileSchema);
