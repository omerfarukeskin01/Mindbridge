const express = require('express');
const AdminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin authentication routes
router.get('/admin/login', AdminController.getAdminLogin);
router.post('/admin/login', AdminController.postAdminLogin);
router.get('/admin/logout', AdminController.adminLogout);

// Admin dashboard routes (require admin authentication)
router.get('/admin/dashboard', requireAdmin, AdminController.getAdminDashboard);

// Psychologist management routes
router.get('/admin/pending-psychologists', requireAdmin, AdminController.getPendingPsychologists);
router.post('/admin/approve-psychologist/:id', requireAdmin, AdminController.approvePsychologist);
router.post('/admin/reject-psychologist/:id', requireAdmin, AdminController.rejectPsychologist);

// User management routes
router.get('/admin/users', requireAdmin, AdminController.getUsersManagement);
router.get('/admin/users/:id', requireAdmin, AdminController.getUserDetails);
router.get('/admin/users/:id/edit', requireAdmin, AdminController.getUserEditForm);
router.put('/admin/users/:id', requireAdmin, AdminController.updateUser);
router.delete('/admin/users/:id', requireAdmin, AdminController.deleteUser);

module.exports = router; 