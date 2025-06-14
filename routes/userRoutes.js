const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Oturum açmanız gerekiyor' });
    }
    next();
};

// Update privacy settings
router.post('/api/user/privacy', requireAuth, async (req, res) => {
    try {
        const { shareNameWithPsychologist } = req.body;
        const userId = req.session.user.id;
        
        await User.findByIdAndUpdate(userId, {
            shareNameWithPsychologist: shareNameWithPsychologist
        });
        
        // Update session data
        req.session.user.shareNameWithPsychologist = shareNameWithPsychologist;
        
        res.json({ 
            success: true, 
            message: shareNameWithPsychologist ? 'İsim paylaşımı açıldı' : 'İsim paylaşımı kapatıldı'
        });
    } catch (error) {
        console.error('Privacy update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ayar güncellenirken hata oluştu' 
        });
    }
});

module.exports = router; 