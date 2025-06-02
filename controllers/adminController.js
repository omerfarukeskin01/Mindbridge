const userService = require('../services/userService');
const appointmentService = require('../services/appointmentService');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');

class AdminController {
    // Admin login page
    static async getAdminLogin(req, res) {
        try {
            res.render('admin/login');
        } catch (error) {
            console.error('Admin login page error:', error);
            res.status(500).send('Server error');
        }
    }

    // Admin login process
    static async postAdminLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email, role: 'admin' });
            
            if (!user) {
                req.flash('error', 'Geçersiz admin bilgileri');
                return res.redirect('/admin/login');
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                req.flash('error', 'Geçersiz admin bilgileri');
                return res.redirect('/admin/login');
            }

            req.session.admin = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Admin login error:', error);
            req.flash('error', 'Giriş sırasında bir hata oluştu');
            res.redirect('/admin/login');
        }
    }

    // Admin dashboard
    static async getAdminDashboard(req, res) {
        try {
            // Get statistics
            const stats = await AdminController.getSystemStats();
            
            res.render('admin/dashboard', { 
                admin: req.session.admin,
                stats: stats
            });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.redirect('/admin/login');
        }
    }

    // Pending psychologists for approval
    static async getPendingPsychologists(req, res) {
        try {
            const pendingPsychologists = await User.find({ 
                role: 'psychologist', 
                isApproved: false 
            }).sort({ createdAt: -1 });

            res.render('admin/pending-psychologists', { 
                admin: req.session.admin,
                psychologists: pendingPsychologists
            });
        } catch (error) {
            console.error('Pending psychologists error:', error);
            req.flash('error', 'Bekleyen psikologlar listelenirken bir hata oluştu');
            res.redirect('/admin/dashboard');
        }
    }

    // Approve psychologist
    static async approvePsychologist(req, res) {
        try {
            const psychologistId = req.params.id;
            
            await User.findByIdAndUpdate(psychologistId, { 
                isApproved: true 
            });

            req.flash('success', 'Psikolog başarıyla onaylandı!');
            res.redirect('/admin/pending-psychologists');
        } catch (error) {
            console.error('Approve psychologist error:', error);
            req.flash('error', 'Psikolog onaylanırken bir hata oluştu');
            res.redirect('/admin/pending-psychologists');
        }
    }

    // Reject psychologist
    static async rejectPsychologist(req, res) {
        try {
            const psychologistId = req.params.id;
            
            await User.findByIdAndDelete(psychologistId);

            req.flash('success', 'Psikolog başvurusu reddedildi');
            res.redirect('/admin/pending-psychologists');
        } catch (error) {
            console.error('Reject psychologist error:', error);
            req.flash('error', 'Psikolog reddedilirken bir hata oluştu');
            res.redirect('/admin/pending-psychologists');
        }
    }

    // All users management
    static async getUsersManagement(req, res) {
        try {
            const users = await User.find({ role: { $ne: 'admin' } })
                .sort({ createdAt: -1 });

            res.render('admin/users', { 
                admin: req.session.admin,
                users: users
            });
        } catch (error) {
            console.error('Users management error:', error);
            req.flash('error', 'Kullanıcılar listelenirken bir hata oluştu');
            res.redirect('/admin/dashboard');
        }
    }

    // Get user details
    static async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            
            if (!user) {
                req.flash('error', 'Kullanıcı bulunamadı');
                return res.redirect('/admin/users');
            }

            // Get user's appointments
            const appointments = await Appointment.find({
                $or: [
                    { patient: userId },
                    { psychologist: userId }
                ]
            }).populate('patient psychologist', 'name email').sort({ createdAt: -1 });

            // Get user's messages count
            const messageCount = await Message.countDocuments({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            });

            res.render('admin/user-detail', { 
                admin: req.session.admin,
                user: user,
                appointments: appointments,
                messageCount: messageCount
            });
        } catch (error) {
            console.error('User details error:', error);
            req.flash('error', 'Kullanıcı detayları yüklenirken bir hata oluştu');
            res.redirect('/admin/users');
        }
    }

    // Get user edit form
    static async getUserEditForm(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            
            if (!user) {
                req.flash('error', 'Kullanıcı bulunamadı');
                return res.redirect('/admin/users');
            }

            res.render('admin/user-edit', { 
                admin: req.session.admin,
                user: user
            });
        } catch (error) {
            console.error('User edit form error:', error);
            req.flash('error', 'Kullanıcı düzenleme sayfası yüklenirken bir hata oluştu');
            res.redirect('/admin/users');
        }
    }

    // Update user
    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            
            // Remove password from update if it's empty
            if (!updateData.password) {
                delete updateData.password;
            }

            const user = await User.findByIdAndUpdate(userId, updateData, { 
                new: true,
                runValidators: true 
            });
            
            if (!user) {
                req.flash('error', 'Kullanıcı bulunamadı');
                return res.redirect('/admin/users');
            }

            req.flash('success', 'Kullanıcı başarıyla güncellendi!');
            res.redirect(`/admin/users/${userId}`);
        } catch (error) {
            console.error('Update user error:', error);
            req.flash('error', 'Kullanıcı güncellenirken bir hata oluştu');
            res.redirect(`/admin/users/${req.params.id}/edit`);
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            
            // Delete user's appointments and messages
            await Appointment.deleteMany({
                $or: [
                    { patient: userId },
                    { psychologist: userId }
                ]
            });
            
            await Message.deleteMany({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            });

            await User.findByIdAndDelete(userId);

            req.flash('success', 'Kullanıcı başarıyla silindi');
            res.redirect('/admin/users');
        } catch (error) {
            console.error('Delete user error:', error);
            req.flash('error', 'Kullanıcı silinirken bir hata oluştu');
            res.redirect('/admin/users');
        }
    }

    // System statistics
    static async getSystemStats() {
        try {
            const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
            const totalPatients = await User.countDocuments({ role: 'patient' });
            const totalPsychologists = await User.countDocuments({ role: 'psychologist', isApproved: true });
            const pendingPsychologists = await User.countDocuments({ role: 'psychologist', isApproved: false });
            const totalAppointments = await Appointment.countDocuments();
            const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
            const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
            const totalMessages = await Message.countDocuments();

            // Recent registrations (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const recentRegistrations = await User.countDocuments({ 
                createdAt: { $gte: weekAgo },
                role: { $ne: 'admin' }
            });

            return {
                totalUsers,
                totalPatients,
                totalPsychologists,
                pendingPsychologists,
                totalAppointments,
                pendingAppointments,
                completedAppointments,
                totalMessages,
                recentRegistrations
            };
        } catch (error) {
            console.error('Get system stats error:', error);
            return {};
        }
    }

    // Admin logout
    static async adminLogout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Admin logout error:', err);
                }
                res.redirect('/admin/login');
            });
        } catch (error) {
            console.error('Admin logout error:', error);
            res.redirect('/admin/login');
        }
    }
}

module.exports = AdminController; 