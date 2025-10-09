import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { verifyNin } from "../../../../services/ninVerification";
import { useToast } from "../../../../providers/toast/Toast";
import { useUser } from "../../../../contexts/UserContext";
import { supabase } from "../../../../lib/supabase";

export default function VerifyNin() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const toast = useToast();
  const { refreshProfile } = useUser();

  const [nin, setNin] = useState("");
  const [firstName, setFirstName] = useState("Sarah");
  const [lastName, setLastName] = useState("Doe");
  const [dob, setDob] = useState("1988-04-04"); // format: YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const {data: { user },} = await supabase.auth.getUser();
    if (nin.length !== 11) {
      toast({
        type: "error",
        title: "Invalid NIN",
        message: "NIN must be 11 digits",
      });
      return;
    }
    try {
      setLoading(true);
      Keyboard.dismiss();
      const response = await verifyNin(nin, firstName, lastName, dob);
      setLoading(false);

      if (response?.data?.allValidationPassed) {
        const { error } = await supabase
          .from("users")
          .update({
            nin_verified: true,
            kyc_level: 3,
            nin_verified_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) {
          console.error("Failed to update user:", error);
        }

        await refreshProfile();
        //go back to previos screen
        navigation.goBack();
        toast({
          type: "success",
          title: "Yayyy 🎉",
          message: "NIN and details matched successfully.",
        });
      } else {
        toast({
          type: "error",
          title: "Error",
          message: "NIN does not match the provided name or date of birth",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        type: "error",
        title: "Error",
        message: "An error occured!",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify NIN</Text>
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
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.contentTitle}>Enter your NIN</Text>
          <Text style={styles.contentDesc}>
            Please for a smooth verification, make sure your First name, Last
            name and Date of Birth matches the details on your NIN
          </Text>
        </View>
        <TextInput
          placeholder="Enter NIN"
          style={styles.input}
          keyboardType="numeric"
          value={nin}
          maxLength={11}
          onChangeText={setNin}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify NIN</Text>
          )}
        </TouchableOpacity>
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
  contentTitle: {
    fontFamily: "semi",
    fontSize: 18,
  },
  contentDesc: {
    fontFamily: "regular",
    fontSize: 13,
    marginTop: 6,
    color: "grey",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "regular",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "bold",
  },
});
