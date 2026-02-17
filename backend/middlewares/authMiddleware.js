const jwt = require("jsonwebtoken");
const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    // 🔥 ATTACH WORKER PROFILE
    if (user.role === "worker") {
      const profile = await WorkerProfile.findOne({ user: user._id });

      if (!profile) {
        return res.status(400).json({
          message: "Worker profile not found",
        });
      }

      req.workerProfile = profile;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
    }
    next();
  };
};