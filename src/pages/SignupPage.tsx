import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SignupPage = ({ navigation, onNavigateToLogin, onSignup }) => {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad gerekli';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ad Soyad en az 2 karakter olmalı';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'Kullanım şartlarını kabul etmelisiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSignup = async () => {
    if (validateForm()) {
      try {
        const result = await signup(formData.name, formData.email, formData.password);
        if (result.success) {
          Alert.alert(
            'Kayıt Başarılı!', 
            'Hesabınız oluşturuldu. Email adresinizi kontrol edin ve hesabınızı doğrulayın.',
            [
              {
                text: 'Tamam',
                onPress: () => {
                  onSignup && onSignup(formData);
                  navigation?.navigate('Login') || onNavigateToLogin?.();
                }
              }
            ]
          );
        } else {
          Alert.alert('Kayıt Hatası', result.error || 'Hesap oluşturulurken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        Alert.alert('Hata', 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center mt-8 mb-8">
          <View className="w-20 h-20 bg-purple-600 rounded-2xl items-center justify-center mb-6">
            <Text className="text-3xl">🗺️</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluştur</Text>
          <Text className="text-gray-600 text-center text-base">
            Yakındaki harika yerleri keşfetmeye başla
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Name Input */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Ad Soyad</Text>
            <View className="relative">
              <TextInput
                className={`bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-base text-gray-900 pr-12`}
                placeholder="Adınız ve soyadınız"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <View className="absolute right-4 top-4">
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
              </View>
            </View>
            {errors.name && (
              <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">E-posta</Text>
            <View className="relative">
              <TextInput
                className={`bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-base text-gray-900 pr-12`}
                placeholder="ornek@email.com"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View className="absolute right-4 top-4">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              </View>
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Şifre</Text>
            <View className="relative">
              <TextInput
                className={`bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-base text-gray-900 pr-12`}
                placeholder="En az 6 karakter"
                placeholderTextColor="#9ca3af"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Şifre Tekrarı</Text>
            <View className="relative">
              <TextInput
                className={`bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-base text-gray-900 pr-12`}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor="#9ca3af"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            onPress={() => {
              setAgreedToTerms(!agreedToTerms);
              if (errors.terms) {
                setErrors(prev => ({ ...prev, terms: null }));
              }
            }}
            className="flex-row items-center mt-4"
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 rounded border-2 ${agreedToTerms ? 'bg-purple-600 border-purple-600' : 'border-gray-300'} items-center justify-center mr-3`}>
              {agreedToTerms && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
            <Text className="text-gray-600 flex-1 text-sm leading-5">
              <Text className="text-purple-600 font-medium">Kullanım Şartları</Text> ve{' '}
              <Text className="text-purple-600 font-medium">Gizlilik Politikası</Text>'nı okudum ve kabul ediyorum
            </Text>
          </TouchableOpacity>
          {errors.terms && (
            <Text className="text-red-500 text-sm mt-1">{errors.terms}</Text>
          )}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          className={`${isLoading ? 'bg-purple-300' : 'bg-purple-600'} rounded-xl py-4 mt-8 shadow-sm flex-row items-center justify-center`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="#ffffff" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                Hesap oluşturuluyor...
              </Text>
            </>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Hesap Oluştur
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-600">Zaten hesabın var mı? </Text>
          <TouchableOpacity 
            onPress={() => navigation?.navigate('Login') || onNavigateToLogin?.()}
            activeOpacity={0.7}
          >
            <Text className="text-purple-600 font-semibold">Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Alternative Signup */}
        <View className="mt-6 mb-8">
          <Text className="text-center text-gray-500 mb-4">veya</Text>
          
          <TouchableOpacity 
            className="bg-white border border-gray-200 rounded-xl py-4 flex-row items-center justify-center shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">🍎</Text>
            <Text className="text-gray-700 font-medium text-base">
              Apple ile Kayıt Ol
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white border border-gray-200 rounded-xl py-4 flex-row items-center justify-center shadow-sm mt-3"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">📧</Text>
            <Text className="text-gray-700 font-medium text-base">
              Google ile Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupPage;