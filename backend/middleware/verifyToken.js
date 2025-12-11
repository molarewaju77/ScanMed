import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check if cookies exist and token is present
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    // Attach full user payload to request for downstream middleware (e.g., verifyAdmin)
    req.user = decoded;
    // Also keep userId for backward compatibility
    req.userId = decoded.userId;

    next();
  } catch (error) {
    // If token verification failed (expired/invalid), send 401 Unauthorized
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized - token expired or invalid" });
    }

    // Otherwise, it's an unexpected server error
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
