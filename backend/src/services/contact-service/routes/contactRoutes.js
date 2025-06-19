const express = require("express");
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  updateStatus,
  deleteContact,
} = require("../controller/contactController");

router.post("/", submitContact);
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.put("/status/:id", updateStatus);
router.delete("/:id", deleteContact);

module.exports = router;
