const Mood = require('../models/Mood');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment');

// Yeni ruh hali kaydı ekleme
exports.addMoodEntry = async (req, res) => {
  try {
    const { moodLevel, emotions, notes, triggers } = req.body;
    
    const moodEntry = new Mood({
      userId: req.session.user.id,
      moodLevel: parseInt(moodLevel),
      emotions: emotions || [],
      notes: notes || '',
      triggers: triggers || []
    });

    await moodEntry.save();
    
    req.flash('success', 'Ruh hali kaydınız başarıyla eklendi!');
    res.redirect('/mood');
  } catch (error) {
    console.error('Mood entry error:', error);
    req.flash('error', 'Ruh hali kaydı eklenirken bir hata oluştu.');
    res.redirect('/mood');
  }
};

// Kullanıcının ruh hali geçmişi
exports.getMoodHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const moods = await Mood.find({ userId: req.session.user.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalMoods = await Mood.countDocuments({ userId: req.session.user.id });
    const totalPages = Math.ceil(totalMoods / limit);

    res.render('mood/mood-history', {
      title: 'Ruh Hali Geçmişi',
      moods,
      currentPage: page,
      totalPages,
      moment
    });
  } catch (error) {
    console.error('Mood history error:', error);
    req.flash('error', 'Ruh hali geçmişi yüklenirken bir hata oluştu.');
    res.redirect('/dashboard');
  }
};

// İstatistikler ve trendler
exports.getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

    // Son 30 günün mood verileri
    const recentMoods = await Mood.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Ortalama mood seviyesi
    const avgMood = recentMoods.length > 0 
      ? (recentMoods.reduce((sum, mood) => sum + mood.moodLevel, 0) / recentMoods.length).toFixed(1)
      : 0;

    // En sık yaşanan duygular
    const emotionCounts = {};
    recentMoods.forEach(mood => {
      mood.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    // En sık tetikleyiciler
    const triggerCounts = {};
    recentMoods.forEach(mood => {
      mood.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });

    res.render('mood/mood-analytics', {
      title: 'Ruh Hali Analizi',
      recentMoods,
      avgMood,
      emotionCounts,
      triggerCounts,
      moment
    });
  } catch (error) {
    console.error('Mood analytics error:', error);
    req.flash('error', 'Analiz verileri yüklenirken bir hata oluştu.');
    res.redirect('/mood');
  }
};

// Kayıt güncelleme
exports.updateMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { moodLevel, emotions, notes, triggers } = req.body;

    const mood = await Mood.findOne({ _id: id, userId: req.session.user.id });
    if (!mood) {
      req.flash('error', 'Kayıt bulunamadı.');
      return res.redirect('/mood/history');
    }

    mood.moodLevel = parseInt(moodLevel);
    mood.emotions = emotions || [];
    mood.notes = notes || '';
    mood.triggers = triggers || [];
    
    await mood.save();

    req.flash('success', 'Kayıt başarıyla güncellendi!');
    res.redirect('/mood/history');
  } catch (error) {
    console.error('Mood update error:', error);
    req.flash('error', 'Kayıt güncellenirken bir hata oluştu.');
    res.redirect('/mood/history');
  }
};

// Kayıt silme
exports.deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const mood = await Mood.findOne({ _id: id, userId: req.session.user.id });
    if (!mood) {
      req.flash('error', 'Kayıt bulunamadı.');
      return res.redirect('/mood/history');
    }

    await Mood.findByIdAndDelete(id);

    req.flash('success', 'Kayıt başarıyla silindi!');
    res.redirect('/mood/history');
  } catch (error) {
    console.error('Mood delete error:', error);
    req.flash('error', 'Kayıt silinirken bir hata oluştu.');
    res.redirect('/mood/history');
  }
};

// Günlük ruh hali
exports.getDailyMood = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = moment(today).add(1, 'day');

    const todayMood = await Mood.findOne({
      userId: req.session.user.id,
      date: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
      }
    });

    res.json({
      success: true,
      todayMood
    });
  } catch (error) {
    console.error('Daily mood error:', error);
    res.json({ success: false, error: 'Günlük mood verisi alınamadı.' });
  }
};

// Haftalık trend
exports.getWeeklyTrend = async (req, res) => {
  try {
    const weekAgo = moment().subtract(7, 'days').startOf('day');

    const weeklyMoods = await Mood.find({
      userId: req.session.user.id,
      date: { $gte: weekAgo.toDate() }
    }).sort({ date: 1 });

    res.json({
      success: true,
      weeklyMoods
    });
  } catch (error) {
    console.error('Weekly trend error:', error);
    res.json({ success: false, error: 'Haftalık trend verisi alınamadı.' });
  }
};

