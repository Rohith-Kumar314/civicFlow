// civicFlow/backend/models/WorkerProfile.js
const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      enum: ["Electrician", "Plumber", "Carpenter", "Technical", "Other"],
      required: true,
    },
    assignedBlocks: [String], // optional: assign specific blocks
    contactNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);
