const Request = require("../models/Request");
const mongoose = require("mongoose");

const submitRequest = async (req, res) => {
  const {
    fullName,
    phone,
    email,
    personName,
    relationship,
    immediateNeed,
    preferredDate,
    additionalInfo,
  } = req.body;

  if (
    !fullName ||
    !phone ||
    !email ||
    !personName ||
    !relationship ||
    !immediateNeed
  ) {
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
    const request = new Request({
      fullName,
      phone,
      email,
      personName,
      relationship,
      immediateNeed,
      preferredDate,
      additionalInfo,
    });
    await request.save();
    res
      .status(201)
      .json({ message: "Request submitted successfully", request });
  } catch (error) {
    console.error("Submit request error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getRequestById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error("Get request by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 requests per page
    const skip = (page - 1) * limit;

    // Query requests with pagination
    const requests = await Request.find().skip(skip).limit(limit);

    // Get total count for pagination metadata
    const totalRequests = await Request.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalRequests / limit);

    res.status(200).json({
      requests,
      pagination: {
        currentPage: page,
        totalPages,
        totalRequests,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all requests error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRequest = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    phone,
    email,
    personName,
    relationship,
    immediateNeed,
    preferredDate,
    additionalInfo,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update only the provided fields
    if (fullName !== undefined) request.fullName = fullName;
    if (phone !== undefined) request.phone = phone;
    if (email !== undefined) request.email = email;
    if (personName !== undefined) request.personName = personName;
    if (relationship !== undefined) request.relationship = relationship;
    if (immediateNeed !== undefined) request.immediateNeed = immediateNeed;
    if (preferredDate !== undefined) request.preferredDate = preferredDate;
    if (additionalInfo !== undefined) request.additionalInfo = additionalInfo;

    await request.save();
    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("Update request error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const donateToRequest = async (req, res) => {
  const { id } = req.params;
  const { donatedAmount } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  if (!donatedAmount || donatedAmount <= 0) {
    return res.status(400).json({ message: "Invalid donated amount" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.donatedAmount = donatedAmount;
    request.status = "completed";
    await request.save();
    res
      .status(200)
      .json({ message: "Donation recorded successfully", request });
  } catch (error) {
    console.error("Donate to request error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await Request.deleteOne({ _id: id });
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Delete request error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitRequest,
  getRequestById,
  getAllRequests,
  updateRequest,
  donateToRequest,
  deleteRequest,
};
