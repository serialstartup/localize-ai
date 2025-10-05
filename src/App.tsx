import React from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View, Text } from "react-native";
import { AppProviders, useAuth } from "./contexts";

import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import PopularPage from "./pages/PopularPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LanguagePage from "./pages/LanguagePage";
import HelpSupportPage from "./pages/HelpSupportPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Chat") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Popular") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#9333ea",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Chat" component={ChatPage} />
      <Tab.Screen name="Explore" component={ExplorePage} />
      <Tab.Screen name="Popular" component={PopularPage} />
      <Tab.Screen name="Favorites" component={FavoritesPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { user, isLoading, hasOnboarded } = useAuth();
  console.log("Loading durumu:", isLoading);
  console.log("Kullanıcı durumu:", user);
  console.log("Onboarding durumu:", hasOnboarded);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#6b7280" }}>
          Loading HelpMe...
        </Text>
      </View>
    );
  }

  // Debug logging
  console.log("App render - user:", !!user, "hasOnboarded:", hasOnboarded);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
              <>
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Signup" component={SignupPage} />
              </>
            ) : !hasOnboarded ? (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingPage} />
              </>
            ) : (
              <>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Language" component={LanguagePage} />
                <Stack.Screen name="HelpSupport" component={HelpSupportPage} />
                <Stack.Screen
                  name="PrivacyPolicy"
                  component={PrivacyPolicyPage}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
