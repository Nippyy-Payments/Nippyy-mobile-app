import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useUser } from "../../../../contexts/UserContext";
import { useToast } from "../../../../providers/toast/Toast";
import { verifyPhoneOtp } from "../../../../services/phoneVerification";
import { supabase } from "../../../../lib/supabase";

export default function VerifyPhoneOtp() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const { refreshProfile } = useUser();

  const phone = route?.params?.phone || "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef(Array.from({ length: 6 }, () => React.createRef()));
  const [loading, setLoading] = useState(false);

  const focusIndex = (idx) => {
    const ref = inputsRef.current[idx];
    ref?.current?.focus?.();
  };

  const handleChange = (text, idx) => {
    // Allow paste of full code
    const onlyDigits = text.replace(/\D/g, "");
    if (onlyDigits.length > 1) {
      const next = [...digits];
      for (let i = 0; i < 6; i++) {
        next[i] = onlyDigits[i] || "";
      }
      setDigits(next);
      // focus last filled or next
      const filled = Math.min(onlyDigits.length, 6) - 1;
      focusIndex(filled);
      return;
    }

    const next = [...digits];
    next[idx] = onlyDigits;
    setDigits(next);
    if (onlyDigits && idx < 5) focusIndex(idx + 1);
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === "Backspace" && !digits[idx] && idx > 0) {
      const next = [...digits];
      next[idx - 1] = "";
      setDigits(next);
      focusIndex(idx - 1);
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (!code || code.length !== 6) {
      toast({ type: "error", title: "Invalid code", message: "Enter the OTP sent to your phone" });
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const res = await verifyPhoneOtp(phone, code);

      if (res?.success) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase
          .from("users")
          .update({
            phone_verified: true,
            phone_verified_at: new Date().toISOString(),
            phone_number: phone,
            kyc_level: 1,
          })
          .eq("id", user.id);

        setLoading(false);
        // Force-refresh profile so UI updates immediately
        await refreshProfile();
        toast({ type: "success", title: "Verified", message: "Phone number verified" });
        navigation.navigate("KycSteps");
      } else {
        setLoading(false);
        toast({ type: "error", title: "Failed", message: res?.message || "Invalid code" });
      }
    } catch (e) {
      setLoading(false);
      toast({ type: "error", title: "Error", message: "Could not verify code" });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter OTP</Text>
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
          <Text style={styles.contentTitle}>We've sent a code to</Text>
          <Text style={[styles.contentDesc, { marginTop: 4 }]}>{phone}</Text>
        </View>

        <View style={styles.otpRow}>
          {digits.map((d, idx) => (
            <TextInput
              key={idx}
              ref={inputsRef.current[idx]}
              style={styles.otpInput}
              value={d}
              onChangeText={(t) => handleChange(t, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="next"
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "regular",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 20,
    fontFamily: "semi",
    textAlign: "center",
    backgroundColor: "#fff",
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
