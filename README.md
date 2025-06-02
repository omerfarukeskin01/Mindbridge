# Mindbridge - Modern Psikoloji Danışmanlık Platformu

Mindbridge, psikologlar ve hastalar arasında güvenli bir köprü kuran modern bir web uygulamasıdır. MVC pattern kullanılarak Express.js, EJS ve MongoDB teknolojileri ile geliştirilmiştir.

## 🏗️ Modern Proje Mimarisi

### 📁 Proje Yapısı
```
mindbridge/
├── config/                 # Konfigürasyon dosyaları
│   ├── database.js        # MongoDB bağlantı yapılandırması
│   └── socketConfig.js    # Socket.io yapılandırması
├── controllers/           # MVC Controller katmanı
│   ├── authController.js  # Kimlik doğrulama kontrolü
│   └── dashboardController.js # Dashboard kontrolü
├── services/              # Business Logic katmanı
│   ├── authService.js     # Kimlik doğrulama servisi
│   ├── userService.js     # Kullanıcı servisi
│   └── appointmentService.js # Randevu servisi
├── middleware/            # Middleware katmanı
│   └── authMiddleware.js  # Kimlik doğrulama middleware
├── routes/                # Route tanımları
│   ├── authRoutes.js      # Kimlik doğrulama rotaları
│   └── dashboardRoutes.js # Dashboard rotaları
├── models/                # Mongoose modelleri
│   ├── User.js           # Kullanıcı modeli
│   ├── Appointment.js    # Randevu modeli
│   └── Message.js        # Mesaj modeli
├── views/                 # EJS template'leri
│   ├── auth/             # Kimlik doğrulama sayfaları
│   ├── dashboard/        # Dashboard sayfaları
│   ├── chat/             # Chat sayfaları
│   ├── psychologists/    # Psikolog sayfaları
│   ├── error.ejs         # Hata sayfası
│   ├── 404.ejs          # 404 sayfası
│   └── index.ejs         # Anasayfa
├── public/               # Statik dosyalar
│   ├── css/              # CSS dosyaları
│   ├── js/               # JavaScript dosyaları
│   └── uploads/          # Yüklenen dosyalar
├── app.js                # Ana uygulama dosyası (temizlenmiş)
├── package.json          # NPM bağımlılıkları
├── .env                  # Çevre değişkenleri
└── README.md             # Bu dosya
```

## 🌟 Özellikler

### 👥 Kullanıcı Yönetimi
- **Hasta Kayıt Sistemi**: Kullanıcılar hasta olarak kolayca kayıt olabilir
- **Psikolog Kayıt ve Onay Sistemi**: Psikologlar özel bilgilerle kayıt olur ve admin onayı bekler
- **Güvenli Giriş Sistemi**: Bcrypt ile şifrelenmiş kimlik doğrulama
- **Rol Tabanlı Yetkilendirme**: Hasta ve psikolog rolleri için farklı yetki seviyeleri

### 📅 Randevu Yönetimi
- **Randevu Alma**: Hastalar psikologlardan randevu alabilir
- **Randevu Onaylama**: Psikologlar gelen randevu taleplerini onaylayabilir
- **Randevu Takibi**: Bekleyen, onaylı, tamamlanan randevuları görüntüleme
- **Çakışma Kontrolü**: Aynı psikolog için zaman çakışması kontrolü
- **Seans Notları**: Psikologlar tamamlanan seanslar için not ekleyebilir

### 💬 Gerçek Zamanlı Mesajlaşma
- **Socket.io ile Anlık Chat**: Gerçek zamanlı mesajlaşma sistemi
- **Dosya Paylaşımı**: Görsel ve doküman paylaşma özelliği
- **Mesaj Durumu**: Okundu/okunmadı bilgisi
- **Typing Indicators**: Yazma durumu göstergeleri
- **Güvenli İletişim**: Sadece onaylı randevuları olan kullanıcılar arası mesajlaşma

### 📊 Dashboard ve Raporlama
- **Hasta Dashboard'u**: Randevular, psikolog arama, mesajlaşma
- **Psikolog Dashboard'u**: Randevu yönetimi, hasta takibi, istatistikler
- **İstatistiksel Veriler**: Aylık randevu sayıları, tamamlanan seanslar
- **Gelişmiş Filtreleme**: Tarih ve durum bazlı filtreleme

## 🛠️ Teknolojiler

### Backend Architecture
- **MVC Pattern**: Model-View-Controller mimari deseni
- **Service Layer**: İş mantığı için ayrı servis katmanı
- **Middleware Layer**: Kimlik doğrulama ve yetkilendirme katmanı
- **Configuration Layer**: Merkezi konfigürasyon yönetimi

### Core Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Gerçek zamanlı iletişim

### Security & Authentication
- **Bcrypt**: Şifre hashleme
- **Express-session**: Oturum yönetimi
- **Multer**: Güvenli dosya yükleme
- **Input Validation**: Girdi doğrulama

### Frontend
- **EJS**: Template engine
- **Bootstrap 5**: Modern CSS framework
- **Font Awesome**: Icon library
- **Socket.io Client**: Gerçek zamanlı client
- **Moment.js**: Tarih işlemleri

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel kurulum veya cloud)
- NPM veya Yarn

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd mindbridge
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın ve gerçek değerlerle doldurun:

```bash
cp .env.example .env
```

Ardından `.env` dosyasını düzenleyerek kendi değerlerinizi girin:

```env
# Örnek değerler - gerçek değerlerle değiştirin
MONGODB_URI=mongodb://kullanici:sifre@host:port/veritabani_adi?authSource=admin&tls=false
SESSION_SECRET=gercek_guvenli_session_anahtari
PORT=3000
NODE_ENV=development
```

