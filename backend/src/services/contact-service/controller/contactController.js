const Contact = require("../models/Contact");
const mongoose = require("mongoose");

const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Email validation regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  try {
    const contact = new Contact({
      name,
      email,
      message,
    });
    await contact.save();
    res
      .status(201)
      .json({ message: "Contact message submitted successfully", contact });
  } catch (error) {
    console.error("Submit contact error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 contacts per page
    const skip = (page - 1) * limit;

    // Query contacts with pagination
    const contacts = await Contact.find().skip(skip).limit(limit);

    // Get total count for pagination metadata
    const totalContacts = await Contact.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalContacts,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all contacts error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getContactById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Get contact by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  // Email validation regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email && !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (name !== undefined) contact.name = name;
    if (email !== undefined) contact.email = email;
    if (message !== undefined) contact.message = message;

    await contact.save();
    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    console.error("Update contact error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  if (!status || !["pending", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.status = status;
    await contact.save();
    res.status(200).json({ message: "Status updated successfully", contact });
  } catch (error) {
    console.error("Update status error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.deleteOne({ _id: id });
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  updateStatus,
  deleteContact,
};
