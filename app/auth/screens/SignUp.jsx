import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomInput } from "../../components/CustomInput";
import { ProgressSteps } from "../../components/ProgressSteps";
import { AntDesign } from "@expo/vector-icons";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useToast } from "../../providers/toast/Toast";
import { sendOTP } from "../../lib/api";

export const SignUp = ({ navigation }) => {
  const { theme } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'Email is required'
      });
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid email address'
      });
    }
    if (!password) {
      newErrors.password = "Password is required";
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'Password is required'
      });
    }
    else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'Password must be at least 6 characters'
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      setLoading(true);

      //dismiss keyboard
      Keyboard.dismiss();

      try {
        const response = await sendOTP(email);
        toast({
          type: 'success',
          title: 'Success',
          message: 'Verification code sent to your email'
        });
        navigation.navigate("OTP", { email, password });
      } catch (error) {
        console.log( error);
        toast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to send verification code'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: "#eee" }]}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft color={'#000'} size={18}/>
      </TouchableOpacity>

      {/*Track user progress*/}
      <ProgressSteps currentStep={0} totalSteps={5} />

      {/*Render main content*/}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>
            Enter your email and create a password to get started with Nippyy.
          </Text>

          <View style={styles.form}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              editable={!loading}
              placeholder="e.g. mtchy@nippyy.com"
            />

            <View style={styles.passwordContainer}>
              <CustomInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                editable={!loading}
                placeholder="Enter password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <Eye 
                    size={18} 
                    color={theme.colors.primaryText} 
                    style={{ opacity: loading ? 0.5 : 1 }}
                  />
                ) : (
                  <EyeOff 
                    size={18} 
                    color={theme.colors.primaryText} 
                    style={{ opacity: loading ? 0.5 : 1 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: loading ? 0.7 : 1 
              }
            ]}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("SignIn")}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: 'grey' }]}>
              Already have an account? <Text style={{color:theme.colors.primary,fontFamily:'bold'}}>Sign in</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By clicking continue you agree to our{' '}
            <Text 
              style={[styles.termsLink, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate('Terms')}
            >
              Terms of Use
            </Text>{' '}
            and{' '}
            <Text 
              style={[styles.termsLink, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate('Privacy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    margin: 20,
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
    fontFamily: "bold",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 32,
    opacity: 0.8,
    fontFamily: "semi",
  },
  form: {
    marginBottom: 24,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // Adjust top position to align with input
    top: 30, // Accounts for label height (22px) and margin (8px)
    zIndex: 1,
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily:'semi'
  },
  linkButton: {
    alignItems: "center",
    padding: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily:'medium'
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontFamily: 'regular',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: 'semi',
    textDecorationLine: 'underline',
  },
});
