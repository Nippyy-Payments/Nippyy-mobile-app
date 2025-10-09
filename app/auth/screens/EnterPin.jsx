import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Fingerprint } from "lucide-react-native";
import { useToast } from "../../providers/toast/Toast";
import defaultProfileIcon from "../../../assets/icons/default_user.png";

export default function EnterPin({ navigation }) {
  const { theme } = useTheme();
  const { profile } = useUser();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const toast = useToast();

  useEffect(() => {
    if (pin.length === 4) {
      checkPin();
    }
  }, [pin]);

  //check if pin is correct
  const checkPin = async () => {
    const storedPin = await AsyncStorage.getItem("app_pin");
    if (storedPin === pin) {
      navigation.replace("Base");
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  const handleNumberPress = (number) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometricAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (!compatible)
      return toast({
        type: "error",
        title: "Oops!",
        message: "Biometric not supported on this device",
      });

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return;
    toast({
      type: "error",
      title: "Oops!",
      message: "No biometrics are enrolled.",
    });

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with biometrics",
      fallbackLabel: "Enter PIN",
    });

    if (result.success) {
      navigation.replace("Base");
    }
  };

  const renderPinDots = () => (
    <View style={styles.pinDotsContainer}>
      {[0, 1, 2, 3].map((index) => (
        <View
          key={index}
          style={[
            styles.pinDot,
            pin.length > index && {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderKeypadButton = (number) => (
    <TouchableOpacity
      key={number}
      style={styles.keypadButton}
      onPress={() => handleNumberPress(number.toString())}
      activeOpacity={0.7}
    >
      <Text style={styles.keypadButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Forgot PIN Button */}
      <View style={styles.forgotPinContainer}>
        <TouchableOpacity onPress={() => Alert.alert("Forgot PIN pressed")}>
          <Text style={styles.forgotPinText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={
            profile?.profile_image
              ? { uri: profile.profile_image }
              : defaultProfileIcon
          }
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {profile?.first_name
            ? profile.first_name.trim().charAt(0).toUpperCase() +
              profile.first_name.trim().slice(1)
            : ""}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Enter Your PIN</Text>
        <Text style={styles.subtitle}>
          Enter your 4-digit PIN to access your account
        </Text>

        {renderPinDots()}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderKeypadButton)}

          {/* Biometric Button (on separate row below if needed) */}
          <TouchableOpacity
            style={[styles.keypadButton, { marginTop: 10 }]}
            onPress={handleBiometricAuth}
            activeOpacity={0.7}
          >
            <Fingerprint size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          {/* 0 Button */}
          {renderKeypadButton(0)}

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  forgotPinContainer: {
    alignItems: "flex-end",
    paddingTop: 50,
    paddingRight: 20,
  },
  forgotPinText: {
    fontSize: 14,
    color: "#007bff",
    fontFamily: "medium",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#f0f0f0",
  },
  userName: {
    fontSize: 20,
    fontFamily: "semi",
    color: "#333333",
  },
  mainContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "semi",
  },
  subtitle: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: "regular",
  },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontFamily: "medium",
  },
  keypadContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 10,
  },
  keypadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    maxWidth: 300,
    alignSelf: "center",
  },
  keypadButton: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 35,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  keypadButtonText: {
    fontSize: 24,
    color: "#333333",
    fontFamily: "semi",
  },
  deleteButtonText: {
    fontSize: 24,
    color: "#ff6b6b",
  },
});
