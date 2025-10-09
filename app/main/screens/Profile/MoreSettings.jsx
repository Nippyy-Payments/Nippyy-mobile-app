// MoreSettings.tsx
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { LogOut, Trash2 } from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { authService } from "../../../services/authService";
import { useToast } from "../../../providers/toast/Toast";
import CustomHeader from "../../components/header/CustomHeader";

const MoreSettings = () => {
  const { theme } = useTheme();
  const toast = useToast();
  
  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast({
        type: "success",
        title: "Success",
        message: "Logged out successfully",
      });
    } catch (error) {
      toast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to logout",
      });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account?",
      "This action is irreversible. Are you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <CustomHeader title={"More Settings"} />


      <View style={{ margin: 15, gap: 15 }}>
        {/* Log Out */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.option,
            {
              borderColor: theme.colors.border,
              backgroundColor: pressed
                ? theme.colors.cardPressed
                : theme.colors.card,
            },
          ]}
        >
          <LogOut
            size={22}
            strokeWidth={2}
            color={'#E5484D'}
            style={styles.icon}
          />
          <Text style={[styles.label, { color: '#E5484D' }]}>
            Log out
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAccount}
          style={({ pressed }) => [
            styles.option,
            {
              borderColor: theme.colors.border,
              backgroundColor: '#FEEDEE',
            },
          ]}
        >
          <Trash2
            size={22}
            strokeWidth={2}
            color={'#E5484D'}
            style={styles.icon}
          />
          <Text
            style={[
              styles.label,
              { color: '#E5484D' },
            ]}
          >
            Delete account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MoreSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth, // subtle outline, no shadow
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: "semi",
    color:'#000'
  },
});
