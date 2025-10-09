import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ProgressSteps } from '../../components/ProgressSteps';
import { AntDesign } from '@expo/vector-icons';
import { useToast } from '../../providers/toast/Toast';
import { verifyOTP, sendOTP } from '../../lib/api';
import { ArrowLeft } from 'lucide-react-native';

export const OTPVerificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const toast = useToast();
  const { email, password } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter all 6 digits'
      });
      return false;
    }
    setError('');
    return true;
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    Keyboard.dismiss();

    try {
      await sendOTP(email);
      toast({
        type: 'success',
        title: 'Success',
        message: 'New verification code sent to your email'
      });
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      setError('');
      // Focus first input
      inputRefs.current[0].focus();
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to resend verification code'
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    if (validateOtp()) {
      setLoading(true);
      Keyboard.dismiss();

      try {
        await verifyOTP(email, otp);
        toast({
          type: 'success',
          title: 'Success',
          message: 'Email verified successfully'
        });
        navigation.navigate('Info', { email, password });
      } catch (error) {
        toast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Invalid verification code'
        });
        setError('Invalid verification code');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: "#eee" }]}
        onPress={() => navigation.goBack()}
        disabled={loading || resendLoading}
      >
        <ArrowLeft color={'#000'} size={18}/>
      </TouchableOpacity>

      {/*Track user progress*/}
      <ProgressSteps currentStep={1} totalSteps={5} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          Verify Email
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>
          Enter the 6-digit code sent to {email}
        </Text>

        <View style={styles.otpContainer}>
          {otp?.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  borderColor: error ? '#FF3B30' : theme.colors.border,
                  color: theme.colors.primaryText,
                  fontFamily: "bold",
                  backgroundColor: loading || resendLoading ? '#f5f5f5' : 'transparent'
                },
              ]}
              autoFocus={index === 0}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading && !resendLoading}
            />
          ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              opacity: loading || resendLoading ? 0.7 : 1
            }
          ]}
          onPress={handleVerify}
          disabled={loading || resendLoading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            { opacity: loading || resendLoading ? 0.7 : 1 }
          ]}
          onPress={handleResendOTP}
          disabled={loading || resendLoading}
        >
          {resendLoading ? (
            <ActivityIndicator color={theme.colors.skyblue} size="small" />
          ) : (
            <Text style={[styles.resendText, { color: theme.colors.skyblue, fontFamily: 'semi' }]}>
              Resend Code
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    margin: 15,
    marginTop: Platform.OS === "ios" ? 60 : 50,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    fontFamily: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    fontFamily: 'medium',
    opacity: 0.8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'semi'
  },
  resendButton: {
    alignItems: 'center',
    padding: 8,
    height: 40,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'medium'
  },
}); 