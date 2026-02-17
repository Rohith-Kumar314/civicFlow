const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");
const {
  getResidents,
  addResident,
  updateResident,
  deleteResident,
  getWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  getComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
  getBuildings,
  addBuilding,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/adminController");

// Only Admin Can Access
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

router.get("/residents", protect, authorize("admin"), getResidents);
router.post("/residents", protect, authorize("admin"), addResident);
router.put("/residents/:id", protect, authorize("admin"), updateResident);
router.delete("/residents/:id", protect, authorize("admin"), deleteResident);

router.get("/workers", protect, authorize("admin"), getWorkers);
router.post("/workers", protect, authorize("admin"), addWorker);
router.put("/workers/:id", protect, authorize("admin"), updateWorker);
router.delete("/workers/:id", protect, authorize("admin"), deleteWorker);

router.get("/complaints", protect, authorize("admin"), getComplaints);
router.post("/complaints", protect, authorize("admin"), addComplaint);
router.put("/complaints/:id", protect, authorize("admin"), updateComplaint);
router.delete("/complaints/:id", protect, authorize("admin"), deleteComplaint);

router.get("/buildings", protect, authorize("admin"), getBuildings);
router.post("/buildings", protect, authorize("admin"), addBuilding);
router.put("/buildings/:id", protect, authorize("admin"), updateBuilding);
router.delete("/buildings/:id", protect, authorize("admin"), deleteBuilding);

module.exports = router;
