Mobil Uygulama (React Native)

Kullanıcı kayıt/giriş (email+şifre veya Google/Apple login)

Lokasyon izni → GPS koordinatları alınıyor

Kullanıcı sorularını (örn: “yakınlarda güzel bir kahveci var mı?”) backend’e gönderiyor

Sonuçları listeliyor (restoranlar, etkinlikler, vb.)

2. Backend (Node.js + Supabase)
Modüller:

Auth

Supabase Auth (Google, Apple, Email/Şifre desteği hazır geliyor)

Kullanıcı profili: id, email, favori yerler, geçmiş sorgular, notifications,language


Google Places API → restoran, kahveci, turistik yerler


AI Layer

OpenAI GPT API (soru: “bugün ne yesem?” → yanıtı kişiselleştir, listeden öner)

Prompt içinde Google Places’tan gelen yerleri formatla:

“Kullanıcı X km çevresinde kahve arıyor. Bu listeden en uygunlarını öner: …”

Database

Kullanıcı geçmişi, favoriler, çok ziyaret edilen kategoriler

İleride → öneri motoru (kullanıcıya özel feed)

3. Akış

User login → Token alır

Kullanıcı “yakınlarda kahveci” der → (mobil app → backend)

Backend:

GPS alır

Google Places API çağırır → 10 sonuç

GPT API’ye gönderir → açıklama ve öneri listesi üretir

Backend → App’e döner → Liste + AI yorumları

App ekranda kart tasarımıyla gösterir

🔑 Kullanacağın API’ler

Auth → Supabase Auth (Google/Apple login hazır)

Lokasyon → React Native Location + Google Maps API

Mekanlar → Google Places API (restoran, kahveci, turistik yer)

AI → OpenAI GPT API (listeyi daha insani hale getir)

🛠 Önerilen Stack

Frontend: React Native + Expo

Backend: Node.js (Express/NestJS) veya Supabase Edge Functions

DB: Supabase Postgres

AI: OpenAI GPT API

External APIs: Google Places

👉 Bu haliyle backend aslında çok büyük değil:

1 auth service,

1 search endpoint (AI ile birleşik),

1 history/favorites endpoint.

Bitti 🎯




