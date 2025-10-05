<!-- 1) Bir soru yazdığımda 'Yakın çevremde bulunan, kaliteli, bir cafe veya bar onerir misin?' sorusu sorduğumda cevap geliyor, fakat cevapların doğru olduğundan emin değilim.

2) Öneriler çok isabetli olmuyor. Örneğin ben 'çevremde bulunan kahveciler'den bahsederken, önerilerde 'San franciscodaki kahveciler' önerisinde bulunuyor.

3) Çıkan 'recommendations'lar sayfada aşağı doğru iniyor, bu kullanıcı deneyimi açısından hoş olmuyor. Horizontal bir şekilde vermeli ve 10 tane ile sınırlamalıyız. Daha sonra 'see all' demeli ve hepsini gösteren bir 'modal' çıkarmalıyız.

4) 'Recommendations'lar çıktığında tasarım biraz abartılı gözüküyor ve gereksiz yerler istila ediliyor. Örneğin 'tags'ler çok yer kaplıyor, göze çok batıyor.

5) Çıkan önerilerin detay sayfaları yok. Örneğin, isteğimiz sonucu 5-6 tane öneri çıktı, çıkan önerinin üstüne tıkladığımda bir yere gitmiyor, '[id]' gibi bir route olmalı ve places API'den aldığımız bilgileri göstermeliyiz veya buna gerek yoksa bir modal çıkarmalı, mekan hakkında bilgi vermeliyiz.


 -->

<!-- # Uygulama için yeni problem çözümleri ve updatingler gerekli. Gördüğüm kadarıyla:

1) Uygulamaya login olan kullanıcının bilgilerini almalıyız ve gerekli yerlere göndermeliyiz. Örneğin profile page içerisinde email'ini, prefences'lerini, en son ziyaret tıkladığı yerleri vs. Supabase db'de 'user_prefereneces' ve 'user_profiles' table'larımız mevcut.

user_preferences {
    id ID,
    user_id UUID,
    theme VARCHAR,
    language VARCHAR,
    push_notifications BOOLEAN,
    email_notifications BOOLEAN,
    recommendation_notifications BOOLEAN,
    nearby_notifications BOOLEAN,
    location_services BOOLEAN,
    analytics BOOLEAN,
    personalized_ads BOOLEAN,
    show_open_only BOOLEAN,
    max_distance INT4,
    currency VARCHAR,
    voice_enabled BOOLEAN,
    image_analysis BOOLEAN,
    auto_location BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
}

user_profiles {
    id,
    email,
    name,
    avatar_url,
    last_login_at,
    created_at,
    theme,
    language,
    push_notification,
    location_services,
    max_distance,
    currency
}

2) Kullanıcı kalp işaretine tıkladığı hizmetleri 'user_favorites' table'ına eklemek ve bunları 'favorites' tab'inde göstermek istiyorum.

user_favorites {
    id ID,
    user_id UUID,
    place_id UUID,
    notes TEXT,
    tags TEXT,
    is_visited BOOLEAN,
    visited_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
}

3) Kullanıcıdan aldığımız 'language' ve 'currency' bilgilerine göre hizmetleri göstermeliyiz, bu filtrelere göre göstermeliyiz.

4) Onboarding ekranından aldığımız bilgileri kullanıcı için kaydetmeliyiz. Daha fazla bilgi alabiliriz (mesela language bilgisini de oradan alabiliriz) ve ona göre login olduktan sonra işlem yaptırabiliriz.

5) PlacedetailPage.tsx sayfasının tasarımı bozuk. Sayfa aşağı inmiyor ve sayfanın üst kısmında gereksiz büyük bir boşluk var. Resimler çoklu gözükmüyor, adresi text olarak değil de harita üzerinde göstermek istiyoruz.
 -->
