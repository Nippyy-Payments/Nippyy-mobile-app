import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { verifyBvn } from "../../../../services/bvnVerification";
import { useToast } from "../../../../providers/toast/Toast";
import { useUser } from "../../../../contexts/UserContext";
import { supabase } from "../../../../lib/supabase";

export default function VerifyBvn() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [bvn, setBvn] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [dob, setDob] = useState("1988-04-04"); // YYYY-MM-DD

  const toast = useToast();
  const { refreshProfile } = useUser();

  const handleVerify = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (bvn.length !== 11) {
      toast({
        type: "error",
        title: "Invalid BVN",
        message: "BVN must be 11 digits",
      });
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const response = await verifyBvn(bvn, firstName, lastName, dob);
      setLoading(false);

      if (response.success) {
        if (response?.data?.allValidationPassed) {
          // If NIN is present from BVN response, save the value only
          const ninFromBvn = response?.data?.nin || response?.data?.idNumber || null;

          const update = {
            bvn_verified: true,
            bvn_verified_at: new Date().toISOString(),
            kyc_level: 2,
          };

          if (ninFromBvn) {
            update.nin = ninFromBvn;
          }

          const { error } = await supabase
            .from("users")
            .update(update)
            .eq("id", user.id);

          if (error) {
            console.error("Failed to update Supabase:", error);
            toast({
              type: "error",
              title: "Database Error",
              message: "BVN verified but failed to update profile.",
            });
            return;
          }

          await refreshProfile();
          navigation.goBack();
          toast({
            type: "success",
            title: "Yayyy 🎉",
            message: "BVN verified successfully",
          });
        } else {
          toast({
            type: "error",
            title: "Verification Failed",
            message: "BVN does not match the provided name or date of birth",
          });
        }
      } else {
        toast({
          type: "error",
          title: "Verification Failed",
          message: response?.message || "Unknown error",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        type: "error",
        title: "Verification Failed",
        message: "Unknown error",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Bvn</Text>
        <View />
      </View>

      {/* Body */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.contentTitle}>Enter your Bank Verification Number.</Text>
          <Text style={styles.contentDesc}>
            Please for a smooth verification, make sure your First name, Last
            name and Date of Birth matches the details on your BVN
          </Text>
        </View>
        <TextInput
          placeholder="Enter BVN"
          keyboardType="number-pad"
          maxLength={11}
          value={bvn}
          onChangeText={setBvn}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "regular",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "bold",
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
});
