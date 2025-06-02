const User = require('../models/User');

class AuthService {
    static async login(email, password) {
        try {
            const user = await User.findOne({ email });
            
            if (!user) {
                // Check if this email looks like a psychologist email pattern or if we should show psychologist info
                const isPotentialPsychologist = email.includes('psikolog') || email.includes('dr') || email.includes('doktor');
                return {
                    success: false,
                    message: 'Geçersiz e-posta veya şifre',
                    showPsychologistInfo: isPotentialPsychologist
                };
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Geçersiz e-posta veya şifre',
                    showPsychologistInfo: user.role === 'psychologist'
                };
            }

            if (user.role === 'psychologist' && !user.isApproved) {
                return {
                    success: true,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isApproved: false
                    },
                    warning: 'Hesabınız henüz admin onayı beklemektedir. Onay sürecinde sabırlı olduğunuz için teşekkür ederiz. Onay aldıktan sonra tüm özellikleri kullanabileceksiniz.'
                };
            }

            return {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isApproved: user.role === 'psychologist' ? user.isApproved : true
                }
            };
        } catch (error) {
            console.error('Login service error:', error);
            return {
                success: false,
                message: 'Giriş sırasında bir hata oluştu'
            };
        }
    }

    static async register(userData) {
        try {
            const { name, email, password, role, phone, specialization, experience, license, bio } = userData;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    success: false,
                    message: 'Bu e-posta adresi zaten kullanılıyor'
                };
            }

            // Prepare user data
            const newUserData = {
                name,
                email,
                password,
                role,
                phone,
                bio
            };

            // Add psychologist specific fields
            if (role === 'psychologist') {
                newUserData.specialization = specialization;
                newUserData.experience = experience;
                newUserData.license = license;
            }

            // Create new user
            const user = new User(newUserData);
            await user.save();

            return {
                success: true,
                message: role === 'psychologist' ? 
                    'Kayıt başarılı! Psikolog hesabınız admin onayı bekliyor. Onay aldıktan sonra sisteme giriş yapabilirsiniz.' : 
                    'Kayıt başarılı! Giriş yapabilirsiniz.'
            };
        } catch (error) {
            console.error('Register service error:', error);
            return {
                success: false,
                message: 'Kayıt sırasında bir hata oluştu'
            };
        }
    }

    static async verifyToken(token) {
        // Token verification logic if needed
        return true;
    }
}

module.exports = AuthService; 