const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  submitRequest,
  getRequestById,
  getAllRequests,
  updateRequest,
  donateToRequest,
  deleteRequest,
} = require("../controller/requestController");

router.post("/", submitRequest);
router.get("/:id", auth, authorize(["admin"]), getRequestById);
router.get("/", auth, authorize(["admin"]), getAllRequests);
router.put("/:id", auth, authorize(["admin"]), updateRequest);
router.put("/donate/:id", auth, authorize(["admin"]), donateToRequest);
router.delete("/:id", auth, authorize(["admin"]), deleteRequest);

module.exports = router;



