# UstaFlow Lite — Implementation Plan

## 1. Proje Özeti

**Proje adı:** UstaFlow Lite
**Proje türü:** Web tabanlı teknik servis ve saha görev yönetim sistemi
**Geliştirme süresi:** 4 hafta
**Ekip büyüklüğü:** 1 geliştirici
**Temel teknolojiler:** Next.js, TypeScript ve PostgreSQL
**Geliştirme yöntemi:** GitHub tabanlı, issue ve pull request odaklı geliştirme
**Hedef sürüm:** `v1.0.0 MVP`

UstaFlow Lite; teknik servis firmalarının müşteri kayıtlarını, servis taleplerini, teknik personel atamalarını ve iş durumlarını tek panel üzerinden yönetmesini sağlayan web tabanlı bir uygulamadır.

Projenin temel amacı; telefon, WhatsApp ve defter üzerinden yürütülen dağınık servis süreçlerini dijital, takip edilebilir ve raporlanabilir hâle getirmektir.

---

# 2. Problem Tanımı

Küçük ve orta ölçekli teknik servis firmalarında servis süreçleri genellikle telefon görüşmeleri, mesajlaşma uygulamaları ve fiziksel notlar üzerinden yönetilmektedir.

Bu yöntem aşağıdaki problemlere neden olmaktadır:

* Servis taleplerinin kaybolması
* Müşteri geçmişinin takip edilememesi
* Hangi teknisyenin hangi göreve atandığının bilinmemesi
* Randevuların unutulması
* Görev durumlarının takip edilememesi
* Yapılan işlemlerin kayıt altına alınmaması
* Kullanılan malzemelerin unutulması
* Tamamlanan ve geciken işlerin raporlanamaması
* Yönetici ve teknik personel arasında bilgi kopukluğu yaşanması

UstaFlow Lite bu süreçleri merkezi bir sistem üzerinden yönetmeyi amaçlamaktadır.

---

# 3. Projenin Hedefi

Dört haftalık geliştirme sürecinin sonunda aşağıdaki temel iş akışının eksiksiz çalışması hedeflenmektedir:

```text
Yönetici giriş yapar
        ↓
Müşteri oluşturur
        ↓
Servis talebi oluşturur
        ↓
Talebi teknik personele atar
        ↓
Teknik personel görevi görüntüler
        ↓
Görev durumunu günceller
        ↓
Servis notu ve kullanılan malzemeleri ekler
        ↓
Görev tamamlanır
        ↓
Yönetici sonucu dashboard üzerinden görüntüler
```

Projenin yalnızca ekranlardan oluşan bir CRUD uygulaması olmaması için servis taleplerine ait gerçek bir durum yönetimi ve işlem geçmişi bulunacaktır.

---

# 4. Kullanıcı Rolleri

Uygulamada iki temel kullanıcı rolü bulunacaktır.

## 4.1 Yönetici

Yönetici aşağıdaki işlemleri gerçekleştirebilir:

* Kullanıcı girişi yapabilir.
* Teknik personel oluşturabilir.
* Müşteri oluşturabilir.
* Müşteri bilgilerini güncelleyebilir.
* Servis talebi oluşturabilir.
* Servis talebini teknik personele atayabilir.
* Görev önceliğini belirleyebilir.
* Randevu tarihi belirleyebilir.
* Bütün servis taleplerini görüntüleyebilir.
* Servis talebi geçmişini inceleyebilir.
* Dashboard ve istatistikleri görüntüleyebilir.
* Gerektiğinde talebi iptal edebilir.

## 4.2 Teknik Personel

Teknik personel aşağıdaki işlemleri gerçekleştirebilir:

* Sisteme giriş yapabilir.
* Yalnızca kendisine atanan görevleri görüntüleyebilir.
* Müşteri ve servis adresi bilgilerini görüntüleyebilir.
* Görev durumunu güncelleyebilir.
* Servis notu ekleyebilir.
* Kullanılan malzemeleri kaydedebilir.
* İşlem fotoğrafı ekleyebilir.
* Görevi tamamlayabilir.

Teknik personel başka bir personele atanmış görevleri değiştiremez.

---

# 5. MVP Kapsamı

## 5.1 Kimlik doğrulama

* Kullanıcı giriş işlemi
* Güvenli parola saklama
* Oturum yönetimi
* Rol tabanlı yetkilendirme
* Yönetici ve teknik personel erişim kontrolü
* Kullanıcı çıkış işlemi

## 5.2 Personel yönetimi

* Teknik personel oluşturma
* Teknik personel listeleme
* Personeli aktif veya pasif yapma
* Personel görevlerini görüntüleme
* Personel rol kontrolü

## 5.3 Müşteri yönetimi

* Müşteri ekleme
* Müşteri listeleme
* Müşteri bilgilerini düzenleme
* Müşteri detayını görüntüleme
* Müşteri arama
* Müşterinin geçmiş servis taleplerini görüntüleme

