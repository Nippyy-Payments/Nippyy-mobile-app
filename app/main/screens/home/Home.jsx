import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Bell, ScanQrCode } from "lucide-react-native";
import QuickActions from "./QuickActions";
import TransactionHistory from "./TransactionHistory";
import CardContent from "./CardContent";
import { useUser } from "../../../contexts/UserContext";
import KycCard from "../../components/others/KycCard";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";
import { getOrCreateWallet } from "../../../api/create-address";

export default function HomeTop() {
  //user data object from context
  const { profile, loading: profileLoading } = useUser();


  async function handleWallet() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const wallet = await getOrCreateWallet(user);
    console.log("Final wallet:", wallet);
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: profile?.profile_image || "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Hi {profile?.first_name},</Text>
              <Text style={styles.subText}>Welcome back</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', gap:10,alignItems:"center"}}>
            <TouchableOpacity style={styles.bellWrapper}>
              <ScanQrCode color="#eee" size={18} strokeWidth={3} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellWrapper}>
              <Bell color="#eee" size={18} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* User account info */}
      <View style={styles.card}>
        <CardContent />
      </View>

      {/* Scrollable content below card */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/*KYC Card*/}
        <View>
          <KycCard />
        </View>

        {/*quick actions component*/}
        {/* <View style={{marginTop:15}}>
          <QuickActions/>
        </View> */}

        {/*Half transaction history*/}
        <TransactionHistory />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0A0538",
    height: 200,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bellWrapper: {
    height: 35,
    width: 35,
    backgroundColor: "#3C3C44",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "bold",
  },
  subText: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "medium",
  },
  card: {
    position: "absolute",
    top: 145,
    alignSelf: "center",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    height: "auto",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 6,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 190,
    paddingBottom: 40,
  },
});
