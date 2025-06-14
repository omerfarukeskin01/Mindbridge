const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { requireAuth } = require('../middleware/authMiddleware');

// Middleware - tüm mood routes için authentication gerekli
router.use(requireAuth);

// Ana mood dashboard sayfası
router.get('/', (req, res) => {
  res.render('mood/mood-dashboard', {
    title: 'Ruh Hali Takibi',
    user: req.session.user
  });
});

// Yeni mood kaydı ekleme formu sayfası
router.get('/entry', (req, res) => {
  res.render('mood/mood-entry', {
    title: 'Yeni Ruh Hali Kaydı',
    user: req.session.user
  });
});

// Yeni mood kaydı ekleme (POST)
router.post('/add', moodController.addMoodEntry);

// Mood geçmişi sayfası
router.get('/history', moodController.getMoodHistory);

// Mood analiz sayfası
router.get('/analytics', moodController.getMoodAnalytics);

// Mood takvim sayfası
router.get('/calendar', (req, res) => {
  res.render('mood/mood-calendar', {
    title: 'Ruh Hali Takvimi',
    user: req.session.user
  });
});

// Kayıt güncelleme
router.put('/update/:id', moodController.updateMoodEntry);

// Kayıt silme
router.delete('/delete/:id', moodController.deleteMoodEntry);

// API Endpoints (AJAX için)
router.get('/api/daily', moodController.getDailyMood);
router.get('/api/weekly', moodController.getWeeklyTrend);
router.get('/api/monthly', moodController.getMonthlyReport);
router.get('/api/range', moodController.getMoodRange);

// Psikolog için özel routes
router.get('/patient/:patientId', (req, res, next) => {
  // Sadece psikologlar erişebilir
  if (req.session.user.role !== 'psychologist') {
    req.flash('error', 'Bu sayfaya erişim yetkiniz yok.');
    return res.redirect('/dashboard');
  }
  next();
}, moodController.getPatientMoodForPsychologist);

// Psikolog için hasta mood range API
router.get('/api/patient-range/:patientId', (req, res, next) => {
  // Sadece psikologlar erişebilir
  if (req.session.user.role !== 'psychologist') {
    return res.status(403).json({
      success: false,
      message: 'Bu API\'ye erişim yetkiniz yok.'
    });
  }
  next();
}, moodController.getPatientMoodRange);

router.get('/my-patients', (req, res, next) => {
  // Sadece psikologlar erişebilir
  if (req.session.user.role !== 'psychologist') {
    req.flash('error', 'Bu sayfaya erişim yetkiniz yok.');
    return res.redirect('/dashboard');
  }
  next();
}, moodController.getAppointmentPatientsMood);

module.exports = router; 