Müşteri bilgileri:

* Ad
* Soyad veya firma adı
* Telefon numarası
* E-posta
* Adres
* İl
* İlçe
* Açıklama
* Oluşturulma tarihi

## 5.4 Servis talebi yönetimi

* Yeni servis talebi oluşturma
* Talep başlığı
* Arıza veya hizmet açıklaması
* Hizmet kategorisi
* Öncelik seviyesi
* Randevu tarihi
* Servis adresi
* Müşteri seçimi
* Teknik personel atama
* Talebi güncelleme
* Talep detayını görüntüleme
* Talep filtreleme
* Talep arama

## 5.5 Görev durum akışı

Servis talepleri aşağıdaki durumları kullanacaktır:

```text
NEW
ASSIGNED
ON_THE_WAY
IN_PROGRESS
COMPLETED
CANCELLED
```

Kullanıcı arayüzündeki karşılıkları:

```text
Yeni
Atandı
Yola Çıkıldı
İşlem Devam Ediyor
Tamamlandı
İptal Edildi
```

## 5.6 Servis kayıtları

Teknik personel görev sırasında aşağıdaki bilgileri ekleyebilir:

* Yapılan işlem
* Servis notu
* Kullanılan malzemeler
* Miktar bilgisi
* İşlem tarihi
* İşlem fotoğrafı
* Sonuç açıklaması

## 5.7 Durum geçmişi

Bir servis talebinin bütün durum değişiklikleri kaydedilecektir.

Örnek:

```text
09.30 — Talep oluşturuldu
09.45 — Ahmet Yılmaz adlı personele atandı
13.05 — Personel yola çıktı
13.40 — İşlem başladı
14.25 — Görev tamamlandı
```

Her durum kaydında aşağıdaki bilgiler tutulacaktır:

* Önceki durum
* Yeni durum
* İşlemi yapan kullanıcı
* İşlem zamanı
* Açıklama

## 5.8 Dashboard

Yönetici dashboard’unda aşağıdaki bilgiler gösterilecektir:

* Toplam servis talebi
* Yeni talepler
* Devam eden işler
* Tamamlanan işler
* İptal edilen işler
* Bugünkü randevular
* Geciken görevler
* Aktif teknik personel sayısı
* Personel başına görev sayısı
* Hizmet kategorilerine göre talep sayısı

## 5.9 Arama ve filtreleme

Servis talepleri aşağıdaki kriterlere göre filtrelenebilecektir:

* Durum
* Öncelik
* Teknik personel
* Müşteri
* Hizmet kategorisi
* Randevu tarihi
* Oluşturulma tarihi

---

# 6. MVP Dışında Bırakılan Özellikler

Dört haftalık süreyi aşmamak için aşağıdaki özellikler ilk sürüm kapsamında geliştirilmeyecektir:

* Mobil uygulama
* WhatsApp entegrasyonu
* SMS gönderimi
* Harita ve rota optimizasyonu
* Canlı konum takibi
* Online ödeme
* Fatura oluşturma
* Gelişmiş stok yönetimi
* Çoklu şirket desteği
* Abonelik sistemi
* Yapay zekâ destekli arıza analizi
* Otomatik fiyat hesaplama
* Müşteri giriş paneli
* Çevrimdışı çalışma
* Gelişmiş rapor dışa aktarma
* Muhasebe yazılımı entegrasyonu

Bu özellikler GitHub Project içerisinde **Future / Phase 2** bölümünde tutulacaktır.

---

# 7. Kullanılacak Teknolojiler

## 7.1 Ana teknoloji yığını

* Next.js App Router
* TypeScript
* PostgreSQL
* Prisma ORM
* Auth.js
* React
* Tailwind CSS
* Zod
* React Hook Form

## 7.2 Kullanıcı arayüzü

* Responsive tasarım
* Yeniden kullanılabilir React bileşenleri
* Form doğrulama
* Mobil ve masaüstü uyumu
* Erişilebilir form alanları
* Durum, hata ve yüklenme ekranları

## 7.3 Test teknolojileri

* Vitest veya Jest
* React Testing Library
* Playwright
* Prisma test veritabanı
* GitHub Actions

## 7.4 Kod kalitesi

* ESLint
* Prettier
* TypeScript strict mode
* Conventional Commits
* Pull request kontrol listesi

---

# 8. Sistem Mimarisi

UstaFlow Lite, Next.js üzerinde modüler monolit mimarisiyle geliştirilecektir.

Dört haftalık ve tek kişilik bir proje için mikroservis mimarisi kullanılmayacaktır.

```text
Kullanıcı Arayüzü
       ↓
Next.js App Router
       ↓
Server Actions / Route Handlers
       ↓
Service Layer
       ↓
Repository / Prisma
       ↓
PostgreSQL
```

## 8.1 Mimari kurallar

