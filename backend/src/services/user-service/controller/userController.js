const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signJWT,verifyJWT } = require("../../../utils/jwt");
const { sendEmail } = require("../../../utils/mailer");
const welcomeEmailTemplate = require("../../email-templates/welcomeEmailTemplate");
const jwt = require("../../../utils/jwt");
const PasswordResetToken = require("../models/PasswordResetToken");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = signJWT({ email }, "1d");

    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });
    await user.save();

    const emailHtml = welcomeEmailTemplate({
      user,
      frontendUrl: process.env.FRONTEND_URL,
      verificationToken,
    });

    await sendEmail(email, "Verify Your Email - CommonChange", emailHtml, {
      disableTracking: true,
    });

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports = registerUser;

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  console.log("Received token for verification:", token);

  try {
    const decoded = verifyJWT(token);
    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error.message, error.stack);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification token has expired. Please request a new one.",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signJWT({ userId: user._id, role: user.role });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId)
      .populate("hostedEvents")
      .populate("contributions");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      hostedEvents: user.hostedEvents,
      contributions: user.contributions,
    });
  } catch (error) {
    console.error("Get user history error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(
      { role: { $ne: "guest" } },
      "_id firstname lastname email role createdAt"
    )
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ role: { $ne: "guest" } });
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const editUser = async (req, res) => {
  const { userId } = req.params;
  const { firstname, lastname, email } = req.body;
  const requestingUser = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already in use" });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Edit user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const requestingUser = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (requestingUser.role !== "admin" && requestingUser.id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this account" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await PasswordResetToken.create({
      userId: user._id,
      token: resetToken,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    try {
      await sendEmail(email, "Password Reset Request", emailHtml);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (emailError) {
      console.error("Detailed email sending error:", {
        message: emailError.message,
        stack: emailError.stack,
      });
      return res
        .status(500)
        .json({ message: "Failed to send email", error: emailError.message });
    }
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken)
      return res.status(400).json({ message: "Invalid or expired token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserHistory,
  getAllUsers,
  editUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
