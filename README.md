# Mimario - Mimarlar için Akıllı Asistan

## 📋 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Özellikler](#özellikler)
- [Tech-Stack](#tech-stack)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Mimari Yapı](#mimari-yapı)
- [Katkıda Bulunma](#katkıda-bulunma)
- [İletişim](#iletişim)

## 🏛️ Proje Hakkında

**Mimario**, mimarların yönetmelikler ve temel dokümanları yükleyip sorular sorabilecekleri, yapay zeka destekli bir asistan platformudur. Mimari projelerin planlama, tasarım ve onay süreçlerinde karşılaşılan karmaşık yönetmelik ve standartları hızla yorumlayıp cevaplamak için geliştirilmiştir.

Gelişmiş yapay zeka alt yapısı ve kullanıcı dostu arayüzü ile Mimario, mimarların yönetmeliklerle ilgili sorularını anında cevaplayarak tasarım sürecini hızlandırır, uyumluluk sorunlarını en aza indirir ve zaman tasarrufu sağlar.

## ✨ Özellikler

- **Akıllı Dokümantasyon Araması**: Yüklenen yönetmelikler ve teknik dokümanlar içinde semantik arama yaparak en doğru bilgiyi bulur.

- **Sohbet Tabanlı Arayüz**: Mimari terminolojiye özel eğitilmiş chat modeli ile doğal dilde sorulara yanıt verir.

- **Doküman Yönetimi**: Yönetmelikler, teknik şartnameler ve standartları kategorilere ayırarak organize eder.

- **Kişiselleştirilmiş Deneyim**: Kullanıcıların sık sorduğu sorular ve ilgilendikleri alanlara göre öneri sistemi sunar.

- **Çoklu Dil Desteği**: Türkçe ve İngilizce dillerinde yönetmelik sorgulaması yapabilme.

- **Mobil Uyumluluk**: Şantiye ortamında veya hareket halindeyken bile kullanılabilir.

- **Erişilebilirlik**: WCAG standartlarına uygun, herkes için erişilebilir arayüz.

## 🛠️ Tech-Stack

### Frontend (Mevcut)

- **React**: Kullanıcı arayüzü geliştirme
- **TypeScript**: Tip güvenli kod geliştirme
- **Material UI**: Modern ve duyarlı tasarım bileşenleri
- **React Router**: Sayfa yönlendirmeleri
- **React Hook Form**: Form yönetimi ve doğrulama
- **Framer Motion**: Animasyonlar ve geçişler
- **Vite**: Hızlı geliştirme ortamı

### Backend (Planlanan)

- **Firebase**: Kimlik doğrulama, veritabanı ve depolama için başlangıç çözümü
- **LangChain**: Büyük Dil Modelleri (LLM) ile uygulama geliştirme
- **LangGraph**: Karmaşık sorgular için akış kontrolü
- **LangSmith**: LLM uygulamaları için izleme ve iyileştirme
- **Node.js**: Sunucu tarafı geliştirme

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18.0.0 veya üzeri)
- npm veya yarn

### Adımlar

1. Repo'yu klonlayın

```bash
git clone https://github.com/OBK-LLC/Mimario.git
cd Mimario
```

2. Bağımlılıkları yükleyin

```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın

```bash
npm run dev
# veya
yarn dev
```

4. Tarayıcınızda açın

```
http://localhost:5173
```

## 📝 Kullanım

### Hesap Oluşturma

- "Kayıt Ol" butonuna tıklayarak yeni bir hesap oluşturun
- E-posta ve şifre bilgilerinizi girin veya Google hesabınızla hızlıca kayıt olun

### Soru Sorma

- Chat arayüzünden mimari yönetmeliklerle ilgili sorularınızı sorun
- Örnek: "Yangın merdiveni genişliği için minimum ölçüler nelerdir?"

### Sonuçları Kaydetme

- Aldığınız yanıtları kaydedin ve projenizde referans olarak kullanın
- Görüşmelerinize daha sonra erişmek için sohbet geçmişini kaydedebilirsiniz

## 🏗️ Mimari Yapı

Proje, modern bir React uygulaması olarak yapılandırılmıştır:

```
mimario/
├── public/             # Statik dosyalar
├── src/                # Kaynak kodlar
│   ├── assets/         # Resimler, fontlar vb.
│   ├── components/     # Tekrar kullanılabilir bileşenler
│   ├── pages/          # Sayfa bileşenleri
│   │   ├── home/       # Ana sayfa
│   │   ├── chat/       # Sohbet arayüzü
│   │   ├── login/      # Giriş sayfası
│   │   ├── signup/     # Kayıt sayfası
│   │   └── ...
│   ├── theme/          # Tema ve stil konfigürasyonu
│   ├── types/          # TypeScript tip tanımlamaları
│   ├── App.tsx         # Ana uygulama bileşeni
│   └── main.tsx        # Uygulama giriş noktası
└── ...
```

## 👥 Katkıda Bulunma

Mimario'ya katkıda bulunmak istiyorsanız:

1. Bu repo'yu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Katkı Kuralları

- Kod standardı olarak ESLint kurallarına uyun
- Yeni özellikler için test yazın
- Dokümentasyonu güncel tutun

## 📞 İletişim

OBK LLC - info@tradewizz.co

Proje Linki: [https://github.com/OBK-LLC/Mimario](https://github.com/OBK-LLC/Mimario)

---

⭐️ **Mimario - Mimarların dijital asistanı** ⭐️
