import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfigurationCompany from '@/components/configuration/ConfigurationCompany';
import ConfigurationEmployee from '@/components/configuration/ConfigurationEmployee';

export default function ConfigurationProfile() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserType();
  }, []);

  const loadUserType = async () => {
    try {
      const userString = await AsyncStorage.getItem('@tramuu_user');
      if (userString) {
        const user = JSON.parse(userString);
        setUserType(user.userType);
      }
    } catch (error) {
      console.error('Error loading user type:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (userType === 'company') {
    return <ConfigurationCompany />;
  } else if (userType === 'employee') {
    return <ConfigurationEmployee />;
  }

  return <ConfigurationCompany />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});