* İş kuralları React bileşenlerinin içine yazılmayacaktır.
* Veritabanı sorguları doğrudan sayfa bileşenlerine yerleştirilmeyecektir.
* Form verileri Zod ile doğrulanacaktır.
* Rol ve yetki kontrolleri yalnızca frontend üzerinden yapılmayacaktır.
* Bütün kritik yetki kontrolleri server tarafında tekrar uygulanacaktır.
* Servis durumu değişiklikleri merkezi bir servis üzerinden yürütülecektir.
* Veritabanı işlemlerinde Prisma kullanılacaktır.

---

# 9. Önerilen Proje Dizin Yapısı

```text
ustaflow-lite/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── technicians/
│   │   │   ├── service-requests/
│   │   │   └── profile/
│   │   │
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── dashboard/
│   │   └── layout/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── technicians/
│   │   ├── service-requests/
│   │   └── dashboard/
│   │
│   ├── server/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── authorization/
│   │   └── validators/
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── permissions.ts
│   │   └── utils.ts
│   │
│   └── types/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── screenshots/
│   ├── weekly-reports/
│   └── adr/
│
├── public/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── IMPLEMENTATION_PLAN.md
├── CHANGELOG.md
├── README.md
├── docker-compose.yml
└── package.json
```

---

# 10. Veritabanı Tasarımı

## 10.1 User

Kullanıcı ve teknik personel bilgilerini tutar.

```text
id
name
email
passwordHash
role
phone
isActive
createdAt
updatedAt
```

Roller:

```text
ADMIN
TECHNICIAN
```

## 10.2 Customer

```text
id
firstName
lastName
companyName
phone
email
address
city
district
description
createdAt
updatedAt
```

## 10.3 ServiceCategory

```text
id
name
description
isActive
createdAt
```

Örnek kategoriler:

* Klima bakımı
* Elektrik arızası
* Bilgisayar tamiri
* Kombi servisi
* Ağ kurulumu
* Diğer

## 10.4 ServiceRequest

```text
id
requestNumber
title
description
priority
status
appointmentAt
serviceAddress
customerId
categoryId
assignedTechnicianId
createdById
completedAt
cancelledAt
createdAt
updatedAt
```

Öncelikler:

```text
LOW
MEDIUM
HIGH
URGENT
```

## 10.5 ServiceStatusHistory

```text
id
serviceRequestId
previousStatus
newStatus
changedById
description
createdAt
```

## 10.6 ServiceNote

```text
id
serviceRequestId
userId
content
createdAt
updatedAt
```

## 10.7 MaterialUsage

```text
id
serviceRequestId
materialName
quantity
unit
description
createdById
createdAt
```

## 10.8 Attachment

```text
id
serviceRequestId
fileName
fileUrl
fileType
uploadedById
createdAt
```

---

# 11. Temel İş Kuralları

## 11.1 Servis talebi oluşturma

* Talep mutlaka bir müşteriye bağlı olmalıdır.
* Talep başlığı boş bırakılamaz.
* Öncelik değeri belirlenmelidir.
* Randevu tarihi geçmiş bir tarih olamaz.
* Başlangıç durumu `NEW` olmalıdır.

## 11.2 Teknik personel atama

* Yalnızca aktif teknik personel atanabilir.
* Personel atandığında durum `ASSIGNED` olarak değiştirilir.
* Atama işlemi durum geçmişine kaydedilir.

## 11.3 Durum geçişleri

Geçerli durum geçişleri:

```text
NEW → ASSIGNED
NEW → CANCELLED

ASSIGNED → ON_THE_WAY
ASSIGNED → CANCELLED

ON_THE_WAY → IN_PROGRESS
ON_THE_WAY → CANCELLED

IN_PROGRESS → COMPLETED
IN_PROGRESS → CANCELLED
```

Geçersiz örnekler:

```text
NEW → COMPLETED
COMPLETED → IN_PROGRESS
CANCELLED → ON_THE_WAY
```

Tamamlanmış veya iptal edilmiş görevler kapalı kabul edilir.

## 11.4 Yetkilendirme

* Yönetici bütün servis taleplerini görebilir.
* Teknik personel yalnızca kendisine atanmış talepleri görebilir.
* Teknik personel başka bir personele görev atayamaz.
* Teknik personel müşteri silemez.
* Teknik personel kullanıcı oluşturamaz.
* Pasif kullanıcı sisteme giriş yapamaz.

---

# 12. Geliştirme Fazları

## Faz 0 — Analiz ve GitHub Hazırlığı

**Süre:** 1–2 gün
**Milestone:** `M0 — Project Setup`

### Yapılacak işler

* GitHub repository oluşturma
* README oluşturma
* Implementation plan ekleme
* GitHub Project Board oluşturma
* Issue şablonları ekleme
* Pull request şablonu ekleme
* Branch kurallarını belirleme
* Proje kapsamını yazma
* Use case dokümanı hazırlama
* ER diyagramının ilk taslağını oluşturma
* Next.js projesini başlatma
* PostgreSQL bağlantısını hazırlama
* Prisma kurulumunu gerçekleştirme

