// middleware/verifyAdmin.js
/**
 * Middleware to verify that the authenticated user has admin privileges.
 * Assumes a preceding authentication middleware populates `req.user`.
 */
export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Adjust the role property name if your user model uses a different field.
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};
