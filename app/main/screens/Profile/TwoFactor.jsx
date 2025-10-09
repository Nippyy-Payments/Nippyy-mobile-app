import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useTheme } from "../../../contexts/ThemeContext";
  import { useNavigation } from "@react-navigation/native";
  import { ArrowLeft } from "lucide-react-native";
  import { useUser } from "../../../contexts/UserContext";
  import { supabase } from "../../../lib/supabase";
  import { useToast } from "../../../providers/toast/Toast";
  
  export default function TwoFactor() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const toast = useToast();
    const { profile } = useUser();
    const [enabled, setEnabled] = useState(!!profile?.two_factor_enabled);
    const [saving, setSaving] = useState(false);
  
    useEffect(() => {
      setEnabled(!!profile?.two_factor_enabled);
    }, [profile?.two_factor_enabled]);
  
    const toggle2FA = async (value) => {
      try {
        setSaving(true);
        setEnabled(value);
        const { error } = await supabase
          .from("users")
          .update({ two_factor_enabled: value })
          .eq("id", profile?.id);
        if (error) throw error;
        toast({
          type: "success",
          title: "Updated",
          message: `Two-factor ${value ? "enabled" : "disabled"}`,
        });
      } catch (e) {
        setEnabled(!value);
        toast({
          type: "error",
          title: "Failed",
          message: e?.message || "Could not update 2FA",
        });
      } finally {
        setSaving(false);
      }
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={"#fff"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>2FA Authentication</Text>
          <View />
        </View>
  
        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Two-factor authentication</Text>
              <Text style={styles.subtitle}>
                Require an email OTP at login before PIN.
              </Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Switch
                  value={enabled}
                  onValueChange={toggle2FA}
                  thumbColor={"#fff"} 
                  trackColor={{
                    false: "#e5e7eb", 
                    true: theme.colors.primary, 
                  }}
                  ios_backgroundColor="#e5e7eb"
                  style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} 
                />
              )}
            </View>
          </View>
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 20,
    },
    title: {
      fontFamily: "semi",
      fontSize: 16,
      color: "#111827",
    },
    subtitle: {
      fontFamily: "regular",
      fontSize: 14,
      color: "#6b7280",
      marginTop: 4,
    },
  });
  