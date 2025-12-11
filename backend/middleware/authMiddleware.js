import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Verify JWT token
export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token failed" });
  }
};

// Alias for protect (used in some routes)
export const authMiddleware = protect;

// Super Admin only
export const superAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Super admin privileges required."
    });
  }
};

// Admin and Super Admin
export const adminMiddleware = (req, res, next) => {
  if (req.user && ['admin', 'superadmin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
};

// Manager, Admin, and Super Admin
export const managerMiddleware = (req, res, next) => {
  if (req.user && ['manager', 'admin', 'superadmin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Manager privileges required."
    });
  }
};

// Worker and above
export const workerMiddleware = (req, res, next) => {
  if (req.user && ['worker', 'manager', 'admin', 'superadmin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Worker privileges required."
    });
  }
};
