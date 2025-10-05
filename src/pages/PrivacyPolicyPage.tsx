import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyPage = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 1,
      title: "Toplanan Bilgiler",
      content: `HelpMe uygulaması olarak, size daha iyi hizmet verebilmek için aşağıdaki bilgileri topluyoruz:

• Konum Bilgileri: Yakınınızdaki yerleri önerebilmek için GPS konumunuz
• Hesap Bilgileri: Ad, e-posta adresi ve profil tercihleri
• Kullanım Verileri: Uygulama içi aktiviteleriniz ve tercih ettiğiniz yerler
• Cihaz Bilgileri: Cihaz türü, işletim sistemi ve uygulama versiyonu
• İletişim Bilgileri: Destek talepleri için sağladığınız bilgiler`
    },
    {
      id: 2,
      title: "Bilgilerin Kullanımı",
      content: `Topladığımız bilgiler aşağıdaki amaçlarla kullanılır:

• Size kişiselleştirilmiş yer önerileri sunmak
• Uygulama deneyiminizi iyileştirmek
• Hesabınızın güvenliğini sağlamak
• Müşteri destek hizmetleri sunmak
• Yasal yükümlülüklerimizi yerine getirmek
• Hizmet kalitemizi artırmak için analiz yapmak`
    },
    {
      id: 3,
      title: "Bilgi Paylaşımı",
      content: `Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:

• Yasal zorunluluklar gereği
• Güvenlik ve dolandırıcılığı önlemek için
• Hizmet sağlayıcılarımızla (şifrelenerek)
• Açık rızanız olması durumunda

Ticari amaçlarla kişisel verilerinizi satmıyoruz veya kiraya vermiyoruz.`
    },
    {
      id: 4,
      title: "Veri Güvenliği",
      content: `Verilerinizin güvenliği bizim için önceliklidir:

• SSL şifrelemesi ile veri aktarımı
• Güçlü şifreleme yöntemleri ile veri saklama
• Düzenli güvenlik denetimleri
• Sınırlı erişim yetkilendirmeleri
• Güvenli bulut altyapısı kullanımı
• 7/24 güvenlik izleme sistemleri`
    },
    {
      id: 5,
      title: "Çerezler ve Takip",
      content: `Uygulama deneyiminizi iyileştirmek için çerezler kullanıyoruz:

• Oturum çerezleri: Giriş durumunuzu korur
• Tercih çerezleri: Ayarlarınızı hatırlar
• Analitik çerezleri: Kullanım istatistikleri için
• Performans çerezleri: Uygulama hızını optimize eder

Çerez tercihlerinizi ayarlardan yönetebilirsiniz.`
    },
    {
      id: 6,
      title: "Haklarınız",
      content: `Kişisel verilerinizle ilgili haklarınız:

• Verilerinizi görüntüleme hakkı
• Yanlış bilgileri düzeltme hakkı
• Verilerinizi silme hakkı (unutulma hakkı)
• Veri işlemeye itiraz etme hakkı
• Veri taşınabilirliği hakkı
• Rızanızı geri çekme hakkı

Bu hakları kullanmak için bizimle iletişime geçebilirsiniz.`
    },
    {
      id: 7,
      title: "Çocukların Gizliliği",
      content: `13 yaşından küçük çocukların gizliliğini korumak için:

• 13 yaş altındaki kullanıcılardan bilinçli olarak veri toplamıyoruz
• Ebeveyn izni olmadan çocuk verilerini işlemiyoruz
• Çocuk verisi tespit ettiğimizde derhal sileriz
• Yaş doğrulama mekanizmaları kullanıyoruz

Ebeveynler, çocuklarının verilerini kontrol edebilir.`
    },
    {
      id: 8,
      title: "Değişiklikler",
      content: `Bu gizlilik politikası zaman içinde güncellenebilir:

• Önemli değişiklikler için e-posta bildirimi gönderilir
• Güncellemeler uygulama içinde duyurulur
• Son güncelleme tarihi sayfada belirtilir
• Eski versiyonlara web sitemizden erişilebilir

Değişiklikleri düzenli olarak kontrol etmenizi öneriyoruz.`
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const goBack = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={goBack}
          className="mr-4 p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 flex-1">
          Gizlilik Politikası
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View className="px-6 py-6">
          <View className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mr-4">
                <Ionicons name="shield-checkmark" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-purple-900 mb-1">
                  Gizliliğiniz Bizim İçin Önemli
                </Text>
                <Text className="text-purple-700 text-sm">
                  Son güncelleme: 15 Aralık 2024
                </Text>
              </View>
            </View>
            <Text className="text-purple-800 leading-6">
              HelpMe olarak, kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz 
              konusunda şeffaf olmayı taahhüt ediyoruz. Bu politika, haklarınızı ve sorumluluklarımızı açıklar.
            </Text>
          </View>
        </View>

        {/* Privacy Sections */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Gizlilik Politikası İçeriği
          </Text>
          
          <View className="space-y-3">
            {sections.map((section) => (
              <View key={section.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleSection(section.id)}
                  className="px-4 py-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-gray-600 font-semibold text-sm">
                        {section.id}
                      </Text>
                    </View>
                    <Text className="flex-1 text-gray-900 font-medium">
                      {section.title}
                    </Text>
                  </View>
                  <Ionicons 
                    name={expandedSection === section.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
                
                {expandedSection === section.id && (
                  <View className="px-4 pb-4 border-t border-gray-50">
                    <Text className="text-gray-700 leading-7 mt-4 whitespace-pre-line">
                      {section.content}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View className="px-6 py-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            İletişim
          </Text>
          
          <View className="bg-white rounded-xl p-6 border border-gray-100">
            <Text className="text-gray-700 leading-6 mb-4">
              Gizlilik politikamızla ilgili sorularınız veya endişeleriniz varsa, 
              bizimle iletişime geçmekten çekinmeyin:
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="mail" size={20} color="#9333ea" />
                <Text className="ml-3 text-gray-900">
                  privacy@helpme.app
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="call" size={20} color="#9333ea" />
                <Text className="ml-3 text-gray-900">
                  +90 555 123 45 67
                </Text>
              </View>
              
              <View className="flex-row items-start">
                <Ionicons name="location" size={20} color="#9333ea" />
                <Text className="ml-3 text-gray-900 flex-1">
                  HelpMe Teknoloji A.Ş.{'\n'}
                  Maslak Mahallesi, Bilim Sokak No:5{'\n'}
                  34485 Sarıyer, İstanbul
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Legal Notice */}
        <View className="px-6 pb-8">
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-gray-600 text-sm text-center leading-5">
              Bu gizlilik politikası, Türkiye Cumhuriyeti yasaları ve KVKK 
              (Kişisel Verilerin Korunması Kanunu) kapsamında hazırlanmıştır.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyPage;