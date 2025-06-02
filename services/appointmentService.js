const Appointment = require('../models/Appointment');

class AppointmentService {
  static async createAppointment(appointmentData) {
    try {
      const appointment = new Appointment(appointmentData);
      return await appointment.save();
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  static async getPatientAppointments(patientId) {
    try {
      return await Appointment.find({ patient: patientId })
        .populate('psychologist', 'name specialization')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Get patient appointments error:', error);
      return [];
    }
  }

  static async getPsychologistAppointments(psychologistId) {
    try {
      return await Appointment.find({ psychologist: psychologistId })
        .populate('patient', 'name email')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Get psychologist appointments error:', error);
      return [];
    }
  }

  static async getAppointmentById(appointmentId) {
    try {
      return await Appointment.findById(appointmentId)
        .populate('patient', 'name email')
        .populate('psychologist', 'name specialization');
    } catch (error) {
      console.error('Get appointment by id error:', error);
      return null;
    }
  }

  static async confirmAppointment(appointmentId) {
    try {
      return await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'confirmed' },
        { new: true }
      );
    } catch (error) {
      console.error('Confirm appointment error:', error);
      throw error;
    }
  }

  static async completeAppointment(appointmentId, sessionNotes) {
    try {
      return await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          status: 'completed',
          sessionNotes: sessionNotes
        },
        { new: true }
      );
    } catch (error) {
      console.error('Complete appointment error:', error);
      throw error;
    }
  }

  static async cancelAppointment(appointmentId) {
    try {
      return await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'cancelled' },
        { new: true }
      );
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }

  static async getAppointmentsByDateRange(startDate, endDate, filters = {}) {
    try {
      const query = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };

      if (filters.psychologistId) {
        query.psychologist = filters.psychologistId;
      }

      if (filters.patientId) {
        query.patient = filters.patientId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      return await Appointment.find(query)
        .populate('patient', 'name email')
        .populate('psychologist', 'name specialization')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Get appointments by date range error:', error);
      return [];
    }
  }

  static async checkAppointmentConflict(psychologistId, date, time, excludeId = null) {
    try {
      const query = {
        psychologist: psychologistId,
        date: date,
        time: time,
        status: { $in: ['pending', 'confirmed'] }
      };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existingAppointment = await Appointment.findOne(query);
      return !!existingAppointment;
    } catch (error) {
      console.error('Check appointment conflict error:', error);
      return false;
    }
  }

  static async getAppointmentStats(psychologistId, period = 'month') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      const appointments = await Appointment.find({
        psychologist: psychologistId,
        createdAt: { $gte: startDate }
      });

      return {
        total: appointments.length,
        pending: appointments.filter(apt => apt.status === 'pending').length,
        confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
        completed: appointments.filter(apt => apt.status === 'completed').length,
        cancelled: appointments.filter(apt => apt.status === 'cancelled').length
      };
    } catch (error) {
      console.error('Get appointment stats error:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      };
    }
  }
}

module.exports = AppointmentService;
