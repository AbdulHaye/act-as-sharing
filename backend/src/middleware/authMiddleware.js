const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("token:",token)
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,

    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    console.log("User role not authorized:", req.user.role);
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { auth, authorize };
