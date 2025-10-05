import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DropdownMenu from '../components/DropdownMenu';

const LanguagePage = ({ navigation, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const languages = [
    { id: 1, label: 'Türkçe', value: 'tr' },
    { id: 2, label: 'English', value: 'en' },
    { id: 3, label: 'Español', value: 'es' },
    { id: 4, label: 'Français', value: 'fr' },
    { id: 5, label: 'Deutsch', value: 'de' },
    { id: 6, label: '中文', value: 'zh' },
    { id: 7, label: '日本語', value: 'ja' },
    { id: 8, label: '한국어', value: 'ko' },
    { id: 9, label: 'العربية', value: 'ar' },
    { id: 10, label: 'Русский', value: 'ru' },
  ];

  const handleLanguageSelect = (item) => {
    setSelectedLanguage(item.value);
    onLanguageChange && onLanguageChange(item);
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
          Dil Ayarları
        </Text>
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Description */}
        <View className="mb-8">
          <Text className="text-gray-600 text-base leading-6">
            Uygulama dilini değiştirerek tüm metinleri seçtiğiniz dilde görüntüleyebilirsiniz. 
            Değişiklikler anında uygulanacaktır.
          </Text>
        </View>

        {/* Language Selection */}
        <DropdownMenu
          title="Dil Seçin"
          items={languages}
          selectedValue={selectedLanguage}
          onSelect={handleLanguageSelect}
          placeholder="Bir dil seçin"
        />

        {/* Current Language Info */}
        {selectedLanguage && (
          <View className="mt-6 bg-white rounded-xl p-4 border border-gray-100">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="language" size={24} color="#9333ea" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Seçili Dil
                </Text>
                <Text className="text-gray-600">
                  {languages.find(lang => lang.value === selectedLanguage)?.label}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </View>
          </View>
        )}

        {/* Language Features */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Dil Özellikleri
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="checkmark" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-700">
                Tüm arayüz metinleri
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-700">
                Menüler ve butonlar
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-700">
                Bildirimler ve uyarılar
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-700">
                Yardım ve destek içerikleri
              </Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <View className="flex-row">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-900 font-medium mb-1">
                Bilgi
              </Text>
              <Text className="text-blue-700 text-sm leading-5">
                Dil değişikliği uygulamayı yeniden başlatmayı gerektirebilir. 
                Bazı özellikler seçili dilde mevcut olmayabilir.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LanguagePage;