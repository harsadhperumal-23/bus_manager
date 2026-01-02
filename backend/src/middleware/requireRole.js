/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user object exists in request
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found in session'
            });
        }

        // Convert single role to array for consistent handling
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
                requiredRole: roles,
                userRole: req.user.role
            });
        }

        // User has required role, proceed
        next();
    };
};

module.exports = requireRole;
