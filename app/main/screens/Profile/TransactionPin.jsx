import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";

export default function TransactionPin() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // State management
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [currentStep, setCurrentStep] = useState("initial"); 
  const [hasExistingPin, setHasExistingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has existing PIN on component mount
  useEffect(() => {
    checkExistingPin();
  }, []);

  const checkExistingPin = async () => {
    try {
      // Replace this with your actual API call or storage check
      // const userPin = await AsyncStorage.getItem('transaction_pin');
      // const hasPin = userPin !== null;
      
      // Mock check - replace with your actual logic
      const hasPin = false; // Set this based on your user data
      setHasExistingPin(hasPin);
      
      if (hasPin) {
        setCurrentStep("old_pin");
      }
    } catch (error) {
      console.error("Error checking existing PIN:", error);
    }
  };

  const handleNumberPress = (number) => {
    if (currentStep === "old_pin") {
      if (oldPin.length < 4) {
        setOldPin(prev => prev + number);
      }
    } else if (currentStep === "initial") {
      if (pin.length < 4) {
        setPin(prev => prev + number);
      }
    } else if (currentStep === "confirm") {
      if (confirmPin.length < 4) {
        setConfirmPin(prev => prev + number);
      }
    }
  };

  const handleDelete = () => {
    if (currentStep === "old_pin") {
      setOldPin(prev => prev.slice(0, -1));
    } else if (currentStep === "initial") {
      setPin(prev => prev.slice(0, -1));
    } else if (currentStep === "confirm") {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const verifyOldPin = async () => {
    if (oldPin.length !== 4) return;
    
    setIsLoading(true);
    try {
      // Replace with your actual PIN verification API call
      // const isValid = await verifyTransactionPin(oldPin);
      
      // Mock verification - replace with your actual logic
      const isValid = true; // This should be your actual verification
      
      if (isValid) {
        setCurrentStep("initial");
        setOldPin("");
      } else {
        Alert.alert("Error", "Incorrect PIN. Please try again.");
        setOldPin("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify PIN. Please try again.");
      setOldPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinComplete = () => {
    if (pin.length !== 4) return;
    setCurrentStep("confirm");
  };

  const handleConfirmComplete = async () => {
    if (confirmPin.length !== 4) return;
    
    if (pin !== confirmPin) {
      Alert.alert("Error", "PINs don't match. Please try again.", [
        {
          text: "OK",
          onPress: () => {
            setPin("");
            setConfirmPin("");
            setCurrentStep("initial");
          }
        }
      ]);
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API call to save/update PIN
      // await saveTransactionPin(pin);
      
      // Mock save - replace with your actual logic
      console.log("PIN saved:", pin);
      
      Alert.alert(
        "Success", 
        hasExistingPin ? "Transaction PIN updated successfully!" : "Transaction PIN created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-progress when PIN is complete
  useEffect(() => {
    if (currentStep === "old_pin" && oldPin.length === 4) {
      verifyOldPin();
    } else if (currentStep === "initial" && pin.length === 4) {
      handlePinComplete();
    } else if (currentStep === "confirm" && confirmPin.length === 4) {
      handleConfirmComplete();
    }
  }, [oldPin, pin, confirmPin, currentStep]);

  const getCurrentPin = () => {
    switch (currentStep) {
      case "old_pin":
        return oldPin;
      case "initial":
        return pin;
      case "confirm":
        return confirmPin;
      default:
        return "";
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case "old_pin":
        return "Enter Current PIN";
      case "initial":
        return hasExistingPin ? "Enter New PIN" : "Create Transaction PIN";
      case "confirm":
        return "Confirm New PIN";
      default:
        return "Transaction PIN";
    }
  };

  const getSubtitle = () => {
    switch (currentStep) {
      case "old_pin":
        return "Please enter your current 4-digit PIN";
      case "initial":
        return hasExistingPin 
          ? "Enter your new 4-digit PIN" 
          : "Create a 4-digit PIN to secure your transactions";
      case "confirm":
        return "Re-enter your PIN to confirm";
      default:
        return "";
    }
  };

  const renderPinDots = () => {
    const currentPinValue = getCurrentPin();
    return (
      <View style={styles.pinContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              currentPinValue.length > index && {backgroundColor:theme.colors.primary, borderColor: theme.colors.primary},
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ["", 0, "delete"]
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.numberButton, item === "" && styles.emptyButton]}
                onPress={() => {
                  if (item === "delete") {
                    handleDelete();
                  } else if (item !== "") {
                    handleNumberPress(item.toString());
                  }
                }}
                disabled={item === "" || isLoading}
              >
                {item === "delete" ? (
                  <Text style={styles.deleteText}>←</Text>
                ) : item !== "" ? (
                  <Text style={styles.numberText}>{item}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </View>

          {renderPinDots()}
          {renderNumberPad()}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    fontFamily:"semi"
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    gap: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "transparent",
  },
  pinDotFilled: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  numberPad: {
    alignItems: "center",
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 40,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth:1,
    borderColor: "#E0E0E0",
  },
  emptyButton: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  numberText: {
    fontSize: 24,
    color: "#333",
    fontFamily:'semi'
  },
  deleteText: {
    fontSize: 28,
    color: "#666",
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "medium",
  },
});