const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://root:adasdasdasd223d32d23d2@mongo.omerfarukkeskin.info:27017/?authSource=admin&tls=false')
  .then(async () => {
    console.log('✅ MongoDB bağlantısı başarılı');
    
    // User modelini tanımla
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, enum: ['patient', 'psychologist'] },
      isApproved: { type: Boolean, default: false },
      specialization: String
    });
    const User = mongoose.model('User', userSchema);
    
    // Appointment modelini tanımla
    const appointmentSchema = new mongoose.Schema({
      patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      psychologist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      duration: { type: Number, default: 60 },
      status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
      notes: { type: String, maxlength: 500 },
      sessionNotes: { type: String, maxlength: 1000 },
      createdAt: { type: Date, default: Date.now }
    });
    
    const Appointment = mongoose.model('Appointment', appointmentSchema);
    
    // Tüm randevuların durumunu özetle
    const allAppointments = await Appointment.find({});
    const statusCounts = {
      pending: allAppointments.filter(apt => apt.status === 'pending').length,
      confirmed: allAppointments.filter(apt => apt.status === 'confirmed').length,
      completed: allAppointments.filter(apt => apt.status === 'completed').length,
      cancelled: allAppointments.filter(apt => apt.status === 'cancelled').length
    };
    
    console.log('\n📊 RANDEVU İSTATİSTİKLERİ:');
    console.log('=============================');
    console.log(`⏳ Bekleyen: ${statusCounts.pending}`);
    console.log(`✅ Onaylanmış: ${statusCounts.confirmed}`);
    console.log(`✔️ Tamamlanmış: ${statusCounts.completed}`);
    console.log(`❌ İptal Edilmiş: ${statusCounts.cancelled}`);
    console.log(`📋 Toplam: ${allAppointments.length}`);
    
    if (statusCounts.confirmed > 0) {
      console.log('\n🎉 Evet, sistemde onaylanmış randevular var!');
      console.log('Psikolog panelinden "Planlanmış Seanslar" sekmesinde görebilirsiniz.');
    } else {
      console.log('\n❌ Şu anda onaylanmış randevu yok.');
      console.log('Önce hasta randevu almalı, sonra psikolog onaylamalı.');
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }); 