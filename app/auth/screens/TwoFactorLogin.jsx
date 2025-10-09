import React, { useEffect, useRef, useState } from 'react';
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
import { ArrowLeft } from 'lucide-react-native';
import { useToast } from '../../providers/toast/Toast';
import { sendOTP, verifyOTP } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

export default function TwoFactorLogin({ navigation }) {
  const { theme } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || '';
      setEmail(userEmail);
      if (userEmail) {
        try {
          setResendLoading(true);
          await sendOTP(userEmail);
        } catch (_) {}
        setResendLoading(false);
      }
    };
    init();
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = () => {
    const s = otp.join('');
    if (s.length !== 6) {
      setError('Please enter all 6 digits');
      toast({ type: 'error', title: 'Validation Error', message: 'Please enter all 6 digits' });
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (!validateOtp()) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      await verifyOTP(email, otp);
      await AsyncStorage.setItem('two_factor_verified', String(Date.now()));
      toast({ type: 'success', title: 'Success', message: 'Two-factor verified' });
      navigation.replace('EnterPin');
    } catch (e) {
      toast({ type: 'error', title: 'Error', message: e?.message || 'Invalid verification code' });
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    Keyboard.dismiss();
    try {
      await sendOTP(email);
      toast({ type: 'success', title: 'Success', message: 'New code sent to your email' });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (e) {
      toast({ type: 'error', title: 'Error', message: e?.message || 'Failed to resend code' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: '#eee' }]}
        onPress={() => navigation.goBack()}
        disabled={loading || resendLoading}
      >
        <ArrowLeft color={'#000'} size={18} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>Two-factor authentication</Text>
        <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>Enter the 6-digit code sent to {email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, { borderColor: error ? '#FF3B30' : '#e5e7eb', color: theme.colors.primaryText }]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary, opacity: loading || resendLoading ? 0.7 : 1 }]}
          onPress={handleVerify}
          disabled={loading || resendLoading}
        >
          {loading ? <ActivityIndicator color={'#fff'} /> : <Text style={[styles.buttonText]}>Verify</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={resendLoading || loading}>
          {resendLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={[styles.resendText, { color: theme.colors.primary }]}>Resend code</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  backButton: {
    height: 40, width: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 100, margin: 15, marginTop: Platform.OS === 'ios' ? 60 : 50,
  },
  title: { fontSize: 24, marginBottom: 8, fontFamily: 'bold' },
  subtitle: { fontSize: 13, marginBottom: 24, opacity: 0.8, fontFamily: 'semi' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  otpInput: { flex: 1, marginHorizontal: 4, height: 56, borderWidth: 1, borderRadius: 8, fontSize: 24, textAlign: 'center' },
  button: { height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'semi' },
  resendButton: { alignItems: 'center', padding: 8, height: 40, justifyContent: 'center' },
  resendText: { fontSize: 14, fontWeight: '500' },
  errorText: { color: '#FF3B30', fontSize: 14, textAlign: 'center', marginBottom: 16, fontFamily: 'medium' },
});
