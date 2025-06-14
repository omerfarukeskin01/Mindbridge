# Mood Tracker Özelliği - Görev Planı

## Proje Genel Bilgileri
- **Proje Adı:** Mindbridge
- **Teknoloji Stack:** Node.js, Express.js, MongoDB, Mongoose, EJS
- **Mevcut Özellikler:** Kullanıcı yönetimi, randevu sistemi, chat, admin paneli

---

## Adım 1: Veritabanı Modeli Oluşturma

### 1.1 Mood Model (models/Mood.js)
```javascript
// Oluşturulacak alanlar:
- userId (ObjectId, ref: 'User')
- moodLevel (Number, 1-10 arası)
- emotions (Array of Strings)
- notes (String, isteğe bağlı)
- triggers (Array of Strings, isteğe bağlı)
- date (Date, default: Date.now)
- createdAt (Date)
- updatedAt (Date)
```

### 1.2 User Model Güncelleme
- User modeline mood tracking ile ilgili alanlar eklenebilir (isteğe bağlı)

---

## Adım 2: Controller Oluşturma

### 2.1 Mood Controller (controllers/moodController.js)
**Fonksiyonlar:**
- `addMoodEntry` - Yeni ruh hali kaydı ekleme
- `getMoodHistory` - Kullanıcının ruh hali geçmişi
- `getMoodAnalytics` - İstatistikler ve trendler
- `updateMoodEntry` - Kayıt güncelleme
- `deleteMoodEntry` - Kayıt silme
- `getDailyMood` - Günlük ruh hali
- `getWeeklyTrend` - Haftalık trend
- `getMonthlyReport` - Aylık rapor
- **`getPatientMoodForPsychologist` - Psikolog için hasta mood verileri**
- **`getAppointmentPatientsMood` - Randevulu hastaların mood durumu**

---

## Adım 3: Routes Oluşturma

### 3.1 Mood Routes (routes/moodRoutes.js)
**API Endpoints:**
- `GET /mood` - Mood dashboard sayfası
- `POST /mood/add` - Yeni mood kaydı
- `GET /mood/history` - Geçmiş kayıtlar sayfası
- `GET /mood/analytics` - Analiz sayfası
- `GET /mood/api/data` - JSON veri (AJAX için)
- `PUT /mood/update/:id` - Kayıt güncelleme
- `DELETE /mood/delete/:id` - Kayıt silme
- **`GET /mood/patient/:patientId` - Psikolog için hasta mood verileri**
- **`GET /mood/my-patients` - Psikolog'un hastalarının mood durumu**

---

## Adım 4: Views Oluşturma

### 4.1 EJS Template'leri (views/mood/)
**Sayfalar:**
- `mood-dashboard.ejs` - Ana mood paneli
- `mood-entry.ejs` - Yeni kayıt formu
- `mood-history.ejs` - Geçmiş kayıtlar
- `mood-analytics.ejs` - Grafikler ve analizler
- **`patient-mood-view.ejs` - Psikolog için hasta mood görünümü**
- **`my-patients-mood.ejs` - Psikolog'un tüm hastalarının mood durumu**

**Partials:**
- `mood-widget.ejs` - Dashboard widget'ı
- `mood-chart.ejs` - Grafik component'i
- `mood-calendar.ejs` - Takvim görünümü

---

## Adım 5: Frontend Geliştirme

### 5.1 JavaScript Dosyaları (public/js/)
- `mood-tracker.js` - Ana mood tracking logic
- `mood-charts.js` - Grafik işlemleri
- `mood-calendar.js` - Takvim işlemleri

### 5.2 CSS Dosyaları (public/css/)
- `mood-tracker.css` - Mood tracker stilleri
- Mevcut CSS dosyalarına entegrasyon

### 5.3 Kütüphane Eklemeleri
- Chart.js - Grafik kütüphanesi
- Moment.js (zaten mevcut) - Tarih işlemleri

---

## Adım 6: Ana Uygulama Entegrasyonu

### 6.1 App.js Güncellemeleri
- Mood routes'ları ekleme
- Middleware konfigürasyonları

