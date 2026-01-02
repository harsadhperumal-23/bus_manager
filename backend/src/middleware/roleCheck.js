/**
 * Role-based access control middleware
 * Checks if user has required role
 */
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Please login.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Insufficient permissions.'
            });
        }

        next();
    };
};

module.exports = roleCheck;
