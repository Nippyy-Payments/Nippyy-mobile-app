import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowDown01Icon,
  ArrowLeft,
  CopyIcon,
  Landmark,
  UserIcon,
} from "lucide-react-native";
import { useUser } from "../../../contexts/UserContext";
import { createPaystackVirtualAccount } from "../../../api/create-account-details/createPaystackVirtualAccount";
import { supabase } from "../../../lib/supabase";

export default function AccountDetails() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  //user profile from context
  const { profile, loading: profileLoading } = useUser();

  //hold account information..
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkOrCreateVirtualAccount = async () => {
      if (!profile) return;

      try {
        setLoading(true);

        if (profile?.paystack_customer_id) {
          setAccount({
            account_number: profile.account_number,
            bank_name: profile.bank_name,
            account_name: profile.account_name,
          });
          return;
        }

        // 1. Fetch email from Supabase `auth.users`
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw new Error("Could not get user email");

        const email = user?.email;

        // 2. Create Paystack virtual account
        const result = await createPaystackVirtualAccount({
          userId: profile.id,
          email,
          firstName: profile.first_name,
          lastName: profile.last_name,
        });

        if (result.success) {
          setAccount(result.account);
          console.log("Virtual account created:", result.account);
        } else {
          setError(result.message || "Failed to create wallet");
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkOrCreateVirtualAccount();
  }, [profile]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet Details</Text>
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
        {!profile?.paystack_customer_id ? (
          <View>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "semi",
                fontSize: 16,
                color: "grey",
              }}
            >
              No account details found
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity style={styles.optionWrapper}>
              <View style={styles.innerLeftIconWrapper}>
                <ArrowDown01Icon
                  size={18}
                  color={"#0B0D47"}
                  strokeWidth={2.5}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Account Number</Text>
                <Text style={styles.lowerText}>{profile?.account_number}</Text>
              </View>
              <View style={styles.copyPill}>
                <CopyIcon size={15} color={"grey"} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionWrapper}>
              <View style={styles.innerLeftIconWrapper}>
                <Landmark size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Bank</Text>
                <Text style={styles.lowerText}>{profile?.bank_name}</Text>
              </View>
              <View />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionWrapper}>
              <View style={styles.innerLeftIconWrapper}>
                <UserIcon size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Account Name</Text>
                <Text style={styles.lowerText}>{profile?.account_name}</Text>
              </View>
              <View />
            </TouchableOpacity>
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
  optionWrapper: {
    backgroundColor: "#eee",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  innerLeftIconWrapper: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#C4C4D0",
  },
  topText: {
    fontFamily: "semi",
    fontSize: 12,
  },
  lowerText: {
    fontFamily: "regular",
    fontSize: 16,
    color: "grey",
  },
  copyPill: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#C4C4D0",
  },
});
