const mongoose = require('mongoose');
require('./config/database');

const Appointment = require('./models/Appointment');

async function createTestData() {
    try {
        console.log('🔄 Test verisi oluşturuluyor...');
        
        // Test randevuları oluştur
        const testAppointments = [
            {
                patient: '683da8d52d26d94215479a86', // Test hasta ID
                psychologist: '683da8d52d26d94215479a89', // Test psikolog ID  
                date: new Date(),
                time: '10:00',
                status: 'confirmed',
                notes: 'Test randevusu 1'
            },
            {
                patient: '683da8d52d26d94215479a86',
                psychologist: '683da8d52d26d94215479a89',
                date: new Date(Date.now() + 24*60*60*1000), // Yarın
                time: '14:00',
                status: 'pending',
                notes: 'Test randevusu 2'
            },
            {
                patient: '683da8d52d26d94215479a86',
                psychologist: '683da8d52d26d94215479a89',
                date: new Date(Date.now() - 24*60*60*1000), // Dün
                time: '11:00',
                status: 'completed',
                notes: 'Test randevusu 3',
                sessionNotes: 'Test seans notları - hasta iyi durumda'
            }
        ];
        
        // Eski test verilerini sil
        await Appointment.deleteMany({
            patient: '683da8d52d26d94215479a86',
            psychologist: '683da8d52d26d94215479a89'
        });
        
        // Yeni test verilerini ekle
        for (const appointmentData of testAppointments) {
            const appointment = new Appointment(appointmentData);
            const saved = await appointment.save();
            console.log(`✅ Randevu oluşturuldu: ${saved._id} (${saved.status})`);
        }
        
        console.log('🎉 Test verileri başarıyla oluşturuldu!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

createTestData(); 