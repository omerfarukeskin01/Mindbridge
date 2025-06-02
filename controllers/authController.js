const authService = require('../services/authService');
const userService = require('../services/userService');

class AuthController {
    // Login page
    static async getLogin(req, res) {
        try {
            const showPsychologistInfo = req.session.showPsychologistInfo || false;
            // Clear the flag after using it
            delete req.session.showPsychologistInfo;
            
            res.render('auth/login', { showPsychologistInfo });
        } catch (error) {
            console.error('Login page error:', error);
            res.status(500).send('Server error');
        }
    }

    // Login process
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            
            if (!result.success) {
                req.flash('error', result.message);
                // Store flag to show psychologist info if relevant
                if (result.showPsychologistInfo) {
                    req.session.showPsychologistInfo = true;
                }
                return res.redirect('/login');
            }
            
            req.session.user = result.user;
            
            // Show warning for unapproved psychologists
            if (result.warning) {
                req.flash('warning', result.warning);
            }
            
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'Giriş sırasında bir hata oluştu');
            res.redirect('/login');
        }
    }

    // Register page
    static async getRegister(req, res) {
        try {
            res.render('auth/register');
        } catch (error) {
            console.error('Register page error:', error);
            res.status(500).send('Server error');
        }
    }

    // Register process
    static async postRegister(req, res) {
        try {
            const userData = req.body;
            const result = await authService.register(userData);
            
            if (!result.success) {
                req.flash('error', result.message);
                return res.redirect('/register');
            }
            
            req.flash('success', result.message);
            res.redirect('/login');
        } catch (error) {
            console.error('Register error:', error);
            req.flash('error', 'Kayıt sırasında bir hata oluştu');
            res.redirect('/register');
        }
    }

    // Logout
    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Logout error:', err);
                }
                res.redirect('/');
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.redirect('/');
        }
    }
}

module.exports = AuthController; 