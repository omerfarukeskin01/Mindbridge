// controllers/DashboardController.js

const userService        = require('../services/userService');
const appointmentService = require('../services/appointmentService');

class DashboardController {
  static async getDashboard(req, res) {
    try {
      const userId = req.session.user.id;
      const user   = await userService.getUserById(userId);
      
      if (!user) {
        return res.redirect('/login');
      }

      if (user.role === 'patient') {
        return await DashboardController.getPatientDashboard(req, res, user);
      } else {
        return await DashboardController.getPsychologistDashboard(req, res, user);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.redirect('/login');
    }
  }

  static async getPatientDashboard(req, res, user) {
    try {
      // Hasta randevularını çek
      const appointments    = await appointmentService.getPatientAppointments(user._id);
      // Onaylı psikolog listesini çek
      const psychologists   = await userService.getApprovedPsychologists();

      // Flash mesajlarını oku (her zaman dizi olarak döner)
      const success  = req.flash('success');   // eğer hiç set edilmemişse boş dizi []
      const error    = req.flash('error');     // yine boş dizi
      // Eğer messages objesi { warning: '...' } gibi bir yapıda gönderiyorsan:
      const messages = (req.flash('messages') || [])[0] || {}; 
      // (mesela req.flash('messages', { warning: '...' }) demişsen)

      return res.render('dashboard/patient', {
        user,
        appointments,
        psychologists,
        success,
        error,
        messages
      });
    } catch (err) {
      console.error('Patient dashboard error:', err);
      return res.redirect('/login');
    }
  }

  static async getPsychologistDashboard(req, res, user) {
    try {
      // Psikoloğa ait randevuları çek
      const appointments  = await appointmentService.getPsychologistAppointments(user._id);

      // Flash mesajlarını oku
      const success  = req.flash('success');
      const error    = req.flash('error');
      const messages = (req.flash('messages') || [])[0] || {};

      return res.render('dashboard/psychologist', {
        user,
        appointments,
        success,
        error,
        messages
      });
    } catch (err) {
      console.error('Psychologist dashboard error:', err);
      return res.redirect('/login');
    }
  }
}

module.exports = DashboardController;
