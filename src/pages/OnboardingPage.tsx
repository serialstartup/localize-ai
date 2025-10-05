import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OnboardingPage = ({ route, navigation }: any) => {
  const { completeOnboarding, updatePreferences, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('tr');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [locationPermission, setLocationPermission] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState({
    push: true,
    recommendations: true,
    nearby: false,
  });
  
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];
  
  const interests: Array<{
    id: string;
    name: string;
    emoji: string;
    color: string;
    borderColor: string;
  }> = [
    {
      id: 'food_dining',
      name: 'Yemek & Restoran',
      emoji: '🍽️',
      color: '#fed7aa',
      borderColor: '#f97316'
    },
    {
      id: 'art_culture',
      name: 'Sanat & Kültür',
      emoji: '🎭',
      color: '#f3e8ff',
      borderColor: '#9333ea'
    },
    {
      id: 'outdoors',
      name: 'Doğa & Spor',
      emoji: '🌳',
      color: '#bbf7d0',
      borderColor: '#16a34a'
    },
    {
      id: 'nightlife',
      name: 'Gece Hayatı',
      emoji: '🍸',
      color: '#e0e7ff',
      borderColor: '#6366f1'
    },
    {
      id: 'shopping',
      name: 'Alışveriş',
      emoji: '🛍️',
      color: '#fce7f3',
      borderColor: '#ec4899'
    },
    {
      id: 'family',
      name: 'Aile Aktiviteleri',
      emoji: '👪',
      color: '#bfdbfe',
      borderColor: '#3b82f6'
    },
    {
      id: 'local_experiences',
      name: 'Yerel Deneyimler',
      emoji: '🌆',
      color: '#fef9c3',
      borderColor: '#eab308'
    },
    {
      id: 'historic_sites',
      name: 'Tarihi Yerler',
      emoji: '🏛️',
      color: '#ccfbf1',
      borderColor: '#14b8a6'
    }
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const nextStep = async () => {
    if (step === 2) {
      // Complete onboarding with preferences
      try {
        // Save preferences to Supabase
        const preferencesResult = await updatePreferences({
          language: language as 'tr' | 'en',
          push_notifications: notificationPreferences.push,
          recommendation_notifications: notificationPreferences.recommendations,
          nearby_notifications: notificationPreferences.nearby,
          location_services: locationPermission,
          analytics: true,
          personalized_ads: false,
          show_open_only: false,
          max_distance: 5000,
          currency: 'TRY' as 'TRY' | 'USD' | 'EUR',
          voice_enabled: true,
          image_analysis: true,
          auto_location: locationPermission,
          interests: selectedInterests,
        });

        console.log('OnboardingPage: Preferences update result:', preferencesResult);

        // Complete onboarding regardless of preferences result
        await completeOnboarding();
        
        // Call parent callback if provided
        if (route.params?.onComplete) {
          route.params.onComplete();
        }
      } catch (error) {
        console.error('Onboarding completion error:', error);
        // Still complete onboarding even if preferences fail
        try {
          await completeOnboarding();
          if (route.params?.onComplete) {
            route.params.onComplete();
          }
        } catch (onboardingError) {
          console.error('Onboarding completion failed:', onboardingError);
          Alert.alert('Hata', 'Onboarding tamamlanırken bir sorun oluştu.');
        }
      }
    } else {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginBottom: 8, 
                textAlign: 'center', 
                color: '#9333ea'
              }}>
                Welcome to HelpMe
              </Text>
              <Text style={{ 
                color: '#6b7280', 
                textAlign: 'center', 
                fontSize: 16
              }}>
                Discover amazing places in your language
              </Text>
            </View>
            
            <View style={{ 
              position: 'relative', 
              width: 300, 
              height: 300, 
              marginBottom: 24, 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}>
              <View style={{ 
                position: 'absolute', 
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#9333ea', 
                opacity: 0.1, 
                borderRadius: 20 
              }} />
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
                style={{ width: 300, height: 240, borderRadius: 20 }}
                resizeMode="cover"
              />
            </View>
          </View>
        );
        
      case 1:
        return (
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              marginBottom: 8, 
              textAlign: 'center', 
              color: '#9333ea'
            }}>
              Dilini Seç
            </Text>
            <Text style={{ 
              color: '#6b7280', 
              textAlign: 'center', 
              marginBottom: 32,
              fontSize: 16
            }}>
              Uygulamada kullanmak istediğin dili seç
            </Text>
            
            <View style={{ gap: 12 }}>
              {languages.map(lang => (
                <TouchableOpacity 
                  key={lang.code}
                  style={{
                    width: '100%',
                    padding: 16,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: language === lang.code ? '#f3e8ff' : '#ffffff',
                    borderWidth: language === lang.code ? 2 : 1,
                    borderColor: language === lang.code ? '#9333ea' : '#e5e7eb'
                  }}
                  onPress={() => setLanguage(lang.code)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{lang.flag}</Text>
                    <Text style={{ 
                      color: language === lang.code ? '#9333ea' : '#374151',
                      fontWeight: language === lang.code ? '600' : 'normal',
                      fontSize: 16
                    }}>
                      {lang.name}
                    </Text>
                  </View>
                  {language === lang.code && (
                    <View style={{
                      backgroundColor: '#9333ea',
                      borderRadius: 20,
                      padding: 4
                    }}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 2:
        return (
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              marginBottom: 8, 
              textAlign: 'center', 
              color: '#9333ea'
            }}>
              İlgi Alanlarını Seç
            </Text>
            <Text style={{ 
              color: '#6b7280', 
              textAlign: 'center', 
              marginBottom: 24,
              fontSize: 16
            }}>
              Seni en çok ilgilendiren konuları seç
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: 12, 
              marginBottom: 24 
            }}>
              {interests.map(interest => (
                <TouchableOpacity 
                  key={interest.id}
                  style={{
                    width: '48%',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 96,
                    borderWidth: 2,
                    backgroundColor: selectedInterests.includes(interest.id) ? interest.color : '#ffffff',
                    borderColor: selectedInterests.includes(interest.id) ? interest.borderColor : '#e5e7eb'
                  }}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{interest.emoji}</Text>
                  <Text style={{ 
                    fontSize: 14, 
                    textAlign: 'center',
                    fontWeight: selectedInterests.includes(interest.id) ? '500' : 'normal',
                    color: selectedInterests.includes(interest.id) ? interest.borderColor : '#374151'
                  }}>
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              fontSize: 14, 
              marginBottom: 16
            }}>
              You can always change these later in your profile
            </Text>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ paddingTop: 48, paddingBottom: 24 }}>
          {renderStep()}
        </View>
        
        <View style={{ padding: 24 }}>
          <TouchableOpacity 
            style={{
              width: '100%',
              backgroundColor: '#9333ea',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={nextStep}
          >
            <Text style={{ 
              color: '#ffffff', 
              fontWeight: '500',
              fontSize: 16
            }}>
              {step === 2 ? 'Başla' : 'Devam Et'}
            </Text>
            <Text style={{ marginLeft: 4, color: '#ffffff' }}>→</Text>
          </TouchableOpacity>
          
          {step > 0 && (
            <TouchableOpacity 
              style={{
                width: '100%',
                paddingVertical: 12,
                marginTop: 8
              }}
              onPress={() => setStep(step - 1)}
            >
              <Text style={{ 
                color: '#6b7280', 
                fontWeight: '500',
                textAlign: 'center',
                fontSize: 16
              }}>
                Geri
              </Text>
            </TouchableOpacity>
          )}
          
          {step < 2 && (
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              marginTop: 24 
            }}>
              {[0, 1, 2].map(i => (
                <View 
                  key={i} 
                  style={{
                    width: 8,
                    height: 8,
                    marginHorizontal: 4,
                    borderRadius: 4,
                    backgroundColor: i === step ? '#9333ea' : '#d1d5db'
                  }} 
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPage;