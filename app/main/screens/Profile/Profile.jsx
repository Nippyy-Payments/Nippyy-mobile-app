import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../../../providers/toast/Toast";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  CreditCard,
  Lock,
  Fingerprint,
  Gift,
  HelpCircle,
  FileText,
  ShieldCheck,
  Headphones,
  LogOut,
  QrCode,
  CopyIcon,
  ChevronRight,
  AtSign,
  KeyRound
} from "lucide-react-native";
import { useUser } from "../../../contexts/UserContext";
import * as Linking from "expo-linking";
import { useKycModal } from "../../../contexts/KycModal";
import { authService } from "../../../services/authService";

export default function Profile() {
  const { theme } = useTheme();
  const toast = useToast();
  const navigation = useNavigation();

  const openLink = (link) => {
    Linking.openURL(link);
  };

  //user data object from context
  const { profile, loading: profileLoading } = useUser();

  const { openKycModal } = useKycModal();

  const handleRestrictedAction = (screen) => {
    if (profile?.kyc_level >= 2) {
      navigation.navigate(screen);
    } else {
      openKycModal(
        "Please complete Phone and BVN verification to use this feature."
      );
    }
  };

  //menu items
  const menuItems = [
    {
      id: 2,
      title: "Change transaction Pin",
      icon: CreditCard,
      color: "#0AA5DB",
      onPress: () => navigation.navigate("TransactionPin"),
    },
    {
      id: 99,
      title: "Change Tag",
      icon: AtSign,
      color: "#0AA5DB",
      onPress: () => {
        handleRestrictedAction("CreateTag");
      },
    },
    {
      id: 38,
      title: "Enable 2FA",
      icon: KeyRound,
      color: "#0AA5DB",
      onPress: () => navigation.navigate("TwoFactor"),
    },
    {
      id: 3,
      title: "Change login Password",
      icon: Lock,
      color: "#0AA5DB",
      onPress: () => navigation.navigate("ChangePassword"),
    },
    {
      id: 4,
      title: "Biometric login",
      icon: Fingerprint,
      color: "#0AA5DB",
      onPress: () => navigation.navigate("BioLogin"),
    },
    {
      id: 6,
      title: "FAQ",
      icon: HelpCircle,
      color: "#0AA5DB",
      onPress: () => openLink("https://nippyy.com"),
    },
    {
      id: 7,
      title: "Terms & Condition",
      icon: FileText,
      color: "#0AA5DB",
      onPress: () => openLink("https://nippyy.com"),
    },
    {
      id: 8,
      title: "Privacy policy",
      icon: ShieldCheck,
      color: "#0AA5DB",
      onPress: () => openLink("https://nippyy.com"),
    },
    {
      id: 9,
      title: "Help & Support",
      icon: Headphones,
      color: "#0AA5DB",
      onPress: () => openLink("https://nippyy.com"),
    },
    {
      id: 10,
      title: "Log out",
      icon: LogOut,
      color: "#FF4444",
      onPress: () => handleLogout(),
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (e) {
      // even if signOut fails, clear local storage to force auth flow
    } finally {
      await AsyncStorage.clear();
      // AppNavigator listens to auth state and will render AuthStack
      toast({ type: 'success', title: 'Signed out', message: 'You have been signed out.' });
    }
  };

  const MenuItem = ({ item, isLast }) => {
    const IconComponent = item.icon;
    return (
      <>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.color + "20" },
            ]}
          >
            <IconComponent size={24} color={item.color} />
          </View>
          <Text style={[styles.menuText]}>{item.title}</Text>
        </TouchableOpacity>
        {!isLast && <View style={styles.divider} />}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => navigation.navigate("UserDetails")}>
            {profile?.profile_image ? (
              <Image
                source={{ uri: profile.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileInitialsCircle}>
                <Text style={styles.profileInitialsText}>
                  {(profile?.first_name?.[0] || "U").toUpperCase()}
                  {(profile?.last_name?.[0] || "").toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserDetails")}
            >
              <Text style={[styles.profileName]}>
                {profile?.first_name?.trim()?.charAt(0).toUpperCase() +
                  profile?.first_name?.trim()?.slice(1)}{" "}
                {profile?.last_name?.trim()?.charAt(0).toUpperCase() +
                  profile?.last_name?.trim()?.slice(1)}
              </Text>
            </TouchableOpacity>
            <View style={styles.usernameContainer}>
              {!profile?.nippyy_tag ? (
                <TouchableOpacity
                  onPress={() => handleRestrictedAction("CreateTag")}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={[
                      styles.username,
                      { color: theme.colors.textSecondary, marginRight: 2 },
                    ]}
                  >
                    Create Tag
                  </Text>
                  <ChevronRight size={12} color={"#000"} />
                </TouchableOpacity>
              ) : (
                <>
                  <Text
                    style={[
                      styles.username,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {profile?.nippyy_tag}
                  </Text>
                  <CopyIcon size={12} color={"#000"} />
                </>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => {
              handleRestrictedAction("ProfileQR");
            }}
          >
            <QrCode size={20} color="#666" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </View>

        {/*bottom space*/}
        <View style={{ height: 200 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    position: "relative",
    backgroundColor: "#E4F5FB",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInitialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitialsText: {
    fontFamily: "bold",
    fontSize: 18,
    color: "#111827",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontFamily: "regular",
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 2,
  },
  qrButton: {
    backgroundColor: "#eee",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  menuContainer: {
    backgroundColor: "#E4F5FB",
    borderRadius: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E4F5FB",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E6FF",
    marginLeft: 72,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "semi",
  },
});