### 6.2 Dashboard Entegrasyonu
- Ana dashboard'a mood widget ekleme
- Kullanıcı rolüne göre görünüm ayarları

### 6.3 Navigation Güncellemeleri
- Menüye mood tracker linklerini ekleme

---

## Adım 7: Özellik Detayları

### 7.1 Mood Entry Özellikleri
- 1-10 arası mood seviyesi seçici
- Emoji tabanlı mood seçimi
- Çoklu duygu seçimi (mutlu, üzgün, kaygılı, vb.)
- Not ekleme alanı
- Tetikleyici faktörler

### 7.2 Analytics Özellikleri
- Günlük mood trendi
- Haftalık/aylık ortalamalar
- Mood dağılım grafikleri
- En sık yaşanan duygular
- Tetikleyici analizi

### 7.3 Görselleştirme
- Line chart - Zaman içinde mood değişimi
- Bar chart - Duygu dağılımı
- Pie chart - Mood seviye dağılımı
- Calendar view - Günlük mood görünümü

---

## Adım 8: Kullanıcı Deneyimi

### 8.1 Patient (Hasta) Özellikleri
- Kendi mood verilerini görme
- Günlük mood girişi
- Kişisel analytics
- Mood geçmişi

### 8.2 Psychologist (Psikolog) Özellikleri
- Hastalarının mood verilerini görme
- Hasta mood trendlerini analiz etme
- Randevu öncesi mood durumu kontrolü
- **Randevu aldığı hastaların mood geçmişini görme**
- **Aktif randevuları olan hastaların güncel mood durumu**

### 8.3 Admin Özellikleri
- Genel mood istatistikleri
- Platform geneli mood trendleri

---

## Adım 9: Güvenlik ve Validasyon

### 9.1 Data Validation
- Mood level validasyonu (1-10)
- Tarih validasyonu
- Kullanıcı yetkilendirmesi

### 9.2 Privacy
- Kullanıcılar sadece kendi verilerini görebilir
- Psikologlar sadece hastalarının verilerini görebilir
- **Psikolog-hasta ilişkisi Appointment tablosu üzerinden kontrol edilir**
- **Sadece aktif randevusu olan psikolog, hastanın mood verilerini görebilir**

---

## Adım 10: Test ve Deployment

### 10.1 Test Senaryoları
- Mood entry ekleme/silme/güncelleme
- Analytics hesaplamaları
- Kullanıcı yetkilendirmeleri
- Responsive design testi

### 10.2 Database Migration
- Test verileri oluşturma
- Mevcut kullanıcılar için uyumluluk

---

## Adım 11: Psikolog-Hasta Mood Entegrasyonu

### 11.1 Randevu Sistemi Entegrasyonu
- Appointment modeli ile Mood modeli arasında ilişki kurma
- Psikolog dashboard'ında hasta mood widget'ları
- Randevu detay sayfasında hasta mood geçmişi

### 11.2 Yetkilendirme Sistemi
- Psikolog sadece randevusu olan hastaların mood verilerini görebilir
- Middleware ile yetki kontrolü
- Appointment tablosu üzerinden ilişki doğrulama

### 11.3 Psikolog Dashboard Özellikleri
- Bugünkü randevuları olan hastaların mood durumu
- Hasta mood trend uyarıları (düşük mood, ani değişimler)
- Randevu öncesi hasta mood özeti

---

## Implementasyon Sırası

1. **Öncelik 1:** Model ve Controller oluşturma
2. **Öncelik 2:** Temel routes ve views
3. **Öncelik 3:** Frontend JavaScript ve CSS
4. **Öncelik 4:** Analytics ve grafikler
5. **Öncelik 5:** Dashboard entegrasyonu
6. **Öncelik 6:** Test ve optimizasyon

---

## Tahmini Süre
- **Toplam:** 3-5 gün
- **Backend:** 1-2 gün
- **Frontend:** 1-2 gün
- **Entegrasyon ve Test:** 1 gün

---

## Gerekli Paketler
```json
{
  "chart.js": "^4.0.0", // Grafik kütüphanesi
  "moment": "^2.29.4"    // Zaten mevcut
}
``` 