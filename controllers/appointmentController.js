const appointmentService = require('../services/appointmentService');
const userService = require('../services/userService');

class AppointmentController {
    // Create new appointment
    static async createAppointment(req, res) {
        try {
            const { psychologist, date, time, notes } = req.body;
            const patientId = req.session.user.id;
            
            // Check for appointment conflicts
            const hasConflict = await appointmentService.checkAppointmentConflict(
                psychologist, 
                new Date(date), 
                time
            );
            
            if (hasConflict) {
                req.flash('error', 'Bu tarih ve saatte psikolog müsait değil');
                return res.redirect('/dashboard');
            }
            
            const appointmentData = {
                patient: patientId,
                psychologist,
                date: new Date(date),
                time,
                notes
            };
            
            await appointmentService.createAppointment(appointmentData);
            req.flash('success', 'Randevu başarıyla oluşturuldu!');
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Create appointment error:', error);
            req.flash('error', 'Randevu oluşturulurken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Confirm appointment (psychologist only)
    static async confirmAppointment(req, res) {
        try {
            console.log('\n🟢 ===== CONFIRM APPOINTMENT STARTED =====');
            console.log('🔄 Confirm appointment called');
            console.log('📧 Session user:', req.session.user);
            console.log('🆔 Appointment ID:', req.params.id);
            console.log('🌐 Request Method:', req.method);
            console.log('📍 Request URL:', req.originalUrl);
            console.log('📦 Request Body:', req.body);
            
            const appointmentId = req.params.id;
            const psychologistId = req.session.user.id;
            console.log('👨‍⚕️ Psychologist ID from session:', psychologistId);
            
            const appointment = await appointmentService.getAppointmentById(appointmentId);
            console.log('📋 Appointment found:', appointment ? 'Yes' : 'No');
            
            if (appointment) {
                console.log('📋 Appointment details:');
                console.log('  - ID:', appointment._id);
                console.log('  - Patient:', appointment.patient.name);
                console.log('  - Psychologist ID:', appointment.psychologist._id.toString());
                console.log('  - Status:', appointment.status);
                console.log('  - Date:', appointment.date);
                console.log('  - Time:', appointment.time);
            }
            
            if (!appointment || appointment.psychologist._id.toString() !== psychologistId) {
                console.log('❌ Access denied - not your appointment');
                console.log('  - Expected Psychologist ID:', psychologistId);
                console.log('  - Actual Psychologist ID:', appointment ? appointment.psychologist._id.toString() : 'No appointment');
                req.flash('error', 'Bu randevuyu onaylama yetkiniz yok');
                return res.redirect('/dashboard');
            }
            
            console.log('🔄 Calling appointmentService.confirmAppointment...');
            await appointmentService.confirmAppointment(appointmentId);
            console.log('✅ Appointment confirmed successfully');
            console.log('🟢 ===== CONFIRM APPOINTMENT COMPLETED =====\n');
            
            req.flash('success', 'Randevu onaylandı!');
            res.redirect('/dashboard');
        } catch (error) {
            console.error('🔴 ===== CONFIRM APPOINTMENT ERROR =====');
            console.error('❌ Confirm appointment error:', error);
            console.error('📍 Stack trace:', error.stack);
            console.error('🔴 ===== ERROR END =====\n');
            req.flash('error', 'Randevu onaylanırken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Complete appointment with session notes (psychologist only)
    static async completeAppointment(req, res) {
        try {
            const appointmentId = req.params.id;
            const { sessionNotes } = req.body;
            const psychologistId = req.session.user.id;
            
            const appointment = await appointmentService.getAppointmentById(appointmentId);
            
            if (!appointment || appointment.psychologist._id.toString() !== psychologistId) {
                req.flash('error', 'Bu seansı tamamlama yetkiniz yok');
                return res.redirect('/dashboard');
            }
            
            await appointmentService.completeAppointment(appointmentId, sessionNotes);
            req.flash('success', 'Seans başarıyla tamamlandı!');
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Complete appointment error:', error);
            req.flash('error', 'Seans tamamlanırken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Cancel appointment
    static async cancelAppointment(req, res) {
        try {
            const appointmentId = req.params.id;
            const userId = req.session.user.id;
            
            const appointment = await appointmentService.getAppointmentById(appointmentId);
            
            if (!appointment) {
                req.flash('error', 'Randevu bulunamadı');
                return res.redirect('/dashboard');
            }
            
            // Check if user has permission to cancel
            const canCancel = appointment.patient._id.toString() === userId || 
                             appointment.psychologist._id.toString() === userId;
            
            if (!canCancel) {
                req.flash('error', 'Bu randevuyu iptal etme yetkiniz yok');
                return res.redirect('/dashboard');
            }
            
            await appointmentService.cancelAppointment(appointmentId);
            req.flash('success', 'Randevu iptal edildi');
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Cancel appointment error:', error);
            req.flash('error', 'Randevu iptal edilirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Get appointment details
    static async getAppointmentDetails(req, res) {
        try {
            const appointmentId = req.params.id;
            const userId = req.session.user.id;
            
            const appointment = await appointmentService.getAppointmentById(appointmentId);
            
            if (!appointment) {
                return res.status(404).json({ error: 'Randevu bulunamadı' });
            }
            
            // Check if user has permission to view
            const canView = appointment.patient._id.toString() === userId || 
                           appointment.psychologist._id.toString() === userId;
            
            if (!canView) {
                return res.status(403).json({ error: 'Bu randevuyu görme yetkiniz yok' });
            }
            
            res.json(appointment);
        } catch (error) {
            console.error('Get appointment details error:', error);
            res.status(500).json({ error: 'Randevu detayları alınırken bir hata oluştu' });
        }
    }

    // Get appointments by date range (for calendar view)
    static async getAppointmentsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const userId = req.session.user.id;
            const userRole = req.session.user.role;
            
            const filters = {};
            if (userRole === 'patient') {
                filters.patientId = userId;
            } else {
                filters.psychologistId = userId;
            }
            
            const appointments = await appointmentService.getAppointmentsByDateRange(
                new Date(startDate),
                new Date(endDate),
                filters
            );
            
            res.json(appointments);
        } catch (error) {
            console.error('Get appointments by date range error:', error);
            res.status(500).json({ error: 'Randevular alınırken bir hata oluştu' });
        }
    }
}

module.exports = AppointmentController; 