### Faz çıktısı

* Profesyonel repository yapısı
* Çalışan Next.js başlangıç projesi
* PostgreSQL bağlantısı
* İlk Prisma migration
* `v0.1.0` release

---

## Faz 1 — Kimlik Doğrulama ve Yetkilendirme

**Süre:** 3–4 gün
**Milestone:** `M1 — Authentication`

### Yapılacak işler

* User modeli
* Admin ve Technician rolleri
* Seed admin kullanıcısı
* Login ekranı
* Auth.js yapılandırması
* Güvenli parola hash işlemi
* Oturum kontrolü
* Route koruması
* Rol kontrolü
* Logout işlemi
* Hatalı giriş yönetimi
* Authentication testleri

### Kabul kriterleri

* Geçerli kullanıcı giriş yapabilmelidir.
* Hatalı parola ile giriş yapılamamalıdır.
* Pasif kullanıcı giriş yapamamalıdır.
* Giriş yapmayan kullanıcı dashboard’a erişememelidir.
* Teknik personel yönetici sayfalarına erişememelidir.

### Faz çıktısı

* Çalışan rol tabanlı giriş sistemi
* Korumalı dashboard
* `v0.2.0` release

---

## Faz 2 — Müşteri ve Personel Yönetimi

**Süre:** 4–5 gün
**Milestone:** `M2 — Core Management`

### Yapılacak işler

* Customer modeli ve migration
* Müşteri oluşturma
* Müşteri listeleme
* Müşteri detay ekranı
* Müşteri güncelleme
* Müşteri arama
* Form doğrulama
* Teknik personel oluşturma
* Teknik personel listeleme
* Personeli aktif veya pasif yapma
* Yetkilendirme testleri

### Kabul kriterleri

* Yönetici yeni müşteri oluşturabilmelidir.
* Müşteri telefon veya isimle aranabilmelidir.
* Müşterinin detayları görüntülenebilmelidir.
* Yönetici teknik personel oluşturabilmelidir.
* Teknik personel müşteri silememelidir.
* Geçersiz form verileri kaydedilmemelidir.

### Faz çıktısı

* Müşteri yönetimi
* Teknik personel yönetimi
* `v0.3.0` release

---

## Faz 3 — Servis Talebi ve Görev Atama

**Süre:** 5–6 gün
**Milestone:** `M3 — Service Workflow`

### Yapılacak işler

* ServiceCategory modeli
* ServiceRequest modeli
* Servis talebi oluşturma
* Otomatik talep numarası üretme
* Müşteri seçimi
* Kategori seçimi
* Öncelik seçimi
* Randevu tarihi
* Teknik personel atama
* Talep listeleme
* Talep detay ekranı
* Durum filtreleme
* Tarih filtreleme
* Talep güncelleme
* Durum geçiş kuralları

### Kabul kriterleri

* Yönetici servis talebi oluşturabilmelidir.
* Talep benzersiz bir numara almalıdır.
* Talep müşteriye bağlı olmalıdır.
* Aktif teknik personel göreve atanabilmelidir.
* Atama sonrasında talep durumu `ASSIGNED` olmalıdır.
* Geçersiz durum geçişleri engellenmelidir.

### Faz çıktısı

* Çalışan servis talebi yönetimi
* Teknik personel atama
* Durum yönetimi
* `v0.5.0` release

---

## Faz 4 — Teknik Personel İş Akışı

**Süre:** 4–5 gün
**Milestone:** `M4 — Technician Workflow`

### Yapılacak işler

* Personelin kendi görevlerini görüntülemesi
* Bugünkü görevler ekranı
* Görev detay ekranı
* Yola çıktı işlemi
* İşleme başladı işlemi
* Görevi tamamla işlemi
* Servis notu ekleme
* Malzeme kullanımı ekleme
* Durum geçmişi oluşturma
* Dosya veya fotoğraf ekleme
* Yetkisiz görev erişimini engelleme

### Kabul kriterleri

* Teknik personel yalnızca kendisine atanmış görevleri görmelidir.
* Durum değişiklikleri geçmişe kaydedilmelidir.
* Tamamlanan görevde tamamlanma tarihi tutulmalıdır.
* Teknik personel servis notu ekleyebilmelidir.
* Kullanılan malzemeler kaydedilebilmelidir.
* Başka personele ait görev URL üzerinden açılamamalıdır.

### Faz çıktısı

* Çalışan teknik personel paneli
* Durum geçmişi
* Servis kaydı
* `v0.7.0` release

---

## Faz 5 — Dashboard ve Raporlama

**Süre:** 3–4 gün
**Milestone:** `M5 — Dashboard`

### Yapılacak işler

* Dashboard özet kartları
* Duruma göre görev sayıları
* Bugünkü randevular
* Geciken servis talepleri
* Personel görev dağılımı
* Kategori bazlı talep grafiği
* Son servis talepleri
* Dashboard sorgularının optimizasyonu
* Boş veri durumlarının yönetilmesi

### Faz çıktısı

* Yönetici dashboard’u
* Temel grafik ve istatistikler
* `v0.8.0` release

---

## Faz 6 — Test, Güvenlik ve Teslim

**Süre:** 4–5 gün
**Milestone:** `M6 — Final Release`

### Yapılacak işler

* Kritik iş kurallarının unit testleri
* Authentication integration testleri
* Servis talebi integration testleri
* Rol yetkilendirme testleri
* Temel Playwright senaryoları
* Form hata mesajlarının kontrolü
* Responsive tasarım düzenlemeleri
* Güvenlik kontrolleri
* GitHub Actions
* README güncelleme
* Kurulum dokümanı
* Demo verileri
* Ekran görüntüleri
* Demo videosu
* Final release

### Faz çıktısı

* Test edilmiş uygulama
* Dokümante edilmiş repository
* Çalışan demo
* `v1.0.0` release

---

# 13. Dört Haftalık Takvim

## 1. Hafta — Proje Temeli

### Hedefler

* GitHub düzeni
* Next.js ve PostgreSQL kurulumu
* Prisma veritabanı
* Authentication
* Rol sistemi
* Müşteri yönetiminin başlangıcı

### Haftanın sonunda

* Yönetici giriş yapabilmelidir.
* Dashboard korumalı olmalıdır.
* Müşteri eklenebilmelidir.
* İlk release oluşturulmalıdır.

---

## 2. Hafta — Temel İş Akışı

### Hedefler

* Müşteri yönetiminin tamamlanması
* Teknik personel yönetimi
* Servis kategorileri
* Servis talebi oluşturma
* Teknik personel atama
* Servis talebi listeleme

### Haftanın sonunda

* Yönetici müşteriyi seçerek servis talebi oluşturabilmelidir.
* Talebi teknik personele atayabilmelidir.
* Talep filtrelenebilmelidir.

---

## 3. Hafta — Teknik Personel Akışı

### Hedefler

* Teknik personel paneli
* Durum geçişleri
* Durum geçmişi
* Servis notları
* Kullanılan malzemeler
* Fotoğraf veya dosya ekleme
* Dashboard başlangıcı

### Haftanın sonunda

* Teknik personel kendisine atanmış görevi baştan sona ilerletebilmelidir.
* Bütün işlem geçmişi kaydedilmelidir.

---

## 4. Hafta — Kalite ve Teslim

### Hedefler

* Dashboard tamamlanması
* Testler
* Güvenlik kontrolleri
* Responsive düzenlemeler
* Hata düzeltmeleri
* GitHub Actions
* README
* Demo verileri
* Deployment
* Final sunumu

### Haftanın sonunda

* Proje baştan sona gösterilebilir olmalıdır.
* GitHub geçmişi düzenli olmalıdır.
* `v1.0.0` release oluşturulmalıdır.

---

# 14. GitHub Çalışma Modeli

Proje tek kişi tarafından geliştirilse bile profesyonel GitHub süreci uygulanacaktır.

## 14.1 Branch yapısı

`main` branch’i her zaman çalışır durumda tutulacaktır.

Doğrudan `main` branch’ine kod gönderilmeyecektir.

Branch isimleri:

```text
feature/12-customer-create
feature/18-service-request-form
fix/27-status-transition
test/32-auth-integration
docs/35-update-readme
refactor/41-service-layer
```

## 14.2 Geliştirme akışı

```text
GitHub Issue oluştur
        ↓
Issue'yu In Progress durumuna taşı
        ↓
Feature branch oluştur
        ↓
Küçük ve anlamlı commitler gönder
        ↓
Pull request aç
        ↓
CI kontrollerini çalıştır
        ↓
Self-review kontrol listesini tamamla
        ↓
Pull request'i main'e merge et
        ↓
Issue'yu kapat
```

Tek geliştirici olduğu için zorunlu ikinci kişi incelemesi uygulanmayacaktır. Bunun yerine her pull request için self-review kontrol listesi kullanılacaktır.

---

# 15. GitHub Project Board

Aşağıdaki durum sütunları kullanılacaktır:

```text
Backlog
Ready
In Progress
Review
Testing
Done
```

Ek alanlar:

* Priority
* Milestone
* Module
* Effort
* Start Date
* Target Date

Öncelikler:

```text
P0 — Kritik
P1 — Yüksek
P2 — Orta
P3 — Düşük
```

Efor değerleri:

```text
S — 1–3 saat
M — Yarım gün
L — 1 gün
XL — 1 günden fazla; bölünmelidir
```

---

# 16. Commit Standardı

Conventional Commits kullanılacaktır.

```text
feat: yeni özellik
fix: hata düzeltmesi
docs: dokümantasyon değişikliği
test: test değişikliği
refactor: kod düzenleme
style: biçim değişikliği
chore: bakım işlemi
ci: GitHub Actions değişikliği
```

Örnekler:

```text
feat(auth): implement credential login
feat(customer): add customer creation form
feat(service-request): add technician assignment
fix(status): prevent invalid status transition
test(auth): add unauthorized route tests
docs(readme): add local installation guide
ci: run lint and tests on pull requests
```

Kullanılmayacak commit mesajları:

```text
update
son hali
çalıştı
düzeltildi
final
deneme
kod eklendi
```

---

# 17. Pull Request Şablonu

```markdown
## Açıklama

Bu pull request hangi problemi çözüyor?

## İlgili Issue

Closes #

## Yapılan Değişiklikler

- 
- 
- 

## Test Adımları

1.
2.
3.

## Ekran Görüntüleri

Gerekliyse ekleyin.

## Kontrol Listesi

- [ ] Kod başarıyla derleniyor.
- [ ] ESLint hatası bulunmuyor.
- [ ] TypeScript hatası bulunmuyor.
- [ ] Gerekli testler eklendi.
- [ ] Testler başarıyla çalışıyor.
- [ ] Rol ve yetki kontrolleri yapıldı.
- [ ] Form doğrulamaları yapıldı.
- [ ] Gizli bilgiler commit edilmedi.
- [ ] İlgili dokümantasyon güncellendi.
- [ ] Issue bağlantısı eklendi.
```

---

# 18. Planlanan GitHub Issue Listesi

## Proje kurulumu

```text
Create Next.js TypeScript project
Configure ESLint and Prettier
Configure PostgreSQL
Configure Prisma ORM
Create initial database schema
Add environment example file
Create GitHub Project Board
Add issue templates
Add pull request template
Add CI workflow
```

## Authentication

```text
Create User model
Add user role enum
Create admin seed user
Configure Auth.js
Create login page
Implement protected routes
Implement role-based authorization
Implement logout action
Add authentication tests
```

## Müşteri yönetimi

```text
Create Customer model
Implement customer creation
Implement customer listing
Implement customer detail page
Implement customer update
Implement customer search
Add customer validation schema
Add customer integration tests
```

## Teknik personel yönetimi

```text
Create technician form
Implement technician listing
Implement technician activation status
Create technician detail page
Show assigned technician tasks
Add technician authorization tests
```

## Servis talebi

```text
Create ServiceCategory model
Create ServiceRequest model
Generate service request number
Implement service request creation
Implement customer selection
Implement technician assignment
Implement service request listing
Implement service request detail page
Implement service request update
Add search and filtering
Add service request tests
```

## Durum yönetimi

```text
Create ServiceStatusHistory model
Define valid status transitions
Implement status transition service
Create assignment history record
Implement technician task page
Implement on-the-way action
Implement in-progress action
Implement complete action
Implement cancel action
Prevent unauthorized task updates
Add status workflow tests
```

## Servis kayıtları

```text
Create ServiceNote model
Implement service note creation
Create MaterialUsage model
Implement material usage form
Create Attachment model
Implement file upload
Display service timeline
```

## Dashboard

```text
Create dashboard statistics service
Display service status cards
Display today's appointments
Display overdue requests
Display technician workload
Display category chart
Display recent service requests
```

## Final kalite

```text
Add loading states
Add error boundaries
Add empty states
Improve responsive design
Run accessibility review
Add Playwright main workflow test
Create demo seed data
Complete README
Create ER diagram
Create architecture diagram
Prepare final screenshots
Create final release
```

---

# 19. Test Stratejisi

## 19.1 Unit testler

Aşağıdaki iş kuralları unit testlerle doğrulanacaktır:

* Geçerli durum geçişleri
* Geçersiz durum geçişleri
* Servis talebi numarası üretimi
* Geciken görev hesaplama
* Görev tamamlanma işlemi
* Personel atandığında durum değişimi
* Kullanıcı rol kontrolü

## 19.2 Integration testler

* Kullanıcı giriş işlemi
* Yetkisiz route erişimi
* Müşteri oluşturma
* Servis talebi oluşturma
* Teknik personel atama
* Servis durumu güncelleme
* Başka personele ait göreve erişimin engellenmesi

## 19.3 End-to-end testler

En az iki temel senaryo Playwright ile test edilecektir.

### Yönetici senaryosu

```text
Yönetici giriş yapar
→ Müşteri oluşturur
→ Servis talebi oluşturur
→ Teknik personel atar
→ Talebi listede görüntüler
```

### Teknik personel senaryosu

```text
Teknik personel giriş yapar
→ Atanmış görevi açar
→ Yola çıktı durumuna getirir
→ İşlemi başlatır
→ Servis notu ekler
→ Görevi tamamlar
```

## 19.4 Test hedefi

