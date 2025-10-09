import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { supabase } from "../../../lib/supabase";

export default function TagDetails() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const userId = route?.params?.userId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [narration, setNarration] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);

  const initials = useMemo(() => {
    const f = profile?.first_name || "";
    const l = profile?.last_name || "";
    const i = `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
    return i || "U";
  }, [profile]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!userId) {
        setError("Missing userId");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        // Fetch user basic profile
        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("id, first_name, last_name, profile_image, account_location, nippyy_tag")
          .eq("id", userId)
          .maybeSingle();
        if (userErr) throw userErr;
        // Fetch wallet address
        const { data: walletData, error: walErr } = await supabase
          .from("user_wallets")
          .select("address")
          .eq("user_id", userId)
          .maybeSingle();
        if (walErr && walErr.code !== 'PGRST116') throw walErr;

        if (!active) return;
        setProfile(userData || null);
        setWallet(walletData || null);
      } catch (e) {
        if (!active) return;
        console.error(e);
        setError(e?.message || "Failed to load user details");
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [userId]);

  const countryText = useMemo(() => {
    const map = {
      US: "United States",
      GB: "United Kingdom",
      CA: "Canada",
      DE: "Germany",
      FR: "France",
      NG: "Nigeria",
      GH: "Ghana",
      KE: "Kenya",
      ZA: "South Africa",
      CM: "Cameroon",
    };
    const code = profile?.account_location;
    if (!code) return "—";
    return map[code] || code;
  }, [profile?.account_location]);

  const countryFlag = useMemo(() => {
    // Use emoji flags as a robust fallback without relying on asset files
    const flagMap = {
      US: "🇺🇸",
      GB: "🇬🇧",
      CA: "🇨🇦",
      DE: "🇩🇪",
      FR: "🇫🇷",
      NG: "🇳🇬",
      GH: "🇬🇭",
      KE: "🇰🇪",
      ZA: "🇿🇦",
      CM: "🇨🇲",
    };
    const code = profile?.account_location;
    return flagMap[code] || "🌐";
  }, [profile?.account_location]);

  const reasonOptions = [
    "Personal Transfer",
    "Bills Payment",
    "Gift",
    "Purchase",
    "Loan Repayment",
  ];

  const amountNumber = Number((amount || "").replace(/[^0-9.]/g, ""));
  const canPay = !!profile && amountNumber > 0 && !!reason;

  // Format NGN amount with grouping as user types
  const formatAmountInput = (text) => {
    if (!text) return setAmount("");
    // keep only digits and at most one dot
    let cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }
    const [intPartRaw, decPartRaw = ""] = cleaned.split(".");
    const intPart = intPartRaw.replace(/^0+(?!$)/, "");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const result = decPartRaw.length > 0 ? `${withCommas}.${decPartRaw}` : withCommas;
    setAmount(result);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tag Details</Text>
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
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : !profile ? (
          <Text style={styles.emptyText}>User not found.</Text>
        ) : (
          <View style={styles.card}>
            <View style={styles.topRow}>
              {profile.profile_image ? (
                <Image source={{ uri: profile.profile_image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {profile.first_name || "Nippyy"} {profile.last_name || "User"}
                </Text>
                {!!profile.nippyy_tag && (
                  <Text style={styles.tagText}>@{profile.nippyy_tag}</Text>
                )}
              </View>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>{countryFlag}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>Account Country</Text>
              <Text style={styles.rowValue}>{countryText}</Text>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>Wallet Address</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {wallet?.address || "—"}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Payment Details</Text>

            <Text style={styles.inputLabel}>Amount (NGN)</Text>
            <View style={styles.amountRow}>
              <View style={styles.currencyBadge}><Text style={styles.currencyText}>₦</Text></View>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={formatAmountInput}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <Text style={styles.inputLabel}>Transaction Reason</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setReasonOpen(true)}>
              <Text style={[styles.selectorText, !reason && { color: '#9ca3af' }]}>
                {reason || 'Choose reason'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Narration</Text>
            <TextInput
              style={styles.narration}
              value={narration}
              onChangeText={setNarration}
              placeholder="Add a note (optional)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: canPay ? theme.colors.primary : '#e5e7eb' }]}
              activeOpacity={0.8}
              disabled={!canPay}
              onPress={() => {
                // Hook up to your payment/transfer flow here
                console.log('PAY', { to: profile.id, amount: amountNumber, reason, narration });
              }}
            >
              <Text style={[styles.payBtnText, { color: canPay ? '#fff' : '#9ca3af' }]}>Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Reason bottom sheet modal */}
      <Modal visible={reasonOpen} transparent animationType="slide" onRequestClose={() => setReasonOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setReasonOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select reason</Text>
          <ScrollView style={{ maxHeight: 280 }}>
            {reasonOptions.map((r) => (
              <TouchableOpacity key={r} style={styles.sheetItem} onPress={() => { setReason(r); setReasonOpen(false); }}>
                <Text style={styles.sheetItemText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.sheetItem, styles.sheetCancel]} onPress={() => setReasonOpen(false)}>
            <Text style={[styles.sheetItemText, { color: '#dc2626' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  center: { alignItems: "center", justifyContent: "center", paddingTop: 40 },
  errorText: { color: "#dc2626", fontFamily: "regular", fontSize: 13 },
  emptyText: { color: "#6b7280", fontFamily: "regular", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#f3f4f6" },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "bold", fontSize: 18, color: "#111827" },
  nameText: { fontFamily: "semi", fontSize: 16, color: "#111827" },
  tagText: { fontFamily: "regular", fontSize: 12, color: "#6b7280", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 6 },
  rowItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLabel: { fontFamily: "regular", fontSize: 13, color: "#6b7280" },
  rowValue: { fontFamily: "semi", fontSize: 13.5, color: "#111827", maxWidth: "65%" },
  sectionTitle: { fontFamily: "semi", fontSize: 14, color: "#111827", marginBottom: 8, marginTop: 4 },
  inputLabel: { fontFamily: "regular", fontSize: 13, color: "#6b7280", marginBottom: 8 },
  amountRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  currencyBadge: { 
    backgroundColor: "#f3f4f6", 
    paddingHorizontal: 14, 
    paddingVertical: 14, 
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  currencyText: { fontFamily: "semi", fontSize: 18, color: "#111827" },
  amountInput: {
    flex: 1,
    fontFamily: "semi",
    fontSize: 18,
    color: "#111827",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
  },
  selector: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: "center",
    marginBottom: 16,
  },
  selectorText: { fontFamily: "regular", fontSize: 15, color: "#111827" },
  narration: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "regular",
    fontSize: 15,
    color: "#111827",
    textAlignVertical: "top",
    marginBottom: 20,
    minHeight: 90,
  },
  payBtn: { 
    borderRadius: 12, 
    height: 52, 
    alignItems: "center", 
    justifyContent: "center",
  },
  payBtnText: { fontFamily: "semi", fontSize: 16 },
});