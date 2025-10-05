# HelpMe - React Native App

A React Native application for discovering local places and getting personalized recommendations.

## Features

- **Chat Interface**: AI-powered chat to help you find places
- **Explore**: Browse nearby places by categories
- **Popular**: See trending and popular places
- **Favorites**: Save and manage your favorite places
- **Profile**: Manage your preferences and settings
- **Onboarding**: Personalized setup experience

## Tech Stack

- React Native
- Expo
- React Navigation
- NativeWind (Tailwind CSS for React Native)
- Ionicons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd localizeai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── App.tsx                 # Main app component with navigation
├── pages/                  # Screen components
│   ├── ChatPage.tsx        # Chat interface
│   ├── ExplorePage.tsx     # Explore nearby places
│   ├── PopularPage.tsx     # Popular places
│   ├── FavoritesPage.tsx   # Saved favorites
│   ├── ProfilePage.tsx     # User profile
│   └── OnboardingPage.tsx # Onboarding flow
└── index.tsx              # App entry point
```

## Navigation

The app uses React Navigation with:
- Stack Navigator for onboarding flow
- Bottom Tab Navigator for main app screens

## Styling

The app uses NativeWind (Tailwind CSS for React Native) for consistent styling across components.

## Development

### Adding New Screens

1. Create a new screen component in `src/pages/`
2. Add it to the navigation in `src/App.tsx`
3. Update the tab navigator if needed

### Styling Guidelines

- Use NativeWind classes for consistent styling
- Follow the existing color scheme (purple primary: #9333ea)
- Use SafeAreaView for proper screen boundaries
- Implement proper touch feedback with TouchableOpacity

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
