const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const { requireAuth } = require('../middleware/authMiddleware');

// Ana kaynak kütüphanesi
router.get('/', requireAuth, ResourceController.getResourceLibrary);

// Kaynak detayı
router.get('/:id', requireAuth, ResourceController.getResourceDetail);

// Kaynak beğenme/beğenmeme (AJAX)
router.post('/:id/like', requireAuth, ResourceController.toggleLike);

// Admin/Psikolog: Kaynak oluşturma sayfası
router.get('/admin/create', requireAuth, ResourceController.getCreateResource);

// Admin/Psikolog: Kaynak oluşturma
router.post('/admin/create', requireAuth, ResourceController.createResource);

// Admin/Psikolog: Kaynak yönetimi
router.get('/admin/manage', requireAuth, ResourceController.getManageResources);

module.exports = router; 