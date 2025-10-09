import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useToast } from "../../../../providers/toast/Toast";
import { requestPhoneOtp } from "../../../../services/phoneVerification";

export default function VerifyPhone() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const toast = useToast();

  // Nigeria-only selector
  const NG = {
    name: "Nigeria",
    code: "+234",
    flag: require("../../../../../assets/icons/ng-icon.png"),
  };

  const [localNumber, setLocalNumber] = useState(""); // without country code
  const [loading, setLoading] = useState(false);

  const sanitizeDigits = (value) => value.replace(/[^0-9]/g, "");

  const handleContinue = async () => {
    const digits = sanitizeDigits(localNumber).replace(/^0+/, ""); // drop leading 0s
    const normalized = `${NG.code}${digits}`; // E.164

    if (!digits || digits.length < 7 || digits.length > 12) {
      toast({
        type: "error",
        title: "Invalid phone number",
        message: "Enter a valid phone number",
      });
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const res = await requestPhoneOtp(normalized);
      setLoading(false);

      if (res?.success) {
        toast({ type: "success", title: "OTP sent", message: "We sent a code to your phone" });
        navigation.navigate("VerifyPhoneOtp", { phone: normalized });
      } else {
        toast({ type: "error", title: "Failed", message: res?.message || "Could not request OTP" });
      }
    } catch (e) {
      setLoading(false);
      toast({ type: "error", title: "Error", message: "Could not request OTP" });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Phone</Text>
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
          <Text style={styles.contentTitle}>Enter your phone number</Text>
          <Text style={styles.contentDesc}>
            We'll send a 6-digit code to verify it's you.
          </Text>
        </View>

        {/* Nigeria-only selector with flag and fixed +234 */}
        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Image source={NG.flag} style={styles.flag} resizeMode="contain" />
            <Text style={styles.countryCode}>{NG.code}</Text>
          </View>
          <TextInput
            placeholder="8012345678"
            keyboardType="number-pad"
            value={localNumber}
            onChangeText={setLocalNumber}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send code"}</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    gap: 8,
  },
  flag: { width: 20, height: 14, borderRadius: 2 },
  countryCode: { fontFamily: "semi", fontSize: 14 },
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