Bütün dosyalarda yapay bir yüksek coverage hedefi yerine kritik iş kurallarında güvenilir test hedeflenecektir.

Hedef:

* Kritik servis katmanlarında en az `%70` test kapsamı
* Ana kullanıcı akışlarında E2E testi
* Bütün pull request’lerde lint, typecheck ve build kontrolü

---

# 20. CI/CD Planı

GitHub Actions aşağıdaki işlemleri gerçekleştirecektir.

## Pull request açıldığında

```text
Install dependencies
        ↓
Validate Prisma schema
        ↓
Run ESLint
        ↓
Run TypeScript typecheck
        ↓
Run unit tests
        ↓
Build Next.js application
```

Bu kontrollerden biri başarısız olursa pull request merge edilmeyecektir.

## Main branch güncellendiğinde

* Production build oluşturma
* Testleri tekrar çalıştırma
* Uygun ortam varsa otomatik deployment
* Release öncesi build doğrulama

---

# 21. Güvenlik Planı

* Parolalar düz metin olarak saklanmayacaktır.
* Güvenli parola hash algoritması kullanılacaktır.
* Authentication secret repository içerisine eklenmeyecektir.
* `.env` dosyası GitHub’a gönderilmeyecektir.
* `.env.example` içerisinde yalnızca örnek alanlar bulunacaktır.
* Rol kontrolleri server tarafında yapılacaktır.
* Kullanıcı girdileri Zod ile doğrulanacaktır.
* Prisma parametreli sorguları kullanılacaktır.
* Hassas bilgiler loglara yazılmayacaktır.
* Dosya yüklemelerinde boyut ve tür kontrolü yapılacaktır.
* Yalnızca izin verilen resim türleri kabul edilecektir.
* Pasif kullanıcıların oturum açması engellenecektir.
* Teknik personelin başka görevlere erişmesi engellenecektir.
* Production ortamında güvenli cookie ayarları kullanılacaktır.
* Hata ekranlarında veritabanı veya sistem detayları gösterilmeyecektir.

---

# 22. Definition of Ready

Bir issue geliştirmeye alınmadan önce aşağıdaki koşulları karşılamalıdır:

* Görevin amacı açıkça yazılmış olmalıdır.
* Kabul kriterleri bulunmalıdır.
* İlgili milestone belirlenmelidir.
* Öncelik belirlenmelidir.
* Bağımlı olduğu görevler belirtilmelidir.
* Görev bir günden uzun sürüyorsa daha küçük görevlere bölünmelidir.

---

# 23. Definition of Done

Bir issue aşağıdaki şartlar karşılanmadan tamamlanmış sayılmaz:

* Kabul kriterleri karşılanmıştır.
* Kod ayrı branch üzerinde geliştirilmiştir.
* Anlamlı commitler oluşturulmuştur.
* Pull request açılmıştır.
* İlgili issue pull request’e bağlanmıştır.
* Kod başarıyla derlenmektedir.
* TypeScript hatası bulunmamaktadır.
* ESLint hatası bulunmamaktadır.
* Gerekli testler eklenmiştir.
* Testler başarılıdır.
* Rol ve yetki kontrolleri yapılmıştır.
* Hata ve boş veri durumları ele alınmıştır.
* Gerekli dokümantasyon güncellenmiştir.
* Pull request kontrol listesi tamamlanmıştır.
* Kod `main` branch’ine merge edilmiştir.
* Issue `Done` durumuna taşınmıştır.

---

# 24. Haftalık Raporlama

Her hafta aşağıdaki dosyalardan biri oluşturulacaktır:

```text
docs/weekly-reports/week-01.md
docs/weekly-reports/week-02.md
docs/weekly-reports/week-03.md
docs/weekly-reports/week-04.md
```

Haftalık rapor içeriği:

```markdown
# Hafta 1 Raporu

## Tamamlanan İşler

## Açılan Issue'lar

## Kapatılan Issue'lar

## Merge Edilen Pull Request'ler

## Karşılaşılan Problemler

## Alınan Teknik Kararlar

## Ekran Görüntüleri

## Gelecek Haftanın Hedefleri
```

Bu raporlar sayesinde Ümit Hoca proje ilerlemesini haftalık olarak takip edebilecektir.

---

# 25. Mimari Karar Kayıtları

Önemli teknik kararlar ADR dosyalarıyla saklanacaktır.

```text
docs/adr/001-use-nextjs-fullstack.md
docs/adr/002-use-postgresql.md
docs/adr/003-use-prisma.md
docs/adr/004-use-authjs.md
docs/adr/005-use-modular-monolith.md
```

Her ADR dosyasında:

* Problem
* Alternatifler
* Seçilen çözüm
* Karar nedeni
* Avantajlar
* Dezavantajlar
* Sonuç

başlıkları bulunacaktır.

---

# 26. Risk Yönetimi

## Kapsamın büyümesi

**Risk:** Dört haftalık sürede gereğinden fazla özellik eklenmesi.

