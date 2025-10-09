import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../../providers/toast/Toast";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import defaultProfileIcon from "../../../assets/icons/default_user.png";

const { width } = Dimensions.get("window");

export default function CreatePin({ navigation }) {
  const { theme } = useTheme();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState("create");
  const [showPin, setShowPin] = useState(false);

  const toast = useToast();
  const { profile, loading: profileLoading } = useUser();

  const handleNumberPress = (number) => {
    if (step === "create") {
      if (pin.length < 4) {
        setPin(pin + number);
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + number);
      }
    }
  };

  const handleDelete = () => {
    if (step === "create") {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  React.useEffect(() => {
    if (step === "create" && pin.length === 4) {
      setTimeout(() => setStep("confirm"), 300);
    } else if (step === "confirm" && confirmPin.length === 4) {
      setTimeout(() => {
        if (pin === confirmPin) {
          savePin();
        } else {
          Alert.alert("Error", "PINs do not match. Please try again.", [
            {
              text: "OK",
              onPress: () => {
                setConfirmPin("");
                setStep("create");
                setPin("");
              },
            },
          ]);
        }
      }, 300);
    }
  }, [pin, confirmPin, step]);

  const savePin = async () => {
    try {
      await AsyncStorage.setItem("app_pin", pin);
      navigation.replace("Base");
    } catch (error) {
      toast({
        type: "error",
        title: "Oops!",
        message: "Failed to save PIN. Please try again.",
      });
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.replace("Login") },
    ]);
  };

  const renderPinDots = () => {
    const currentPin = step === "create" ? pin : confirmPin;
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              currentPin.length > index && [
                styles.pinDotFilled,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
              ],
            ]}
          />
        ))}
      </View>
    );
  };

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
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
        <Text style={styles.title}>
          {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
        </Text>
        <Text style={styles.subtitle}>
          {step === "create"
            ? "Enter a 4-digit PIN to secure your account"
            : "Please re-enter your PIN to confirm"}
        </Text>

        {/* PIN Dots */}
        {renderPinDots()}
      </View>

      {/* Custom Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderKeypadButton)}

          {/* Bottom Row */}
          <View style={styles.keypadButton} />

          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handleNumberPress("0")}
            activeOpacity={0.7}
          >
            <Text style={styles.keypadButtonText}>0</Text>
          </TouchableOpacity>

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
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 0,
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
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  logoutText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontFamily: "medium",
  },
  mainContent: {
    flex: 1,
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
    marginBottom: 50,
    lineHeight: 22,
    fontFamily: "regular",
  },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
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
  pinDotFilled: {},
  keypadContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
