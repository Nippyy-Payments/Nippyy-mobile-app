import React, { use, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomInput } from "../../components/CustomInput";
import { ProgressSteps } from "../../components/ProgressSteps";
import { AntDesign } from "@expo/vector-icons";
import { useToast } from "../../providers/toast/Toast";
import { authService } from "../../services/authService";
import { sendWelcomeEmail } from "../../lib/api";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

export const UserInfoScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const toast = useToast();
  const { email, password } = route.params;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const nav = useNavigation();

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      toast({
        type: "error",
        title: "Validation Error",
        message: "First name is required",
      });
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      toast({
        type: "error",
        title: "Validation Error",
        message: "Last name is required",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      nav.navigate("Dob", {
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    }
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

      <ProgressSteps currentStep={2} totalSteps={5} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            Personal Information
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>
            Please enter your name as it appears on your official documents.
          </Text>

          <View style={styles.form}>
            <CustomInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
              editable={!loading}
              placeholder="Enter your first name"
            />

            <CustomInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              error={errors.lastName}
              editable={!loading}
              placeholder="Enter your last name"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
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
    fontFamily: "semi",
  },
});
