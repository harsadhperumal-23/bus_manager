const express = require('express');
const router = express.Router();
const { seedAll } = require('../utils/seedData');

/**
 * POST /api/seed/all - Seed all collections
 * Development only endpoint
 */
router.post('/all', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: 'Seeding is disabled in production'
            });
        }

        await seedAll();

        res.json({
            success: true,
            message: 'Database seeded successfully'
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding database'
        });
    }
});

module.exports = router;
