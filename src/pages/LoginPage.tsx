import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = ({ navigation, onNavigateToSignup, onLogin }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    
    if (!password) {
      newErrors.password = 'Şifre gerekli';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        console.log('Attempting login with:', email);
        const result = await login(email, password);
        console.log('Login result:', result);
        
        if (result.success) {
          console.log('Login successful, navigating...');
          // Login successful, AuthContext will handle navigation
          onLogin && onLogin({ email, password });
        } else {
          console.log('Login failed:', result.error);
          Alert.alert('Giriş Hatası', result.error || 'Giriş yaparken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Hata', 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-purple-600 rounded-2xl items-center justify-center mb-6">
            <Text className="text-3xl">🗺️</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldin</Text>
          <Text className="text-gray-600 text-center text-base">
            Yakındaki harika yerleri keşfetmeye devam et
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">E-posta</Text>
            <View className="relative">
              <TextInput
                className={`bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-base text-gray-900 pr-12`}
                placeholder="ornek@email.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: null }));
                  }
                }}
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
                placeholder="Şifrenizi girin"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: null }));
                  }
                }}
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

          {/* Forgot Password */}
          <TouchableOpacity className="self-end" activeOpacity={0.7}>
            <Text className="text-purple-600 font-medium">Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`${isLoading ? 'bg-purple-300' : 'bg-purple-600'} rounded-xl py-4 mt-8 shadow-sm flex-row items-center justify-center`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="#ffffff" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                Giriş yapılıyor...
              </Text>
            </>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Giriş Yap
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-gray-600">Hesabın yok mu? </Text>
          <TouchableOpacity 
            onPress={() => navigation?.navigate('Signup') || onNavigateToSignup?.()}
            activeOpacity={0.7}
          >
            <Text className="text-purple-600 font-semibold">Kayıt Ol</Text>
          </TouchableOpacity>
        </View>

        {/* Alternative Login */}
        <View className="mt-8">
          <Text className="text-center text-gray-500 mb-6">veya</Text>
          
          <TouchableOpacity 
            className="bg-white border border-gray-200 rounded-xl py-4 flex-row items-center justify-center shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">🍎</Text>
            <Text className="text-gray-700 font-medium text-base">
              Apple ile Devam Et
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white border border-gray-200 rounded-xl py-4 flex-row items-center justify-center shadow-sm mt-3"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">📧</Text>
            <Text className="text-gray-700 font-medium text-base">
              Google ile Devam Et
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;