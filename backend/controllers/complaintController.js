const Complaint = require("../models/Complaint");


// ================= RESIDENT =================

exports.raiseComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      block,
      floor,
      roomNumber,
    } = req.body;

    // Safety check (optional but good)
    if (!block || !floor || !roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Block, floor and room number are required",
      });
    }

    // Extract Cloudinary image URLs
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    const complaint = await Complaint.create({
      resident: req.user._id,
      title,
      description,
      department,
      block,
      floor: Number(floor),
      roomNumber: Number(roomNumber),
      images: imageUrls, // optional
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Raise Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getResidentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ resident: req.user._id })
      .populate("worker", "username")           // ← add this
      .sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= WORKER =================
exports.getWorkerComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      department: req.user.department,
      status: "Pending",
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.acceptComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.status !== "Pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    // 🔒 Department validation
    if (complaint.department !== req.workerProfile.department) {
      return res.status(403).json({
        message: "You cannot accept complaints outside your department",
      });
    }

    complaint.worker = req.user._id;
    complaint.status = "Accepted";
    complaint.acceptedAt = new Date();

    await complaint.save();

    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.startWork = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found" });

    if (complaint.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your task" });
    }

    if (complaint.status !== "Accepted") {
      return res.status(400).json({
        message: "Complaint must be accepted before starting",
      });
    }

    complaint.status = "In Progress";
    await complaint.save();

    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error("Start Work Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.completeWork = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found" });

    if (complaint.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your task" });
    }

    if (complaint.status !== "In Progress") {
      return res.status(400).json({
        message: "Complaint must be in progress to complete",
      });
    }

    complaint.status = "Completed";
    complaint.completedAt = new Date();

    await complaint.save();

    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error("Complete Work Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getAvailableComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      department: req.workerProfile.department,
      status: "Pending",
      worker: null,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Complaint.find({
      worker: req.user._id,
      status: { $in: ["Accepted", "In Progress"] },
    }).sort({ updatedAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Complaint.find({
      worker: req.user._id,
      status: "Completed",
    })
      .populate("resident", "username email")     // ← add this
      .populate("worker", "username")             // optional, but good for consistency
      .sort({ completedAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get Completed Tasks Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};