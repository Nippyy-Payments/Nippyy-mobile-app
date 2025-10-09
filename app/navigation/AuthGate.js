import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AuthGate() {
  const [checking, setChecking] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const checkPinStatus = async () => {
      const pin = await AsyncStorage.getItem('app_pin');
      if (pin) {
        navigation.replace('EnterPin');
      } else {
        navigation.replace('CreatePin');
      }
    };

    checkPinStatus();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
