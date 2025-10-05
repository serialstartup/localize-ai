import React, { useEffect, memo } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../components';

interface PopularPageProps {
  navigation?: any;
}

const PopularPage = ({ navigation }: PopularPageProps) => {
  useEffect(() => {
    // Redirect to Explore page with popular tab active
    const timer = setTimeout(() => {
      if (navigation) {
        navigation.navigate('Explore');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <PageHeader 
          title="Redirecting..."
          subtitle="Taking you to Explore page"
          headerType="simple"
        />
        <Text style={{ 
          fontSize: 16, 
          color: '#6b7280', 
          textAlign: 'center', 
          marginTop: 16 
        }}>
          Popular places are now part of the main Explore experience. You'll find them in the Popular tab.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default memo(PopularPage);