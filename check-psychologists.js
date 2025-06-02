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
      specialization: String,
      experience: String,
      education: String,
      bio: String,
      phone: String,
      createdAt: { type: Date, default: Date.now }
    });
    const User = mongoose.model('User', userSchema);
    
    // Tüm psikologları getir
    const psychologists = await User.find({ role: 'psychologist' });
    
    console.log('\n👨‍⚕️ PSIKOLOGLAR:');
    console.log('=============================');
    
    if (psychologists.length === 0) {
      console.log('❌ Hiç psikolog bulunamadı.');
    } else {
      console.log(`✅ Toplam ${psychologists.length} psikolog bulundu:\n`);
      
      psychologists.forEach((psychologist, index) => {
        console.log(`${index + 1}. PSIKOLOG:`);
        console.log(`   📋 ID: ${psychologist._id}`);
        console.log(`   👤 İsim: ${psychologist.name}`);
        console.log(`   📧 Email: ${psychologist.email}`);
        console.log(`   🎯 Uzmanlık: ${psychologist.specialization || 'Belirtilmemiş'}`);
        console.log(`   ✅ Onaylandı: ${psychologist.isApproved ? 'Evet' : 'Hayır'}`);
        console.log(`   💼 Deneyim: ${psychologist.experience || 'Belirtilmemiş'}`);
        console.log(`   🎓 Eğitim: ${psychologist.education || 'Belirtilmemiş'}`);
        console.log(`   📱 Telefon: ${psychologist.phone || 'Belirtilmemiş'}`);
        console.log(`   📝 Bio: ${psychologist.bio ? psychologist.bio.substring(0, 100) + '...' : 'Yok'}`);
        console.log(`   📅 Kayıt: ${new Date(psychologist.createdAt).toLocaleDateString('tr-TR')} ${new Date(psychologist.createdAt).toLocaleTimeString('tr-TR')}`);
        console.log('   ─────────────────────────────────────');
      });
    }
    
    // Tüm kullanıcıların rollerini özetle
    const allUsers = await User.find({});
    const roleCounts = {
      patient: allUsers.filter(user => user.role === 'patient').length,
      psychologist: allUsers.filter(user => user.role === 'psychologist').length,
      approvedPsychologists: allUsers.filter(user => user.role === 'psychologist' && user.isApproved).length
    };
    
    console.log('\n📊 KULLANICI İSTATİSTİKLERİ:');
    console.log('=============================');
    console.log(`👥 Toplam Kullanıcı: ${allUsers.length}`);
    console.log(`🤒 Hastalar: ${roleCounts.patient}`);
    console.log(`👨‍⚕️ Psikologlar: ${roleCounts.psychologist}`);
    console.log(`✅ Onaylanmış Psikologlar: ${roleCounts.approvedPsychologists}`);
    console.log(`⏳ Onay Bekleyen Psikologlar: ${roleCounts.psychologist - roleCounts.approvedPsychologists}`);
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }); 