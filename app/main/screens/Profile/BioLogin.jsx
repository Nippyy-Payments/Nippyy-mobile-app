import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Fingerprint, Shield, Smartphone } from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function BioLogin() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricPreference();
  }, []);

  // Check if device supports biometric authentication
  const checkBiometricSupport = async () => {
    try {
      const isSupported = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(isSupported);

      if (isSupported) {
        const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricType(biometricTypes);
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  // Load saved biometric preference
  const loadBiometricPreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem('biometric_enabled');
      if (savedPreference !== null) {
        setIsBiometricEnabled(JSON.parse(savedPreference));
      }
    } catch (error) {
      console.error('Error loading biometric preference:', error);
    }
  };

  // Save biometric preference to AsyncStorage
  const saveBiometricPreference = async (enabled) => {
    try {
      await AsyncStorage.setItem('biometric_enabled', JSON.stringify(enabled));
      setIsBiometricEnabled(enabled);
    } catch (error) {
      console.error('Error saving biometric preference:', error);
      Alert.alert('Error', 'Failed to save biometric preference');
    }
  };

  // Handle biometric toggle
  const handleBiometricToggle = async (value) => {
    if (!isBiometricSupported) {
      Alert.alert('Not Supported', 'Biometric authentication is not supported on this device');
      return;
    }

    if (value) {
      // Enabling biometric login
      setIsLoading(true);
      try {
        const hasEnrolledBiometrics = await LocalAuthentication.isEnrolledAsync();
        
        if (!hasEnrolledBiometrics) {
          Alert.alert(
            'No Biometrics Enrolled',
            'Please set up biometric authentication in your device settings first'
          );
          setIsLoading(false);
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          fallbackLabel: 'Use passcode',
          disableDeviceFallback: false,
        });

        if (result.success) {
          await saveBiometricPreference(true);
          Alert.alert('Success', 'Biometric login has been enabled');
        } else {
          Alert.alert('Authentication Failed', 'Please try again');
        }
      } catch (error) {
        console.error('Biometric authentication error:', error);
        Alert.alert('Error', 'Failed to enable biometric login');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Disabling biometric login
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => saveBiometricPreference(false),
          },
        ]
      );
    }
  };

  // Test biometric authentication
  const testBiometricLogin = async () => {
    if (!isBiometricSupported) {
      Alert.alert('Not Supported', 'Biometric authentication is not supported on this device');
      return;
    }

    if (!isBiometricEnabled) {
      Alert.alert('Not Enabled', 'Please enable biometric login first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Test biometric login',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        Alert.alert('Success', 'Biometric authentication successful!');
        // Here you would typically handle the successful login
        // For example: navigate to main app or save login state
      } else {
        Alert.alert('Authentication Failed', 'Please try again');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  // Get biometric type icon and label
  const getBiometricInfo = () => {
    if (!biometricType || biometricType.length === 0) {
      return { icon: Fingerprint, label: 'Biometric' };
    }

    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return { icon: Smartphone, label: 'Face ID' };
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return { icon: Fingerprint, label: 'Fingerprint' };
    }
    
    return { icon: Shield, label: 'Biometric' };
  };

  const { icon: BiometricIcon, label: biometricLabel } = getBiometricInfo();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biometric Login</Text>
        <View />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.biometricContainer}>
          <Fingerprint size={80} color={theme.colors.primary} />
          <Text style={styles.title}>{biometricLabel} Authentication</Text>
          <Text style={styles.subtitle}>
            Secure your account with {biometricLabel.toLowerCase()} authentication
          </Text>
        </View>

        {!isBiometricSupported ? (
          <View style={styles.notSupportedContainer}>
            <Text style={styles.notSupportedText}>
              Biometric authentication is not supported on this device
            </Text>
          </View>
        ) : (
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable {biometricLabel}</Text>
                <Text style={styles.settingDescription}>
                  Use {biometricLabel.toLowerCase()} to sign in quickly and securely
                </Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#e0e0e0', true: theme.colors.primary }}
                thumbColor={isBiometricEnabled ? '#ffffff' : '#f4f3f4'}
                disabled={isLoading}
              />
            </View>

            {isBiometricEnabled && (
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
                onPress={testBiometricLogin}
                disabled={isLoading}
              >
                <Text style={styles.testButtonText}>
                  {isLoading ? 'Testing...' : `Test ${biometricLabel}`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  biometricContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily:'regular',
  },
  notSupportedContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
  },
  notSupportedText: {
    color: '#856404',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'medium',
  },
  settingsContainer: {
    marginVertical: 30,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 18,
    fontFamily: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
    fontFamily:"regular"
  },
  testButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'bold',
  },
});