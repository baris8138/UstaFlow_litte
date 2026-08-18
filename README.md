# UstaFlow Lite

## Proje Hakkında

UstaFlow Lite, teknik servis ve saha ekiplerinin müşteri kayıtlarını, servis taleplerini, personel atamalarını ve görev ilerleyişini tek panelden yönetmesi için geliştirilmiş, tamamlanmış bir MVP uygulamasıdır.

## Temel Özellikler

- Müşteri oluşturma, düzenleme, aktif/pasif durumu ve arama
- Servis talebi oluşturma, arama, filtreleme ve server-side pagination
- Teknisyen atama ve atamayı kaldırma
- Servis tarihi planlama (scheduling)
- Teknisyen görev durumu iş akışı
- Göreve çalışma notu ve kullanılan malzeme ekleme
- Yönetici operasyon dashboard'u ve özet metrikler
- Masaüstü, tablet ve mobil ekranlara uyumlu arayüz

## Kullanıcı Rolleri

### ADMIN

- Müşteri kayıtlarını oluşturur, günceller ve aktiflik durumlarını yönetir.
- Servis taleplerini oluşturur, listeler ve detaylarını görüntüler.
- Aktif teknisyenleri taleplere atar veya atamayı kaldırır.
- Servis tarihini planlar veya planlamayı temizler.
- Operasyon dashboard'u ve durum metriklerini görüntüler.

### TECHNICIAN

- Yalnızca kendisine atanmış görevleri görüntüler.
- İzin verilen görev durumu geçişlerini uygular.
- Atanmış ve terminal olmayan görevlere çalışma notu ekler.
- Atanmış ve terminal olmayan görevlere kullanılan malzemeleri kaydeder.

## ServiceRequest İş Akışı

Ana akış:

```text
OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED
                         <-> ON_HOLD
```

Ek olarak `ON_HOLD -> COMPLETED` geçişine izin verilir. `COMPLETED` ve `CANCELLED` terminal durumlarıdır; bu durumlardaki taleplerin ataması veya planlaması değiştirilemez ve teknisyen tarafından not ya da malzeme eklenemez. Uygulama içinde `CANCELLED` durumuna geçiş sağlayan bir işlem bulunmamaktadır.

## Güvenlik

- Auth.js Credentials provider ve JWT session
- Aynı uygulama helper'ı üzerinden 12 round bcrypt parola hashleme
- Zod ile server-side input doğrulama
- Sayfa ve Server Action seviyesinde rol kontrolleri
- Her yetkili istekte veritabanından güncel kullanıcı, rol ve aktiflik doğrulaması
- Silinmiş veya pasif kullanıcılar için stale session invalidation
- Teknisyen görevlerinde kullanıcı kimliğine dayalı ownership isolation
- Terminal kayıtlarda mutation koruması
- Kritik atama, planlama, not ve malzeme işlemlerinde transaction/row locking
- Teknisyen atamalarında TOCTOU kontrolleri
- Gerçek environment secret'larının repository dışında tutulması

Rate limiting, hesap kilitleme ve audit log bu MVP kapsamında bulunmamaktadır.

## Teknolojiler

- Next.js 16.3.1 (App Router)
- React 19.2.4
- TypeScript 5
- PostgreSQL
- Prisma ORM ve Prisma Client 7.9.1
- Auth.js / NextAuth 5.0.0-beta.32
- Zod 4.4.3
- bcryptjs 3.0.3
- CSS Modules
- Tailwind CSS 4 (landing sayfası ve global stil altyapısı)

## Proje Yapısı

```text
src/app/               Next.js route'ları, sayfalar ve Server Action'lar
src/lib/               İş kuralları, veri erişimi, auth ve doğrulama katmanı
prisma/                Prisma schema ve Git'te tutulan migration'lar
src/generated/prisma/  Üretilen Prisma Client (Git'e dahil edilmez)
scripts/               Operasyonel yardımcı script'ler
```

## Gereksinimler

- Node.js ve npm
- Erişilebilir bir PostgreSQL veritabanı

Proje kesin bir minimum Node.js sürümü tanımlamamaktadır. Kullanılan güncel Next.js ve Prisma sürümlerinin desteklediği aktif bir Node.js LTS sürümü tercih edilmelidir.

## Yerel Kurulum

1. Repository'yi clone edin ve proje dizinine geçin:

   ```bash
   git clone <REPOSITORY_URL>
   cd UstaFlow_litte
   ```

2. Kilit dosyasındaki bağımlılıkları kurun:

   ```bash
   npm ci
   ```

   `postinstall` script'i Prisma Client'ı otomatik üretir. Gerekirse manuel olarak `npx prisma generate` çalıştırılabilir.