**Önlem:** MVP dışındaki bütün özellikler Phase 2 backlog’una taşınacaktır.

## Authentication sürecinin uzaması

**Risk:** Giriş ve rol sistemi beklenenden fazla zaman alabilir.

**Önlem:** İlk haftada tamamlanacak ve sonraki modüller başlamadan test edilecektir.

## Dosya yükleme problemi

**Risk:** Dosya depolama entegrasyonu zaman kaybettirebilir.

**Önlem:** Önce servis notu ve malzeme modülü tamamlanacak; dosya yükleme orta öncelikli tutulacaktır.

## Tek geliştirici bağımlılığı

**Risk:** Bir modüldeki problem bütün geliştirme sürecini durdurabilir.

**Önlem:** Görevler en fazla bir günlük parçalara bölünecek ve her hafta çalışan release çıkarılacaktır.

## Dashboard sorgularının gecikmesi

**Risk:** Grafik ve raporlama işlemleri son haftaya kalabilir.

**Önlem:** Öncelikle temel kartlar yapılacak, gelişmiş grafikler zaman kalırsa tamamlanacaktır.

## Deployment problemi

**Risk:** Uygulama yerelde çalışıp production ortamında hata verebilir.

**Önlem:** Deployment son gün yerine üçüncü haftanın sonunda ilk kez denenecektir.

---

# 27. Başarı Kriterleri

Proje aşağıdaki akış başarıyla çalıştığında MVP olarak tamamlanmış kabul edilecektir:

1. Yönetici sisteme giriş yapar.
2. Yeni teknik personel oluşturur.
3. Yeni müşteri oluşturur.
4. Müşteri için servis talebi oluşturur.
5. Talebi teknik personele atar.
6. Teknik personel kendi hesabıyla giriş yapar.
7. Yalnızca kendisine atanmış görevi görür.
8. Görevin durumunu `ON_THE_WAY` olarak değiştirir.
9. Görevin durumunu `IN_PROGRESS` olarak değiştirir.
10. Servis notu ekler.
11. Kullanılan malzemeyi kaydeder.
12. Görevi tamamlar.
13. Yönetici tamamlanan görevi görüntüler.
14. Durum geçmişi eksiksiz şekilde gösterilir.
15. Dashboard istatistikleri güncellenir.
16. Yetkisiz kullanıcıların işlemleri engellenir.
17. GitHub Actions kontrolleri başarıyla tamamlanır.
18. Proje production ortamında çalışır.

---

# 28. Final Teslim İçeriği

Final tesliminde aşağıdaki materyaller bulunacaktır:

* GitHub repository
* `README.md`
* `IMPLEMENTATION_PLAN.md`
* `CONTRIBUTING.md`
* `CHANGELOG.md`
* GitHub Project Board
* GitHub Issues
* Milestones
* Pull request geçmişi
* Commit geçmişi
* Haftalık release kayıtları
* ER diyagramı
* Sistem mimarisi diyagramı
* Use case diyagramı
* Haftalık geliştirme raporları
* Test sonuçları
* Demo verileri
* Ekran görüntüleri
* Canlı demo bağlantısı
* Demo kullanıcı bilgileri
* Proje tanıtım videosu
* Final sunumu

---

# 29. Sürüm Planı

```text
v0.1.0 — Proje kurulumu
v0.2.0 — Authentication
v0.3.0 — Müşteri ve personel yönetimi
v0.5.0 — Servis talebi yönetimi
v0.7.0 — Teknik personel iş akışı
v0.8.0 — Dashboard
v0.9.0 — Release candidate
v1.0.0 — Final MVP
```

---

# 30. Sonuç

UstaFlow Lite projesi, dört haftalık süre içerisinde tek geliştirici tarafından tamamlanabilecek şekilde sınırlandırılmıştır.

Proje yalnızca müşteri ve servis kayıtlarının tutulduğu basit bir CRUD sistemi olmayacaktır. Aşağıdaki profesyonel yazılım özelliklerini içerecektir:

* Rol tabanlı yetkilendirme
* Servis talebi durum yönetimi
* Teknik personel görev akışı
* İşlem geçmişi
* Form doğrulama
* Yetkisiz erişim kontrolü
* Test otomasyonu
* CI süreci
* Düzenli GitHub issue ve pull request geçmişi
* Haftalık release ve raporlama
* Production deployment

Geliştirme süreci aşağıdaki profesyonel akış üzerinden yürütülecektir:

```text
Requirement
    ↓
GitHub Issue
    ↓
Feature Branch
    ↓
Commit
    ↓
Pull Request
    ↓
Automated Tests
    ↓
Self Review
    ↓
Merge
    ↓
Release
```

Bu yapı sayesinde projenin yalnızca final çıktısı değil, dört haftalık geliştirme sürecinin tamamı GitHub üzerinden açık ve ölçülebilir biçimde incelenebilecektir.
