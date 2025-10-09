import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { supabase } from "../../../lib/supabase";

export default function Tag() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipient, setRecipient] = useState(null);
  const lastQueriedRef = useRef("");

  const handleFindTag = async (explicitValue, mode = "explicit") => {
    const raw = explicitValue ?? tag;
    const value = raw.trim().replace(/^@+/, "");
    setError("");
    setRecipient(null);
    if (!value) {
      if (mode === "explicit") setError("Enter a tag to search");
      return;
    }
    if (mode === "auto" && value.length < 2) return; // avoid noisy queries
    if (lastQueriedRef.current === value) return; // skip duplicate
    try {
      setLoading(true);
      // Exact match on nippyy_tag
      const { data, error: dbError } = await supabase
        .from("users")
        .select("id, first_name, last_name, profile_image, nippyy_tag")
        .eq("nippyy_tag", value.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (dbError) throw dbError;
      if (!data) {
        if (mode === "explicit") setError("No user found with that tag");
        lastQueriedRef.current = value;
        return;
      }
      setRecipient(data);
    } catch (e) {
      console.error(e);
      if (mode === "explicit") setError("Failed to look up tag. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nippyy Tag</Text>
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
        {/* Tag Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.label}>Send to a Nippyy Tag</Text>
          <View style={styles.row}>
            <Text style={styles.atSign}>@</Text>
            <TextInput
              value={tag}
              onChangeText={setTag}
              placeholder="username"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              onSubmitEditing={() => handleFindTag(undefined, "explicit")}
            />
            <TouchableOpacity
              style={[
                styles.findBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleFindTag(undefined, "explicit")}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.findBtnText}>Find</Text>
              )}
            </TouchableOpacity>
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Result */}
        {recipient && (
          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Image
                source={{
                  uri:
                    recipient.profile_image || "https://via.placeholder.com/64",
                }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {recipient.first_name?.toUpperCase() || "Nippyy"}{" "}
                  {recipient.last_name?.toUpperCase() || "User"}
                </Text>
                <Text style={styles.tagText}>@{recipient.nippyy_tag}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.continueBtn,
                  { borderColor: theme.colors.primary },
                ]}
                onPress={() =>
                  navigation.navigate("TagDetails", { userId: recipient.id })
                }
              >
                <Text
                  style={[styles.continueText, { color: theme.colors.primary }]}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  searchWrap: {
    gap: 10,
  },
  label: {
    fontFamily: "semi",
    color: "#111827",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  atSign: {
    fontFamily: "bold",
    color: "#6b7280",
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontFamily: "regular",
    fontSize: 14,
    color: "#111827",
  },
  findBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  findBtnText: {
    color: "#fff",
    fontFamily: "semi",
    fontSize: 13,
  },
  errorText: {
    color: "#dc2626",
    fontFamily: "regular",
    fontSize: 12,
    marginTop: 6,
  },
  resultCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
  },
  nameText: {
    fontFamily: "semi",
    fontSize: 13.5,
    color: "#111827",
  },
  tagText: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  continueBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  continueText: {
    fontFamily: "semi",
    fontSize: 13,
  },
});
