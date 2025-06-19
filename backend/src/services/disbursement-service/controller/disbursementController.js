const Disbursement = require("../models/Disbursement");
const Event = require("../../event-service/models/Event");
const { encrypt } = require("../../../utils/encryption");

const createDisbursement = async (req, res) => {
  const { eventId, recipientName, recipientAccount, amount } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const encryptedAccount = encrypt(recipientAccount);
    const disbursement = new Disbursement({
      eventId,
      recipientName,
      recipientAccount: encryptedAccount.encryptedData,
      iv: encryptedAccount.iv,
      amount,
    });
    await disbursement.save();
    event.disbursement = disbursement._id;
    await event.save();
    res.status(201).json(disbursement);
  } catch (error) {
    console.error("Create disbursement error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const approveDisbursement = async (req, res) => {
  const { id } = req.params;
  try {
    const disbursement = await Disbursement.findById(id);
    if (!disbursement)
      return res.status(404).json({ message: "Disbursement not found" });
    disbursement.status = "completed";
    disbursement.disbursedAt = new Date();
    await disbursement.save();
    res.status(200).json(disbursement);
  } catch (error) {
    console.error("Approve disbursement error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createDisbursement, approveDisbursement };
