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
import { AntDesign } from "@expo/vector-icons";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useToast } from "../../providers/toast/Toast";
import { supabase } from "../../lib/supabase";

export const SignIn = ({ navigation }) => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setLoading(true);
      Keyboard.dismiss();

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          type: 'success',
          title: 'Success',
          message: 'Signed in successfully'
        });
      } catch (error) {
        toast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to sign in'
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>
            Sign in to your Nippyy account to continue.
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

            

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("ForgotPassword")}
              disabled={loading}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: loading ? 0.7 : 1 
              }
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("SignUp")}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: 'grey' }]}>
              Don't have an account? <Text style={{color: theme.colors.primary, fontFamily: 'bold'}}>Sign up</Text>
            </Text>
          </TouchableOpacity>
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
    fontSize: 13,
    marginBottom: 32,
    opacity: 0.8,
    fontFamily: 'semi',
  },
  form: {
    marginBottom: 24,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '55%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'medium',
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'semi',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'medium',
  },
}); 