/**
 * Authentication middleware
 * Verifies user session and attaches user object to request
 */
const auth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please login.'
        });
    }

    // Attach user to request for use in routes
    req.user = req.session.user;
    next();
};

module.exports = auth;
