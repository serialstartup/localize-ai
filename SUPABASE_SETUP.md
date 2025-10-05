# 🗄️ Supabase Database Kurulum Rehberi

Bu doküman, HelpMe uygulaması için Supabase database'ini kurmak için gereken tüm adımları içermektedir.

## 📋 İçindekiler

1. [Supabase Projesi Oluşturma](#1-supabase-projesi-oluşturma)
2. [Database Schema'yı Yükleme](#2-database-schemayi-yükleme)
3. [Authentication Kurulumu](#3-authentication-kurulumu)
4. [Environment Variables](#4-environment-variables)
5. [Row Level Security (RLS) Politikaları](#5-row-level-security-rls-politikalari)
6. [API Endpoint'leri](#6-api-endpointleri)
7. [Test Verileri](#7-test-verileri)

## 1. Supabase Projesi Oluşturma

### 1.1 Hesap Açma ve Proje Oluşturma
1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. GitHub/Google hesabınızla giriş yapın
3. "New Project" butonuna tıklayın
4. Proje bilgilerini doldurun:
   - **Name**: `helpme-localizeai`
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: `Europe West (London)` veya size en yakın region
5. "Create new project" butonuna tıklayın
6. Proje oluşturulmasını bekleyin (2-3 dakika)

### 1.2 Proje Ayarlarını Kaydetme
Proje oluşturulduktan sonra aşağıdaki bilgileri kaydedin:

- **Project URL**: `https://your-project-id.supabase.co`
- **API Key (anon)**: Settings > API > Project API keys > anon public
- **Service Role Key**: Settings > API > Project API keys > service_role (sadmin işlemleri için)

## 2. Database Schema'yı Yükleme

### 2.1 SQL Editor'u Açma
1. Supabase Dashboard'da sol menüden **SQL Editor**'a gidin
2. "New query" butonuna tıklayın

### 2.2 Schema'yı Yükleme
1. `supabase_schema.sql` dosyasının içeriğini kopyalayın
2. SQL Editor'a yapıştırın
3. "Run" butonuna tıklayın
4. İşlem tamamlandığında yeşil "Success" mesajını göreceksiniz

### 2.3 Tabloların Oluşturulduğunu Kontrol Etme
1. Sol menüden **Table Editor**'a gidin
2. Aşağıdaki tabloların oluşturulduğunu kontrol edin:
   - ✅ `users`
   - ✅ `user_preferences`
   - ✅ `chat_sessions`
   - ✅ `chat_messages`
   - ✅ `places`
   - ✅ `user_favorites`
   - ✅ `search_history`
   - ✅ `message_recommendations`
   - ✅ `user_activity_log`
   - ✅ `user_feedback`

## 3. Authentication Kurulumu

### 3.1 Auth Ayarlarını Yapılandırma
1. Sol menüden **Authentication**'a gidin
2. **Settings** tab'ına tıklayın
3. Aşağıdaki ayarları yapın:

#### Site URL
```
http://localhost:3000
```

#### Redirect URLs (Geliştirme için)
```
http://localhost:3000/auth/callback
exp://localhost:19000/auth/callback
```

#### JWT Settings
- **JWT expiry**: 3600 (1 saat)
- **Refresh token expiry**: 604800 (1 hafta)

### 3.2 Email Provider Ayarları
1. **Providers** tab'ına gidin
2. **Email** provider'ını enable edin
3. **Confirm email** seçeneğini açın

### 3.3 OAuth Providers (İsteğe Bağlı)
Google ve Apple Sign-In için:
1. **Providers** tab'ında **Google** ve **Apple**'ı enable edin
2. Gerekli Client ID ve Secret bilgilerini girin

## 4. Environment Variables

### 4.1 .env Dosyasına Ekleme
`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (Backup işlemleri için)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

### 4.2 Config Dosyasını Güncelleme
`src/config.ts` dosyasını güncelleyin:

```typescript
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};
```

## 5. Row Level Security (RLS) Politikaları

RLS politikaları schema ile birlikte otomatik olarak oluşturulmuştur. Aşağıdaki politikalar aktiftir:

### Users Tablosu
- ✅ Kullanıcılar sadece kendi profillerini görebilir
- ✅ Kullanıcılar sadece kendi profillerini güncelleyebilir

### User Preferences Tablosu
- ✅ Kullanıcılar sadece kendi tercihlerini yönetebilir

### Chat Sessions & Messages
- ✅ Kullanıcılar sadece kendi chat session'larını görebilir
- ✅ Kullanıcılar sadece kendi mesajlarını yönetebilir

### Places Tablosu
- ✅ Tüm kullanıcılar places tablosunu okuyabilir (public read)

### Favorites ve Activity
- ✅ Kullanıcılar sadece kendi favorite'lerini ve aktivitelerini görebilir

## 6. API Endpoint'leri

### 6.1 Temel Endpoint'ler
Supabase otomatik olarak aşağıdaki endpoint'leri oluşturur:

```
GET    /rest/v1/users                    # Kullanıcı profili
POST   /rest/v1/users                    # Kullanıcı oluşturma  
PATCH  /rest/v1/users                    # Profil güncelleme

GET    /rest/v1/chat_sessions             # Chat session'ları
POST   /rest/v1/chat_sessions             # Yeni session oluşturma

GET    /rest/v1/chat_messages             # Chat mesajları
POST   /rest/v1/chat_messages             # Yeni mesaj ekleme

GET    /rest/v1/places                    # Yer arama
GET    /rest/v1/user_favorites            # Favoriler
POST   /rest/v1/user_favorites            # Favori ekleme
DELETE /rest/v1/user_favorites            # Favori silme

GET    /rest/v1/search_history            # Arama geçmişi
POST   /rest/v1/search_history            # Arama kaydetme
```

### 6.2 Custom Functions (İsteğe Bağlı)
Gelişmiş arama ve analytics için custom SQL functions eklenebilir:

```sql
-- Yakındaki yerleri bulma
CREATE OR REPLACE FUNCTION nearby_places(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km INTEGER DEFAULT 5
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    (ST_Distance(p.location, ST_Point(user_lng, user_lat)::geography) / 1000) as distance_km
  FROM places p
  WHERE ST_DWithin(p.location, ST_Point(user_lng, user_lat)::geography, radius_km * 1000)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

## 7. Test Verileri

### 7.1 Örnek Kullanıcı Oluşturma
```sql
-- Test kullanıcısı (sadece development için)
INSERT INTO users (id, email, name, onboarding_completed) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', 'Test User', true);
```

### 7.2 Örnek Yerler Ekleme
```sql
-- İstanbul'da örnek yerler
INSERT INTO places (google_place_id, name, place_type, formatted_address, latitude, longitude, rating) VALUES
('ChIJ123example1', 'Galata Kulesi', 'tourist_attraction', 'Galata, İstanbul', 41.0256, 28.9744, 4.5),
('ChIJ123example2', 'Taksim Meydanı', 'tourist_attraction', 'Taksim, İstanbul', 41.0370, 28.9857, 4.2),
('ChIJ123example3', 'Kapalıçarşı', 'shopping_mall', 'Eminönü, İstanbul', 41.0115, 28.9685, 4.0);
```

## 8. Güvenlik ve Backup

### 8.1 Güvenlik Kontrol Listesi
- ✅ RLS politikaları aktif
- ✅ API key'ler environment variables'da
- ✅ Service role key client'ta kullanılmıyor
- ✅ Sensitive data şifreleniyor

### 8.2 Backup Stratejisi
1. Supabase otomatik backup alır (7 gün)
2. Manuel backup için Dashboard > Settings > Database > Backup
3. Critical data için additional backup solution önerilir

## 9. Monitoring ve Analytics

### 9.1 Database Metrics
1. Dashboard > Settings > Database > Metrics
2. Query performance ve resource usage'ı takip edin

### 9.2 Log Monitoring
1. Dashboard > Logs
2. API calls, errors ve authentication events'ları takip edin

---

## 🎉 Kurulum Tamamlandı!

Database kurulumunuz tamamlandı. Artık uygulamada Supabase entegrasyonuna başlayabilirsiniz.

### Sonraki Adımlar:
1. Supabase JS SDK'yı projeye ekleyin
2. Authentication service'ini oluşturun  
3. Database operations'larını implement edin
4. Real-time subscriptions kurun

### Hata Durumunda:
- Supabase Dashboard > Logs'u kontrol edin
- RLS politikalarını gözden geçirin
- Environment variables'ları doğrulayın

### Destek:
- [Supabase Docs](https://supabase.com/docs)
- [Community Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)