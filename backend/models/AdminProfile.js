// civicFlow/backend/models/AdminProfile.js
const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    contactNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