3. Environment dosyasını oluşturun. Unix/macOS:

   ```bash
   cp .env.example .env
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. PostgreSQL üzerinde boş bir veritabanı oluşturun ve `.env` içindeki `DATABASE_URL` değerini güncelleyin.

5. Güvenli bir Auth.js secret üretin:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

   Çıktıyı `.env` içindeki `AUTH_SECRET` değerine yazın.

6. Geliştirme veritabanına mevcut migration'ları uygulayın:

   ```bash
   npx prisma migrate dev
   ```

7. Aşağıdaki bölümde açıklandığı şekilde ilk ADMIN kullanıcısını oluşturun.

8. Development server'ı başlatın:

   ```bash
   npm run dev
   ```

## İlk ADMIN Kullanıcısını Oluşturma

Migration sonrasında veritabanı boştur. Uygulamaya ilk kez giriş yapabilmek için operasyonel bootstrap script'ini bir kez çalıştırın.

`.env` içinde geçici değerleri tanımlayın:

```dotenv
BOOTSTRAP_ADMIN_EMAIL="<ADMIN_EMAIL>"
BOOTSTRAP_ADMIN_PASSWORD="<EN_AZ_12_KARAKTER_GUCLU_PAROLA>"
```

Ardından çalıştırın:

```bash
npm run bootstrap:admin
```

Script parolayı konsola yazmaz ve uygulamayla aynı 12-round bcrypt helper'ı ile hashleyerek saklar. Oluşturulan kullanıcı `ADMIN` ve aktif olur; görünen adı `System Administrator` olarak atanır.

Aynı e-posta ile aktif bir ADMIN zaten varsa hiçbir kayıt değiştirilmeden başarıyla sonuçlanır. Aynı e-posta farklı rolde veya pasif bir kullanıcıya aitse script mevcut hesabı değiştirmez ve hata ile durur. Mevcut parola hiçbir durumda overwrite edilmez.

Bootstrap tamamlanınca `BOOTSTRAP_ADMIN_EMAIL` ve `BOOTSTRAP_ADMIN_PASSWORD` değerlerini runtime environment'tan kaldırın. Gerçek e-posta veya parolayı README'ye, `.env.example` dosyasına ya da Git'e eklemeyin.

## Development

```bash
npm run dev
```

## Production

Production kurulumunda mevcut migration'ları uygulayın; migration üretmeye çalışan `migrate dev` komutunu kullanmayın:

```bash
npm ci
npx prisma migrate deploy
npm run build
npm start
```

Production ortamında ilk ADMIN henüz yoksa `BOOTSTRAP_ADMIN_EMAIL` ve `BOOTSTRAP_ADMIN_PASSWORD` değerlerini yalnızca bootstrap komutunun çalıştığı operasyonel oturumda tanımlayın, `npm run bootstrap:admin` çalıştırın ve değerleri hemen kaldırın.

## Kalite Kontrolleri

```bash
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

Prisma kontrolleri:

```bash
npx prisma validate
npx prisma migrate status
```

## Environment Değişkenleri

| Değişken | Durum | Açıklama |
|---|---|---|
| `DATABASE_URL` | Zorunlu | Uygulama ve Prisma CLI için PostgreSQL bağlantı adresi. |
| `AUTH_SECRET` | Zorunlu | Auth.js JWT session güvenliği için ortama özel güçlü secret. |
| `BOOTSTRAP_ADMIN_EMAIL` | Bootstrap sırasında zorunlu | Yalnızca ilk ADMIN oluşturma komutu tarafından okunur. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Bootstrap sırasında zorunlu | 12-128 karakter olmalı; yalnızca bootstrap sırasında kullanılır. |
| `AUTH_URL` | Koşullu | Deployment ortamı uygulama URL'sini otomatik belirleyemiyorsa Auth.js için tanımlanabilir. |
| `AUTH_TRUST_HOST` | Koşullu | Yalnızca güvenilir reverse proxy/self-hosted kurulum gerektiriyorsa kullanılmalıdır. |

`AUTH_URL` ve `AUTH_TRUST_HOST` mevcut yerel kurulum için zorunlu değildir.

## Responsive Destek

Arayüz masaüstü, tablet ve mobil breakpoint'lerinde yeniden düzenlenen grid ve form yerleşimleri kullanır. Geniş veri tabloları dar ekranlarda yatay kaydırılabilir; görev ve form alanları mobilde tek kolona düşer. Çeşitli ekranlarda `prefers-reduced-motion` desteği de bulunur.

## Database / Prisma

- Prisma schema PostgreSQL kullanır.
- Migration geçmişi `prisma/migrations` altında Git'te tutulur.
- Lokal şema geliştirme ve development veritabanları için `npx prisma migrate dev` kullanılır.
- Staging/production ortamlarında yalnızca mevcut migration'ları uygulamak için `npx prisma migrate deploy` kullanılır.
- Prisma Client `npm ci` sonrasındaki `postinstall` adımında otomatik üretilir.
- Otomatik seed yoktur ve bootstrap script'i demo müşteri, servis talebi veya test verisi üretmez.

## Repository Security / Hygiene

- Gerçek `.env` dosyaları Git tarafından ignore edilir.
- `.env.example` yalnızca güvenli placeholder değerler içerir.
- `node_modules`, `.next`, TypeScript build info ve generated Prisma Client repository'ye dahil edilmez.
- Secret, gerçek credential, özel anahtar veya production connection string commit edilmemelidir.

## Kapsam / Notlar

Bu repository CI/CD pipeline, Docker yapılandırması, bildirim sistemi, rate limiting, audit log, parola sıfırlama veya uygulama içi kullanıcı yönetimi içermez. ADMIN bootstrap script'i yalnızca ilk operasyonel yönetici hesabını oluşturur; migration, demo veri veya başka kullanıcı üretmez.
