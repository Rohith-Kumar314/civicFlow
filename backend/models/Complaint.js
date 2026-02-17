// civicFlow/backend/models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assigned worker
      default: null,
    },
    department: {
      type: String,
      enum: ["Electrician", "Plumber", "Carpenter", "Technical", "Other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // store URLs or file paths
      },
    ],
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
    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Completed"],
      default: "Pending",
    },
    acceptedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);