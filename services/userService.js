const User = require('../models/User');

class UserService {
    static async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            console.error('Get user by id error:', error);
            return null;
        }
    }

    static async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('Get user by email error:', error);
            return null;
        }
    }

    static async getApprovedPsychologists() {
        try {
            return await User.find({ 
                role: 'psychologist', 
                isApproved: true 
            }).select('-password');
        } catch (error) {
            console.error('Get approved psychologists error:', error);
            return [];
        }
    }

    static async getPsychologistById(psychologistId) {
        try {
            return await User.findOne({ 
                _id: psychologistId, 
                role: 'psychologist',
                isApproved: true 
            }).select('-password');
        } catch (error) {
            console.error('Get psychologist by id error:', error);
            return null;
        }
    }

    static async createUser(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    static async updateUser(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(
                userId, 
                updateData, 
                { new: true, runValidators: true }
            ).select('-password');
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    }

    static async approvePsychologist(psychologistId) {
        try {
            return await User.findByIdAndUpdate(
                psychologistId,
                { isApproved: true },
                { new: true }
            );
        } catch (error) {
            console.error('Approve psychologist error:', error);
            throw error;
        }
    }

    static async searchPsychologists(filters = {}) {
        try {
            const query = { 
                role: 'psychologist', 
                isApproved: true 
            };

            if (filters.specialization) {
                query.specialization = filters.specialization;
            }

            if (filters.experience) {
                query.experience = { $gte: filters.experience };
            }

            return await User.find(query).select('-password');
        } catch (error) {
            console.error('Search psychologists error:', error);
            return [];
        }
    }
}

module.exports = UserService; 