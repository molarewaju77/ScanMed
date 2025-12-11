export const verifySuperAdmin = (req, res, next) => {
    try {
        // Assuming user role is attached by verifyToken middleware
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied - SuperAdmin privileges required"
            });
        }
        next();
    } catch (error) {
        console.error("Error in verifySuperAdmin middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