// Aylık rapor
exports.getMonthlyReport = async (req, res) => {
  try {
    const monthAgo = moment().subtract(30, 'days').startOf('day');

    const monthlyMoods = await Mood.find({
      userId: req.session.user.id,
      date: { $gte: monthAgo.toDate() }
    }).sort({ date: 1 });

    const avgMood = monthlyMoods.length > 0 
      ? (monthlyMoods.reduce((sum, mood) => sum + mood.moodLevel, 0) / monthlyMoods.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      monthlyMoods,
      avgMood,
      totalEntries: monthlyMoods.length
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.json({ success: false, error: 'Aylık rapor verisi alınamadı.' });
  }
};

// Psikolog için hasta mood verileri
exports.getPatientMoodForPsychologist = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Psikolog bu hastanın randevusu var mı kontrol et
    const appointment = await Appointment.findOne({
      psychologist: req.session.user.id,
      patient: patientId,
      status: { $in: ['confirmed', 'completed'] }
    });

    if (!appointment) {
      req.flash('error', 'Bu hastanın verilerine erişim yetkiniz yok.');
      return res.redirect('/dashboard');
    }

    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const patientMoods = await Mood.find({
      userId: patientId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    const patient = await User.findById(patientId);

    res.render('mood/patient-mood-view', {
      title: 'Hasta Ruh Hali Takibi',
      patientMoods,
      patient,
      moment
    });
  } catch (error) {
    console.error('Patient mood error:', error);
    req.flash('error', 'Hasta mood verileri yüklenirken bir hata oluştu.');
    res.redirect('/dashboard');
  }
};

// Psikolog'un hastalarının mood durumu
exports.getAppointmentPatientsMood = async (req, res) => {
  try {
    // Psikolog'un aktif randevuları olan hastaları bul
    const appointments = await Appointment.find({
      psychologist: req.session.user.id,
      status: { $in: ['confirmed', 'completed'] }
    }).populate('patient', 'name email');

    // Benzersiz hasta ID'lerini al (aynı hasta birden fazla randevusu olabilir)
    const uniquePatientIds = [...new Set(appointments.map(app => app.patient._id.toString()))];
    
    // Bu hastaların son mood kayıtları
    const patientMoods = [];
    for (let patientId of uniquePatientIds) {
      const lastMood = await Mood.findOne({ userId: patientId })
        .sort({ date: -1 });
      
      // Bu hasta ID'sine sahip ilk randevudan hasta bilgisini al
      const patient = appointments.find(app => 
        app.patient._id.toString() === patientId
      ).patient;

      patientMoods.push({
        patient,
        lastMood,
        lastMoodDate: lastMood ? moment(lastMood.date).fromNow() : 'Henüz kayıt yok'
      });
    }

    res.render('mood/my-patients-mood', {
      title: 'Hastalarım - Ruh Hali Durumu',
      patientMoods,
      moment
    });
  } catch (error) {
    console.error('Patients mood error:', error);
    req.flash('error', 'Hasta mood verileri yüklenirken bir hata oluştu.');
    res.redirect('/dashboard');
  }
};

// Belirli gün aralığı için mood verileri
exports.getMoodRange = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const grouping = req.query.grouping || 'day';
    const startDate = moment().subtract(days, 'days').startOf('day').toDate();

    const moods = await Mood.find({
      userId: req.session.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    let processedMoods = moods;

    // Sadece günlük veya haftalık gruplama için gruplama yap
    if (grouping === 'day' && days > 1) {
      const groupedMoods = {};
      moods.forEach(mood => {
        const dayKey = moment(mood.date).format('YYYY-MM-DD');
        
        // Eğer o gün için kayıt yoksa veya bu kayıt daha yeniyse
        if (!groupedMoods[dayKey] || moment(mood.date).isAfter(moment(groupedMoods[dayKey].date))) {
          groupedMoods[dayKey] = mood;
        }
      });

      processedMoods = Object.values(groupedMoods).sort((a, b) => 
        moment(a.date).diff(moment(b.date))
      );
    } else if (grouping === 'week') {
      const groupedMoods = {};
      moods.forEach(mood => {
        const weekKey = moment(mood.date).startOf('week').format('YYYY-WW');
        
        if (!groupedMoods[weekKey] || moment(mood.date).isAfter(moment(groupedMoods[weekKey].date))) {
          groupedMoods[weekKey] = mood;
        }
      });

      processedMoods = Object.values(groupedMoods).sort((a, b) => 
        moment(a.date).diff(moment(b.date))
      );
    }
    // minute ve hour için gruplama yapma, tüm kayıtları döndür

    res.json({
      success: true,
      moods: processedMoods,
      days,
      grouping,
      originalCount: moods.length,
      processedCount: processedMoods.length
    });
  } catch (error) {
    console.error('Mood range error:', error);
    res.json({ success: false, error: 'Veri alınamadı.' });
  }
};

// Psikolog için hasta mood range API
exports.getPatientMoodRange = async (req, res) => {
  try {
    const { patientId } = req.params;
    const psychologistId = req.session.user.id;
    const { days = 30, grouping = 'day' } = req.query;

    // Psikolog bu hastaya erişebilir mi kontrol et
    const hasAccess = await Appointment.findOne({
      psychologist: psychologistId,
      patient: patientId,
      status: { $in: ['confirmed', 'completed'] }
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Bu hastanın verilerine erişim yetkiniz yok'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moods = await Mood.find({
      userId: patientId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json({
      success: true,
      moods: moods,
      grouping: grouping
    });

  } catch (error) {
    console.error('Patient mood range error:', error);
    res.status(500).json({
      success: false,
      message: 'Mood verileri alınırken hata oluştu'
    });
  }
};