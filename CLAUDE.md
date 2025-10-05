# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "HelpMe", a React Native application built with Expo for discovering local places and getting personalized recommendations. The app features an AI-powered chat interface along with explore, popular, favorites, and profile sections.

## Development Commands

### Start Development
```bash
npm start                # Start Expo dev server
npm run ios             # Run on iOS simulator
npm run android         # Run on Android emulator
npm run web             # Run on web browser
```

### Build for Production
```bash
expo build:ios          # Build for iOS
expo build:android      # Build for Android
```

## Architecture

### Navigation Structure
The app uses a dual navigation pattern:
- **Stack Navigator**: Handles onboarding flow vs main app flow
- **Bottom Tab Navigator**: Main app with 5 tabs (Chat, Explore, Popular, Favorites, Profile)

Navigation is managed in `src/App.tsx` with conditional rendering based on onboarding state.

### Key Dependencies
- **React Navigation**: Bottom tabs + stack navigation
- **NativeWind**: Tailwind CSS styling for React Native
- **Expo Font**: Custom font loading (specifically Ionicons)
- **React Native Gesture Handler**: Touch interactions
- **Expo**: Development platform and build tools

### Project Structure
```
src/
├── App.tsx                 # Main navigation and app setup
├── index.tsx              # Entry point with registerRootComponent
└── pages/                 # All screen components
    ├── ChatPage.tsx       # AI chat interface
    ├── ExplorePage.tsx    # Browse nearby places
    ├── PopularPage.tsx    # Trending places
    ├── FavoritesPage.tsx  # Saved favorites
    ├── ProfilePage.tsx    # User settings
    └── OnboardingPage.tsx # Initial setup flow
```

### Styling Approach
- Uses NativeWind (Tailwind for React Native) throughout
- Primary color theme: Purple (#9333ea)
- SafeAreaView used for proper screen boundaries
- TouchableOpacity for interactive elements

### Font Management
Ionicons font is loaded asynchronously in App.tsx before rendering. The app shows nothing until fonts are loaded.

### State Management
Currently uses local React state. The onboarding completion state is managed at the App level to control navigation flow.