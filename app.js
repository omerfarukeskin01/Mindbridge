require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const http = require('http');
const moment = require('moment');
const multer = require('multer');
const methodOverride = require('method-override');

// Import configurations
const Database = require('./config/database');
const SocketConfig = require('./config/socketConfig');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const moodRoutes = require('./routes/moodRoutes');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

// Import controllers
const appointmentController = require('./controllers/appointmentController');
const messageController = require('./controllers/messageController');
const userService = require('./services/userService');
const { requireAuth, requirePatient, requirePsychologist } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

// Trust proxy for Caprover/reverse proxy setup
// This enables Express to trust X-Forwarded-* headers
app.set('trust proxy', true);

// Initialize Socket.io
const io = SocketConfig.init(server);

// Connect to database
Database.connect();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(flash());

// Method override MUST be before routes!
app.use(methodOverride('_method'));

// Debug method override
app.use((req, res, next) => {
    if (req.body && req.body._method) {
        console.log(`🔧 METHOD OVERRIDE: ${req.method} → ${req.body._method}`);
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});

// Global middleware for user data and utilities
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.admin = req.session.admin || null;
    res.locals.moment = moment;
    res.locals.messages = req.flash();
    next();
});

// Comprehensive logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n🕐 [${timestamp}] ${req.method} ${req.url}`);
    
    // Detailed IP logging for Caprover/reverse proxy debugging
    console.log(`🌍 Client IP: ${req.ip}`);
    console.log(`🔍 Remote Address: ${req.connection.remoteAddress || req.socket.remoteAddress}`);
    if (req.headers['x-forwarded-for']) {
        console.log(`🔄 X-Forwarded-For: ${req.headers['x-forwarded-for']}`);
    }
    if (req.headers['x-real-ip']) {
        console.log(`🎯 X-Real-IP: ${req.headers['x-real-ip']}`);
    }
    if (req.headers['x-forwarded-proto']) {
        console.log(`🔒 X-Forwarded-Proto: ${req.headers['x-forwarded-proto']}`);
    }
    
    console.log(`🔧 User-Agent: ${req.get('User-Agent')}`);
    
    if (req.session) {
        console.log(`🔑 Session ID: ${req.sessionID}`);
        if (req.session.user) {
            console.log(`👤 Logged in: ${req.session.user.name} (${req.session.user.role}) - ID: ${req.session.user.id}`);
        } else {
            console.log(`❌ No user session`);
        }
    } else {
        console.log(`❌ No session`);
    }
    
    if (Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, req.body);
    }
    
    if (Object.keys(req.params).length > 0) {
        console.log(`🎯 Params:`, req.params);
    }
    
    if (Object.keys(req.query).length > 0) {
        console.log(`❓ Query:`, req.query);
    }
    
    // Log response
    const originalSend = res.send;
    res.send = function(data) {
        console.log(`📤 Response Status: ${res.statusCode}`);
        if (res.statusCode >= 300 && res.statusCode < 400) {
            console.log(`🔄 Redirecting to: ${res.get('Location')}`);
        }
        console.log(`─────────────────────────────────────────────────────────`);
        return originalSend.call(this, data);
    };
    
    next();
});

// Debug middleware for appointment routes
app.use('/appointments', (req, res, next) => {
    console.log(`🎯 APPOINTMENT ROUTE MATCHED!`);
    console.log(`📍 Full path: ${req.originalUrl}`);
    console.log(`🔧 Method: ${req.method}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Use modular routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', adminRoutes);
app.use('/mood', moodRoutes);
app.use('/', userRoutes);
app.use('/resources', resourceRoutes);

// Appointment routes
app.post('/appointments', requireAuth, requirePatient, appointmentController.createAppointment);
app.put('/appointments/:id/confirm', requireAuth, requirePsychologist, appointmentController.confirmAppointment);
app.post('/appointments/:id/confirm', requireAuth, requirePsychologist, appointmentController.confirmAppointment);
app.put('/appointments/:id/complete', requireAuth, requirePsychologist, appointmentController.completeAppointment);
app.post('/appointments/:id/complete', requireAuth, requirePsychologist, appointmentController.completeAppointment);
app.delete('/appointments/:id', requireAuth, appointmentController.cancelAppointment);
app.get('/appointments/:id', requireAuth, appointmentController.getAppointmentDetails);
app.get('/api/appointments', requireAuth, appointmentController.getAppointmentsByDateRange);

// Message routes
app.get('/messages', requireAuth, messageController.getMessagesPage);
app.get('/messages/:userId', requireAuth, (req, res) => {
    // Redirect /messages/:userId to /chat/:userId for consistency
    res.redirect(`/chat/${req.params.userId}`);
});
app.get('/chat/:userId', requireAuth, messageController.getChatPage);
app.post('/messages', requireAuth, messageController.sendMessage);
app.put('/messages/:userId/read', requireAuth, messageController.markMessagesAsRead);
app.get('/api/messages/unread-count', requireAuth, messageController.getUnreadCount);

// Psychologist routes
app.get('/psychologists', requireAuth, async (req, res) => {
    try {
        const psychologists = await userService.getApprovedPsychologists();
        res.render('psychologists/list', { psychologists });
    } catch (error) {
        console.error('Psychologists page error:', error);
        req.flash('error', 'Psikologlar listesi yüklenirken bir hata oluştu');
        res.redirect('/dashboard');
    }
});

app.get('/psychologists/:id', requireAuth, async (req, res) => {
    try {
        const psychologist = await userService.getPsychologistById(req.params.id);
        if (!psychologist) {
            req.flash('error', 'Psikolog bulunamadı');
            return res.redirect('/psychologists');
        }
        res.render('psychologists/profile', { psychologist });
    } catch (error) {
        console.error('Psychologist profile error:', error);
        req.flash('error', 'Psikolog profili yüklenirken bir hata oluştu');
        res.redirect('/psychologists');
    }
});

// File upload route
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.json({
            success: true,
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Application error:', err);
    res.status(500).render('error', { 
        message: 'Bir hata oluştu',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        message: 'Sayfa bulunamadı'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Mindbridge server running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('📴 SIGTERM received, shutting down gracefully');
    await Database.disconnect();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('📴 SIGINT received, shutting down gracefully');
    await Database.disconnect();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app; 