**⚠️ Önemli Güvenlik Uyarısı:** 
- `.env` dosyasını asla git'e commit etmeyin
- Gerçek veritabanı kimlik bilgilerinizi kullanın
- Production için güçlü bir SESSION_SECRET oluşturun

### 4. Gerekli Klasörleri Oluşturun
```bash
mkdir -p public/uploads
```

### 5. Uygulamayı Başlatın
```bash
# Geliştirme modu (nodemon ile)
npm run dev

# Production modu
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🏛️ Mimari Açıklaması

### MVC Pattern Implementation

#### Models (models/)
- **User.js**: Kullanıcı veri modeli ve schema
- **Appointment.js**: Randevu veri modeli
- **Message.js**: Mesaj veri modeli

#### Views (views/)
- **EJS Templates**: Server-side rendering
- **Responsive Design**: Bootstrap 5 ile mobile-first
- **Component Structure**: Yeniden kullanılabilir template parçaları

#### Controllers (controllers/)
- **authController.js**: Kimlik doğrulama işlemleri
- **dashboardController.js**: Dashboard operasyonları
- **Request/Response Handling**: HTTP isteklerinin yönetimi

#### Services (services/)
- **Business Logic Layer**: İş kuralları ve mantığı
- **Data Access Layer**: Veritabanı işlemleri
- **Reusable Components**: Yeniden kullanılabilir fonksiyonlar

#### Routes (routes/)
- **Modular Routing**: Özellik bazlı route grupları
- **Middleware Integration**: Kimlik doğrulama ve yetkilendirme
- **RESTful Design**: REST API prensiplerine uygun

#### Middleware (middleware/)
- **Authentication**: Kimlik doğrulama kontrolü
- **Authorization**: Yetkilendirme kontrolleri
- **Error Handling**: Hata yakalama ve işleme

#### Configuration (config/)
- **Database Config**: MongoDB bağlantı yönetimi
- **Socket Config**: Real-time iletişim yapılandırması
- **Environment Config**: Ortam değişkenleri yönetimi

## 🎯 Kullanım

### Hasta Olarak
1. **Kayıt Ol**: Anasayfadan "Kayıt Ol" ile hasta hesabı oluşturun
2. **Giriş Yap**: E-posta ve şifrenizle giriş yapın
3. **Psikolog Seç**: "Psikologlar" sayfasından uygun psikoloğu seçin
4. **Randevu Al**: Dashboard'dan randevu talebinde bulunun
5. **Mesajlaş**: Onaylanan randevulardan sonra psikologla mesajlaşın

### Psikolog Olarak
1. **Kayıt Ol**: "Psikolog" seçeneği ile kayıt olun (admin onayı gerekir)
2. **Giriş Yap**: Onay sonrası giriş yapabilirsiniz
3. **Randevu Yönet**: Dashboard'dan gelen randevu taleplerini yönetin
4. **Seansları Tamamla**: Randevu sonrası seans notları ekleyin
5. **Hastalarla İletişim**: Mesajlaşma sistemi ile hastaları takip edin

## 🔧 API Endpoints

### Authentication Routes
- `GET /login` - Giriş sayfası
- `POST /login` - Kullanıcı girişi
- `GET /register` - Kayıt sayfası
- `POST /register` - Kullanıcı kaydı
- `GET /logout` - Çıkış

### Dashboard Routes
- `GET /dashboard` - Kullanıcı dashboard'u (role-based)

### Appointment Routes (Gelecek güncellemelerde)
- `POST /appointments` - Yeni randevu oluştur
- `PUT /appointments/:id/confirm` - Randevu onayla
- `PUT /appointments/:id/complete` - Seansı tamamla

### Message Routes (Gelecek güncellemelerde)
- `GET /messages` - Mesaj listesi
- `GET /messages/:userId` - Kullanıcı ile konuşma
- `POST /upload` - Dosya yükleme

### Socket Events
- `join-room` - Odaya katıl
- `send-message` - Mesaj gönder
- `receive-message` - Mesaj al
- `typing-start` - Yazma başladı
- `typing-stop` - Yazma durdu

## 🔐 Güvenlik Özellikleri

- **Password Hashing**: Bcrypt ile güvenli şifre saklama
- **Session Management**: Express-session ile oturum kontrolü
- **File Upload Security**: Multer ile kontrollü dosya yükleme
- **Input Validation**: Hem client hem server-side validasyon
- **Role-based Access**: Rol bazlı erişim kontrolü
- **Error Handling**: Güvenli hata yakalama ve kullanıcı bilgilendirme

## 📱 Responsive Tasarım

Uygulama tüm cihaz türlerinde mükemmel çalışır:
- 📱 Mobil telefonlar (320px+)
- 📱 Tabletler (768px+)
- 💻 Masaüstü bilgisayarlar (1024px+)
- 🖥️ Büyük ekranlar (1200px+)

## 🚦 Performance Features

- **Graceful Shutdown**: Güvenli uygulama kapatma
- **Error Boundaries**: Hata sınırları
- **Database Connection Pooling**: Veritabanı bağlantı havuzu
- **Static File Serving**: Optimize edilmiş statik dosya servisi
- **Socket Connection Management**: Socket bağlantı yönetimi

## 🔄 Development Workflow

### Code Organization
- **Separation of Concerns**: Endişelerin ayrılması
- **Single Responsibility**: Tek sorumluluk prensibi
- **DRY Principle**: Kendini tekrar etme
- **Clean Code**: Temiz kod standartları

### Error Handling
- **Global Error Handler**: Merkezi hata yakalayıcı
- **Custom Error Pages**: Özel hata sayfaları
- **Logging**: Hata ve işlem kayıtları
- **User-friendly Messages**: Kullanıcı dostu hata mesajları

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
