import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportPage = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "Uygulama nasıl çalışır?",
      answer: "HelpMe, yapay zeka destekli bir yerel keşif asistanıdır. Yakınınızdaki kafeleri, restoranları, parkları ve diğer ilginç yerleri keşfetmenize yardımcı olur. Sadece ne aradığınızı söyleyin, size en uygun önerileri sunalım."
    },
    {
      id: 2,
      question: "Konum bilgim nasıl kullanılıyor?",
      answer: "Konum bilginiz sadece size yakın yerleri bulmak için kullanılır. Verileriniz güvenli bir şekilde saklanır ve üçüncü taraflarla paylaşılmaz. İstediğiniz zaman konum paylaşımını kapatabilirsiniz."
    },
    {
      id: 3,
      question: "Önerilerin doğruluğu nasıl sağlanıyor?",
      answer: "Önerilerimiz güncel veriler ve kullanıcı geri bildirimlerine dayanır. Sürekli olarak veri kaynaklarımızı günceller ve algoritmaları iyileştiririz. Yanlış bilgi gördüğünüzde lütfen bize bildirin."
    },
    {
      id: 4,
      question: "Favorilere eklenen yerler nasıl yönetilir?",
      answer: "Favorilerinizi Profil sayfasından görüntüleyebilir, düzenleyebilir ve silebilirsiniz. Favorileriniz hesabınızla eşitlenir ve tüm cihazlarınızda erişilebilir."
    },
    {
      id: 5,
      question: "Uygulama ücretsiz mi?",
      answer: "HelpMe'nin temel özellikleri tamamen ücretsizdir. Gelişmiş özellikler ve sınırsız arama için premium abonelik seçeneklerimiz mevcuttur."
    },
    {
      id: 6,
      question: "Hesabımı nasıl silebilirim?",
      answer: "Hesabınızı silmek için Profil > Ayarlar > Hesap Yönetimi bölümüne gidin veya destek ekibiyle iletişime geçin. Hesap silme işlemi geri alınamaz."
    }
  ];

  const contactOptions = [
    {
      id: 1,
      title: "E-posta Gönder",
      description: "Sorularınız için bize e-posta atın",
      icon: "mail",
      action: () => Linking.openURL('mailto:support@helpme.app')
    },
    {
      id: 2,
      title: "WhatsApp Destek",
      description: "WhatsApp üzerinden hızlı destek alın",
      icon: "logo-whatsapp",
      action: () => Linking.openURL('https://wa.me/905551234567')
    },
    {
      id: 3,
      title: "Telefon Desteği",
      description: "Doğrudan aramak için tıklayın",
      icon: "call",
      action: () => Linking.openURL('tel:+905551234567')
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
          Yardım & Destek
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quick Help */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Hızlı Yardım
          </Text>
          
          <View className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6">
            <Text className="text-white font-semibold text-lg mb-2">
              🤖 AI Asistan ile Konuş
            </Text>
            <Text className="text-white opacity-90 mb-4">
              Anında yardım almak için AI asistanımızla sohbet edin
            </Text>
            <TouchableOpacity 
              className="bg-white bg-opacity-20 rounded-xl py-3 px-4 self-start"
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium">
                Hemen Başla
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Sık Sorulan Sorular
          </Text>
          
          <View className="space-y-2">
            {faqData.map((faq) => (
              <View key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleFAQ(faq.id)}
                  className="px-4 py-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <Text className="flex-1 text-gray-900 font-medium pr-4">
                    {faq.question}
                  </Text>
                  <Ionicons 
                    name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
                
                {expandedFAQ === faq.id && (
                  <View className="px-4 pb-4 border-t border-gray-50">
                    <Text className="text-gray-600 leading-6 mt-3">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Options */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            İletişim
          </Text>
          
          <View className="space-y-3">
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={option.action}
                className="bg-white rounded-xl p-4 border border-gray-100 flex-row items-center"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name={option.icon} size={24} color="#9333ea" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {option.title}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {option.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Resources */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Ek Kaynaklar
          </Text>
          
          <View className="space-y-3">
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 border border-gray-100 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="book-outline" size={24} color="#6b7280" />
                <Text className="ml-4 text-gray-900 font-medium">
                  Kullanım Kılavuzu
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 border border-gray-100 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="videocam-outline" size={24} color="#6b7280" />
                <Text className="ml-4 text-gray-900 font-medium">
                  Video Eğitimleri
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 border border-gray-100 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="people-outline" size={24} color="#6b7280" />
                <Text className="ml-4 text-gray-900 font-medium">
                  Topluluk Forumu
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View className="px-6 pb-8">
          <View className="bg-gray-100 rounded-xl p-4 items-center">
            <Text className="text-gray-600 text-sm mb-1">
              HelpMe Versiyonu
            </Text>
            <Text className="text-gray-900 font-semibold">
              v1.0.0 (Build 1)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportPage;