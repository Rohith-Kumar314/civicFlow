const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validateMiddleware");
const { raiseComplaintSchema } = require("../middlewares/complaintSchemas");
const upload = require("../middlewares/uploadMiddleware");


// ================= RESIDENT ROUTES =================


router.post(
  "/raise",
  protect,
  authorize("resident"),
  upload.array("images", 5), // 👈 added
  // validateBody(raiseComplaintSchema),
  complaintController.raiseComplaint
);


router.get(
  "/my-complaints",
  protect,
  authorize("resident"),
  complaintController.getResidentComplaints
);
// ================= WORKER ROUTES =================

router.get(
  "/worker/available",
  protect,
  authorize("worker"),
  complaintController.getAvailableComplaints
);

router.get(
  "/worker/my-tasks",
  protect,
  authorize("worker"),
  complaintController.getMyTasks
);

router.get(
  "/worker/completed",
  protect,
  authorize("worker"),
  complaintController.getCompletedTasks
);

router.put(
  "/worker/accept/:complaintId",
  protect,
  authorize("worker"),
  complaintController.acceptComplaint
);

router.put(
  "/worker/start/:complaintId",
  protect,
  authorize("worker"),
  complaintController.startWork
);

router.put(
  "/worker/complete/:complaintId",
  protect,
  authorize("worker"),
  complaintController.completeWork
);


module.exports = router;