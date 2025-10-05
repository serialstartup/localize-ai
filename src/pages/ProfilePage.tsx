import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PlaceCard from '../components/PlaceCard';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

const ProfilePage = ({ navigation }) => {
  const { user, logout, isLoading: authLoading, updatePreferences } = useAuth();
  const { favoritesCount, visitedCount, favorites } = useFavorites();
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  
  const languages = ['English', 'Español', 'Français'];
  
  useEffect(() => {
    if (user?.preferences) {
      // Update states based on user preferences
      setLanguage(user.preferences.language || 'English');
      setNotifications(user.preferences.push_notifications ?? true);
    }
    
    // User stats are now loaded from FavoritesContext
    
  }, [user]);
  
  const interestMap = {
    'food_dining': { name: 'Yemek & Restoran', color: '#fed7aa', textColor: '#c2410c' },
    'art_culture': { name: 'Sanat & Kültür', color: '#f3e8ff', textColor: '#7c3aed' },
    'outdoors': { name: 'Doğa & Spor', color: '#bbf7d0', textColor: '#166534' },
    'nightlife': { name: 'Gece Hayatı', color: '#e0e7ff', textColor: '#6366f1' },
    'shopping': { name: 'Alışveriş', color: '#fce7f3', textColor: '#ec4899' },
    'family': { name: 'Aile Aktiviteleri', color: '#bfdbfe', textColor: '#3b82f6' },
    'local_experiences': { name: 'Yerel Deneyimler', color: '#fef9c3', textColor: '#eab308' },
    'historic_sites': { name: 'Tarihi Yerler', color: '#ccfbf1', textColor: '#14b8a6' },
  };
  
  const userInterests = user?.preferences?.interests?.map(interestId => ({
    id: interestId,
    ...interestMap[interestId as keyof typeof interestMap]
  })).filter(Boolean) || [];

  // Convert favorites to PlaceCard format (recent 5)
  const recentFavoritePlaces = favorites.slice(0, 5).map(fav => ({
    id: parseInt(fav.place_id) || 0,
    name: fav.place?.name || 'Unknown Place',
    type: fav.place?.type || 'Place',
    image: fav.place?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: fav.place?.rating || 4.0,
    distance: fav.place?.distance || '0.5 mi',
    tags: fav.tags ? [fav.tags] : ['Favorite']
  }));

  const handleSettingsNavigation = (item) => {
    switch (item.title) {
      case 'Language':
        navigation?.navigate('Language', {
          onLanguageChange: (lang) => setLanguage(lang.label)
        });
        break;
      case 'Help & Support':
        navigation?.navigate('HelpSupport');
        break;
      case 'Privacy Policy':
        navigation?.navigate('PrivacyPolicy');
        break;
      case 'Sign Out':
        handleSignOut();
        break;
      default:
        break;
    }
  };

  const handleNotificationToggle = async () => {
    const newNotificationState = !notifications;
    setNotifications(newNotificationState);
    
    try {
      await updatePreferences({
        push_notifications: newNotificationState
      });
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // Revert the state if update fails
      setNotifications(!newNotificationState);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      // Navigation will be handled by the auth state change in App.tsx
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const settingsItems = [
    { icon: 'notifications-outline', title: 'Notifications', value: notifications, type: 'toggle' },
    { icon: 'language-outline', title: 'Language', value: language, type: 'selection' },
    { icon: 'help-circle-outline', title: 'Help & Support', type: 'navigation' },
    { icon: 'shield-outline', title: 'Privacy Policy', type: 'navigation' },
    { icon: 'log-out-outline', title: 'Sign Out', type: 'navigation', danger: true }
  ];

  if (authLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9333ea" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#9333ea' }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 40, 
            backgroundColor: '#ffffff', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{ fontSize: 32, color: '#9333ea' }}>👤</Text>
          </View>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#ffffff', 
            marginBottom: 4 
          }}>
            {user?.name || 'User'}
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: 'rgba(255,255,255,0.8)' 
          }}>
            {user?.email || 'No email'}
          </Text>
          
          {/* Stats */}
          <View style={{ 
            flexDirection: 'row', 
            marginTop: 24, 
            gap: 32 
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: '#ffffff' 
              }}>
                {visitedCount}
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: 'rgba(255,255,255,0.8)' 
              }}>
                Visited
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: '#ffffff' 
              }}>
                {favoritesCount}
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: 'rgba(255,255,255,0.8)' 
              }}>
                Favorites
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: '#ffffff' 
              }}>
                0
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: 'rgba(255,255,255,0.8)' 
              }}>
                Reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <PageHeader 
          title="Your Preferences"
          headerType="simple"
          style={{ marginTop: 32, paddingHorizontal: 16 }}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          style={{ marginTop: 16 }}
        >
          {userInterests.length > 0 ? userInterests.map(interest => (
            <View key={interest.id} style={{
              backgroundColor: interest.color,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 12
            }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500',
                color: interest.textColor
              }}>
                {interest.name}
              </Text>
            </View>
          )) : (
            <View style={{
              backgroundColor: '#f3f4f6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 12
            }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500',
                color: '#6b7280'
              }}>
                No interests selected
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Favorite Places */}
        <PageHeader 
          title="Recent Favorites"
          showSeeAll={true}
          onSeeAllPress={() => {}}
          style={{ marginTop: 32, paddingHorizontal: 16 }}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          style={{ marginTop: 16 }}
        >
          {recentFavoritePlaces.length > 0 ? recentFavoritePlaces.map(place => (
            <PlaceCard 
              key={place.id} 
              place={place}
              displayMode="card"
              showFavoriteButton={false}
              style={{ marginRight: 16 }}
            />
          )) : (
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center'
              }}>
                No favorites yet. Start exploring and add places to your favorites!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Settings */}
        <PageHeader 
          title="Settings"
          headerType="simple"
          style={{ marginTop: 32, paddingHorizontal: 16 }}
        />
        
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 32 }}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => handleSettingsNavigation(item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: index < settingsItems.length - 1 ? 1 : 0,
                borderBottomColor: '#f3f4f6'
              }}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={item.danger ? '#ef4444' : '#6b7280'} 
              />
              <Text style={{ 
                flex: 1, 
                marginLeft: 16, 
                fontSize: 16,
                color: item.danger ? '#ef4444' : '#374151'
              }}>
                {item.title}
              </Text>
              
              {item.type === 'toggle' && (
                <TouchableOpacity 
                  onPress={handleNotificationToggle}
                  style={{
                    width: 50,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: notifications ? '#9333ea' : '#d1d5db',
                    padding: 2,
                    justifyContent: 'center'
                  }}
                >
                  <View style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: '#ffffff',
                    alignSelf: notifications ? 'flex-end' : 'flex-start'
                  }} />
                </TouchableOpacity>
              )}
              
              {item.type === 'selection' && (
                <Text style={{ 
                  fontSize: 16, 
                  color: '#6b7280',
                  marginRight: 8
                }}>
                  {item.value}
                </Text>
              )}
              
              {(item.type === 'navigation' || item.type === 'selection') && (
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;