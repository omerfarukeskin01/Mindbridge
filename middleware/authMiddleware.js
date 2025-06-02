const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
};

const requireAdmin = (req, res, next) => {
    if (!req.session.admin || req.session.admin.role !== 'admin') {
        return res.redirect('/admin/login');
    }
    next();
};

const requirePatient = requireRole('patient');
const requirePsychologist = requireRole('psychologist');

module.exports = {
    requireAuth,
    requireRole,
    requirePatient,
    requirePsychologist,
    requireAdmin
}; 