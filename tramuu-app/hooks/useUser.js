/**
 * useUser Hook
 * Custom hook to manage current user data and authentication state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const USER_KEY = '@tramuu_user';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const userString = await AsyncStorage.getItem(USER_KEY);
      
      if (userString) {
        const userData = JSON.parse(userString);
        console.log('👤 useUser - Loaded user data:', {
          name: userData.name,
          email: userData.email,
          userType: userData.userType,
        });
        setUser(userData);
        setUserType(userData.userType || null);
      } else {
        console.warn('⚠️ useUser - No user data found in storage');
        setUser(null);
        setUserType(null);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err.message);
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    loadUser();
  };

  return {
    user,
    userType,
    loading,
    error,
    refreshUser,
    isCompany: userType === 'company',
    isEmployee: userType === 'employee',
  };
};

export default useUser;
