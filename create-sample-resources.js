require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('./models/Resource');
const User = require('./models/User');

// MongoDB bağlantısı
mongoose.connect('mongodb://root:adasdasdasd223d32d23d2@mongo.omerfarukkeskin.info:27017/?authSource=admin&tls=false')
  .then(async () => {
    console.log('✅ MongoDB bağlantısı başarılı');
    
    try {
      // Admin kullanıcısını bul
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        console.log('❌ Admin kullanıcı bulunamadı');
        process.exit(1);
      }

      // Örnek kaynaklar
      const sampleResources = [
        {
          title: 'Anksiyete ile Başa Çıkma: Kapsamlı Rehber',
          content: `Anksiyete, modern yaşamın kaçınılmaz bir parçası haline gelmiştir. Milyonlarca insan günlük yaşamında anksiyete ile mücadele etmektedir. Ancak doğru teknikler ve stratejilerle anksiyeteyi yönetmek ve yaşam kalitenizi artırmak mümkündür.

## Anksiyete Nedir?

Anksiyete, gelecekteki tehditler karşısında hissettiğimiz endişe, korku ve gerginlik duygusudur. Normal seviyelerde anksiyete bizi tehlikelerden korur ve performansımızı artırabilir. Ancak aşırı anksiyete günlük yaşamımızı olumsuz etkileyebilir.

## Anksiyetenin Belirtileri

Fiziksel belirtiler:
- Kalp çarpıntısı
- Nefes darlığı
- Terleme
- Titreme
- Mide bulantısı
- Baş dönmesi

Duygusal belirtiler:
- Sürekli endişe
- Huzursuzluk
- Irritabilite
- Konsantrasyon güçlüğü
- Uyku problemleri

## Etkili Başa Çıkma Teknikleri

### 1. Derin Nefes Alma Teknikleri

Diyafram nefesi anksiyeteyi hızla azaltmanın en etkili yollarından biridir:

**4-7-8 Tekniği:**
- Burnunuzdan 4 saniye nefes alın
- 7 saniye nefesi tutun
- Ağzınızdan 8 saniye nefes verin
- Bu döngüyü 4 kez tekrarlayın

**Karın Nefesi:**
- Bir elinizi göğsünüze, diğerini karnınıza koyun
- Sadece karın bölgenizin hareket etmesine odaklanın
- Yavaş ve derin nefes alın

### 2. Mindfulness ve Meditasyon

Mindfulness, şu ana odaklanma sanatıdır. Düşüncelerinizi yargılamadan gözlemlemeyi öğretir.

**Basit Mindfulness Egzersizi:**
- Rahat bir pozisyonda oturun
- Gözlerinizi kapatın
- Nefes alış verişinize odaklanın
- Düşünceler geldiğinde onları fark edin ve nazikçe nefese geri dönün
- Günde 10-20 dakika uygulayın

**Vücut Tarama Meditasyonu:**
- Ayak parmaklarınızdan başlayarak vücudunuzun her bölümüne odaklanın
- Her bölgedeki gerginlikleri fark edin ve serbest bırakın
- Bu teknik derin gevşeme sağlar

### 3. Bilişsel Teknikler

**Düşünce Kayıtları:**
Anksiyete yaratan düşüncelerinizi yazın ve şu soruları sorun:
- Bu düşünce ne kadar gerçekçi?
- En kötü senaryoda ne olabilir?
- Bu durumla başa çıkabilir miyim?
- Alternatif bakış açıları neler olabilir?

**Felaketleştirmeyi Durdurun:**
- "Ya olursa?" düşüncelerini fark edin
- Gerçekçi olasılıkları değerlendirin
- Geçmiş deneyimlerinizi hatırlayın

### 4. Fiziksel Aktivite ve Egzersiz

Düzenli egzersiz anksiyeteyi azaltmanın en güçlü yollarından biridir:

**Aerobik Egzersizler:**
- Hızlı yürüyüş (günde 30 dakika)
- Koşu
- Bisiklet
- Yüzme

**Yoga ve Tai Chi:**
- Zihin-beden bağlantısını güçlendirir
- Esneklik ve denge geliştirir
- Stres hormonlarını azaltır

### 5. Yaşam Tarzı Değişiklikleri

**Uyku Hijyeni:**
- Düzenli uyku saatleri
- Yatak odanızı sadece uyku için kullanın
- Yatmadan önce ekranlardan uzak durun
- Rahatlatıcı rutinler oluşturun

**Beslenme:**
- Kafein tüketimini sınırlayın
- Alkol ve nikotin kullanımını azaltın
- Düzenli öğünler alın
- Bol su için

**Sosyal Destek:**
- Güvendiğiniz kişilerle konuşun
- Destek gruplarına katılın
- Yalnız olmadığınızı hatırlayın
- Profesyonel yardım almaktan çekinmeyin

## Ne Zaman Profesyonel Yardım Almalısınız?

Şu durumlarda mutlaka bir uzmana başvurun:
- Anksiyete günlük yaşamınızı ciddi şekilde etkiliyor
- Panik ataklar yaşıyorsunuz
- Sosyal durumlardan kaçınıyorsunuz
- Uyku ve iştah problemleri yaşıyorsunuz
- Kendine zarar verme düşünceleri var

## Sonuç

Anksiyete ile mücadele bir maraton, sprint değildir. Sabır, pratik ve doğru tekniklerle anksiyeteyi yönetmek ve daha kaliteli bir yaşam sürmek mümkündür. Unutmayın, yardım istemek güçlülük işaretidir, zayıflık değil.

Her gün küçük adımlar atarak, anksiyetenizi kontrol altına alabilir ve daha huzurlu bir yaşam sürebilirsiniz.`,
          summary: 'Anksiyete ile başa çıkmak için pratik ve etkili teknikler. Nefes alma, mindfulness, egzersiz ve düşünce yönetimi yöntemleri.',
          category: 'anksiyete',
          tags: ['nefes alma', 'mindfulness', 'egzersiz', 'düşünce yönetimi'],
          readingTime: 12,
          author: admin._id
        },
        {
          title: 'Depresyonla Mücadele: Umut ve İyileşme Rehberi',
          content: `Depresyon, milyonlarca insanı etkileyen ciddi bir ruh sağlığı durumudur. Sadece "üzgün hissetmek" değil, yaşamın her alanını etkileyen kapsamlı bir deneyimdir. Ancak umut var: depresyon tedavi edilebilir ve iyileşmek mümkündür.

## Depresyon Nedir?

Depresyon, sürekli üzüntü, umutsuzluk ve yaşamdan zevk alamama ile karakterize edilen bir ruh hali bozukluğudur. Beyin kimyasındaki değişiklikler, genetik faktörler, yaşam olayları ve çevresel etkenler depresyona neden olabilir.

## Depresyonun Belirtileri

**Duygusal Belirtiler:**
- Sürekli üzüntü ve boşluk hissi
- Umutsuzluk ve çaresizlik
- Suçluluk ve değersizlik hisleri
- İrritabilite ve öfke
- Yaşamdan zevk alamama

**Fiziksel Belirtiler:**
- Enerji eksikliği ve yorgunluk
- Uyku problemleri (çok uyuma veya uykusuzluk)
- İştah değişiklikleri
- Konsantrasyon güçlüğü
- Fiziksel ağrılar

**Davranışsal Belirtiler:**
- Sosyal izolasyon
- Aktivitelerden kaçınma
- İş veya okul performansında düşüş
- Kişisel bakımı ihmal etme

## Depresyonla Mücadele Stratejileri

### 1. Profesyonel Yardım Almanın Önemi

**Terapi Seçenekleri:**
- **Bilişsel Davranışçı Terapi (BDT):** Olumsuz düşünce kalıplarını değiştirmeye odaklanır
- **Kişilerarası Terapi:** İlişki problemleri ve sosyal beceriler üzerine çalışır
- **Psikanalitik Terapi:** Geçmiş deneyimlerin etkilerini keşfeder

**İlaç Tedavisi:**
Gerekli durumlarda psikiyatrist tarafından antidepresan ilaçlar reçete edilebilir. İlaç tedavisi terapi ile birleştirildiğinde en etkili sonuçları verir.

### 2. Günlük Yaşam Rutinleri

**Uyku Hijyeni:**
- Düzenli uyku saatleri belirleyin
- Yatak odanızı sadece uyku için kullanın
- Yatmadan önce rahatlatıcı aktiviteler yapın
- Gündüz uykusundan kaçının

**Beslenme:**
- Düzenli öğünler alın
- Omega-3 açısından zengin gıdalar tüketin
- Şeker ve işlenmiş gıdaları sınırlayın
- Bol su için

**Günlük Planlama:**
- Küçük, ulaşılabilir hedefler koyun
- Günlük aktivite listesi oluşturun
- Başarılarınızı kaydedin
- Esnek olun, kendinizi zorlamayın

### 3. Fiziksel Aktivite ve Egzersiz

Egzersiz, depresyon tedavisinde ilaç kadar etkili olabilir:

**Aerobik Egzersizler:**
- Hızlı yürüyüş (günde 30 dakika)
- Koşu veya jogging
- Bisiklet sürme
- Dans etme

**Güç Antrenmanları:**
- Ağırlık kaldırma
- Direnç bantları
- Vücut ağırlığı egzersizleri

**Zihin-Beden Aktiviteleri:**
- Yoga
- Tai Chi
- Pilates
- Meditasyon

### 4. Sosyal Destek ve İlişkiler

**Sosyal Bağlantıları Güçlendirin:**
- Güvendiğiniz kişilerle düzenli iletişim kurun
- Sosyal aktivitelere katılın
- Destek gruplarına katılmayı düşünün
- Gönüllü çalışmalara katılın

**İletişim Becerileri:**
- Duygularınızı ifade etmeyi öğrenin
- Sınır koyma becerilerini geliştirin
- Çatışma çözme yöntemlerini öğrenin

### 5. Bilişsel Teknikler

**Olumsuz Düşünce Kalıplarını Tanıyın:**
- Felaketleştirme
- Siyah-beyaz düşünme
- Zihin okuma
- Kişiselleştirme

**Düşünce Değiştirme Teknikleri:**
- Kanıt arama: "Bu düşünceyi destekleyen kanıtlar neler?"
- Alternatif bakış açıları: "Bu duruma başka nasıl bakabilirim?"
- Gerçekçi değerlendirme: "En kötü, en iyi ve en olası senaryo nedir?"

### 6. Yaratıcı ve Anlamlı Aktiviteler

**Sanat Terapisi:**
- Resim yapma
- Müzik dinleme veya çalma
- Yazma ve günlük tutma
- El sanatları

**Anlam Bulma:**
- Değerlerinizi keşfedin
- Yaşam amacınızı tanımlayın
- Başkalarına yardım etme fırsatları arayın

## Kriz Anlarında Ne Yapmalı?

**Acil Durum İşaretleri:**
- Kendine zarar verme düşünceleri
- İntihar düşünceleri
- Gerçeklikten kopma
- Şiddetli panik ataklar

**Hemen Yardım Alın:**
- 112 Acil Servis
- En yakın hastane acil servisi
- Güvendiğiniz bir kişiyi arayın
- Kriz hatlarını kullanın

## İyileşme Süreci

**İyileşme Doğrusal Değildir:**
- İyi ve kötü günler olacak
- Geri adımlar normal
- Sabırlı olun
- Küçük ilerlemeleri kutlayın

**Uzun Vadeli Stratejiler:**
- Düzenli terapi seansları
- İlaç uyumunu sürdürme
- Sağlıklı yaşam tarzı alışkanlıkları
- Stres yönetimi teknikleri

## Sevdikleriniz İçin Rehber

**Nasıl Destek Olabilirsiniz:**
- Dinleyin, yargılamayın
- Sabırlı olun
- Profesyonel yardım almaya teşvik edin
- Kendinize de bakın

## Sonuç

Depresyon zorlu bir yolculuk olabilir, ancak iyileşmek mümkündür. Her gün küçük adımlar atarak, profesyonel destek alarak ve sevdiklerinizin yanında olduğunu bilerek bu süreci aşabilirsiniz.

Unutmayın: Yardım istemek güçlülük işaretidir. Yalnız değilsiniz ve umut her zaman vardır.`,
          summary: 'Depresyonla mücadele etmek için umut verici stratejiler. Profesyonel yardım, rutinler ve özbakım teknikleri.',
          category: 'depresyon',
          tags: ['profesyonel yardım', 'rutinler', 'sosyal destek', 'özbakım'],
          readingTime: 15,
          author: admin._id
        },
        {
          title: 'Stres Yönetimi: Sakin Kalmanın Yolları',
          content: `Modern yaşamda stres kaçınılmazdır. Önemli olan stresi nasıl yönettiğimizdir.

Etkili stres yönetimi teknikleri:

1. Zaman Yönetimi
Önceliklerinizi belirleyin. Yapılacaklar listesi oluşturun. Hayır demeyi öğrenin.

2. Gevşeme Teknikleri
Progressive kas gevşetme, yoga, tai chi gibi teknikleri deneyin.

3. Sağlıklı Yaşam Tarzı
Kafein ve alkol tüketimini sınırlayın. Düzenli uyku alın.

4. Problem Çözme Becerileri
Stres kaynaklarını belirleyin. Çözülebilir problemlere odaklanın.

5. Hobi ve Eğlence
Kendinize zaman ayırın. Sevdiğiniz aktiviteleri yapın.

6. Sosyal Destek Ağı
Güvendiğiniz kişilerle stresli durumları paylaşın.

Stres tamamen ortadan kalkmayabilir, ancak yönetilebilir.`,
          summary: 'Günlük yaşamda stresle başa çıkmak için pratik yöntemler. Zaman yönetimi, gevşeme ve problem çözme teknikleri.',
          category: 'stres-yonetimi',
          tags: ['zaman yönetimi', 'gevşeme', 'problem çözme', 'yaşam tarzı'],
          readingTime: 8,
          author: admin._id
        },
        {
          title: 'Sağlıklı İlişkiler Kurmanın Anahtarları',
          content: `Sağlıklı ilişkiler mutluluğun temel taşlarından biridir. İyi ilişkiler nasıl kurulur?

Sağlıklı ilişkilerin temelleri:

1. Etkili İletişim
Açık ve dürüst konuşun. Aktif dinleme yapın. Eleştiri yerine "ben" dili kullanın.

2. Karşılıklı Saygı
Farklılıkları kabul edin. Sınırları respekt edin. Birbirinizi olduğunuz gibi kabul edin.

3. Güven İnşası
Sözünüzde durun. Şeffaf olun. Hataları kabul edin ve özür dileyin.

4. Empati ve Anlayış
Karşınızdakinin perspektifini anlamaya çalışın. Duygularını geçerli görün.

5. Kaliteli Zaman
Birlikte anlamlı aktiviteler yapın. Teknolojisiz zaman geçirin.

6. Çatışma Çözümü
Anlaşmazlıkları yapıcı şekilde çözün. Kazanan-kaybeden değil, kazan-kazan yaklaşımı benimseyin.

İyi ilişkiler çaba gerektirir, ancak yaşam kalitesini önemli ölçüde artırır.`,
          summary: 'Sağlıklı ve mutlu ilişkiler kurmanın temel prensipleri. İletişim, saygı, güven ve empati becerileri.',
          category: 'iliskiler',
          tags: ['iletişim', 'saygı', 'güven', 'empati', 'çatışma çözümü'],
          readingTime: 9,
          author: admin._id
        },
        {
          title: 'Özgüven Geliştirme: Kendinize İnanın',
          content: `Özgüven, başarı ve mutluluğun anahtarıdır. Özgüveninizi nasıl geliştirebilirsiniz?

Özgüven geliştirme stratejileri:

1. Güçlü Yanlarınızı Keşfedin
Başarılarınızı listeleyin. Aldığınız övgüleri hatırlayın. Yeteneklerinizi fark edin.

2. Olumsuz İç Sesi Susturun
Kendinizi eleştiren düşünceleri fark edin. Bu düşünceleri gerçeklerle sorgulayın.

3. Küçük Hedefler Belirleyin
Ulaşılabilir hedefler koyun. Her başarıyı kutlayın. Adım adım ilerleyin.

4. Konfor Alanınızdan Çıkın
Yeni deneyimlere açık olun. Korkularınızla yüzleşin. Risk almayı öğrenin.

5. Vücut Dilinize Dikkat Edin
Dik durun. Göz teması kurun. Güvenli bir ses tonu kullanın.

6. Kendine Bakım
Fiziksel ve mental sağlığınıza önem verin. Kendinizi ödüllendirin.

Özgüven bir gün içinde gelişmez. Sabır ve pratik gerektirir.`,
          summary: 'Özgüveninizi artırmak için etkili yöntemler. Güçlü yanları keşfetme, hedef belirleme ve konfor alanından çıkma.',
          category: 'ozguven',
          tags: ['güçlü yanlar', 'hedef belirleme', 'konfor alanı', 'vücut dili'],
          readingTime: 7,
          author: admin._id
        },
        {
          title: 'Kaliteli Uyku İçin Pratik Öneriler',
          content: `Kaliteli uyku, fiziksel ve mental sağlığın temelidir. İyi uyku nasıl sağlanır?

Uyku kalitesini artırma yöntemleri:

1. Uyku Hijyeni
Düzenli uyku saatleri belirleyin. Yatak odanızı sadece uyku için kullanın.

2. Çevre Düzenlemesi
Oda sıcaklığını 18-20°C tutun. Karanlık ve sessiz ortam sağlayın.

3. Yatmadan Önce Rutinler
Rahatlatıcı aktiviteler yapın. Kitap okuyun, müzik dinleyin.

4. Teknoloji Kullanımı
Yatmadan 1 saat önce ekranlardan uzak durun. Mavi ışık filtresi kullanın.

5. Beslenme ve İçecekler
Akşam yemeğini erken yiyin. Kafein ve alkol tüketimini sınırlayın.

6. Fiziksel Aktivite
Düzenli egzersiz yapın, ancak yatmadan 3 saat önce bitirin.

7. Stres Yönetimi
Endişelerinizi günlük yazın. Meditasyon veya nefes egzersizleri yapın.

İyi uyku, daha iyi bir yaşam kalitesi demektir.`,
          summary: 'Kaliteli uyku için uyku hijyeni, çevre düzenlemesi ve yaşam tarzı önerileri. Daha iyi dinlenme teknikleri.',
          category: 'uyku-problemleri',
          tags: ['uyku hijyeni', 'çevre düzenlemesi', 'teknoloji', 'beslenme'],
          readingTime: 5,
          author: admin._id
        }
      ];

      // Mevcut kaynakları temizle
      await Resource.deleteMany({});
      console.log('🗑️ Mevcut kaynaklar temizlendi');

      // Yeni kaynakları ekle
      for (const resourceData of sampleResources) {
        const resource = new Resource(resourceData);
        await resource.save();
        console.log(`✅ Kaynak eklendi: ${resource.title}`);
      }

      console.log(`\n🎉 ${sampleResources.length} örnek kaynak başarıyla eklendi!`);
      console.log('📚 Resource Library kullanıma hazır');
      
    } catch (error) {
      console.error('❌ Hata:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err);
  }); 