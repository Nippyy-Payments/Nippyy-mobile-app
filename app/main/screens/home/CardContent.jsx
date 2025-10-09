import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Plus,
  ArrowUpRight,
  Wallet,
  RefreshCcw,
} from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../contexts/UserContext";
import { useKycModal } from "../../../contexts/KycModal";

export default function CardContent() {
  const { theme } = useTheme();
  const [showBalance, setShowBalance] = useState(true);

  const { openKycModal } = useKycModal();

  //user data object from context
  const { profile, loading: profileLoading } = useUser();

  //nav object
  const navigation = useNavigation();

  const handleRestrictedAction = (screen) => {
    if (profile?.kyc_level >= 1) {
      navigation.navigate(screen);
    } else {
      openKycModal(
        "Please complete BVN & NIN verification to use this feature."
      );
    }
  };

  //open screens
  const openScreen = (screen) => {
    navigation.navigate(screen);
  };

  //handle when tag is pressed
  const handleTagPress = () => {
    if (profile?.nippyy_tag) {
      console.log("Tag copied to clipboard:", profile.nippyy_tag);
      return;
    } else {
      navigation.navigate("CreateTag");
    }
  };

  return (
    <View>
      {/*Top of card*/}
      <View style={styles.topOfCardStyle}>
        <View style={styles.availabaleBalanceWrapper}>
          <Text style={styles.availabaleBalancText}>Available Balance</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            {showBalance ? (
              <Eye size={13} color={"grey"} strokeWidth={3} />
            ) : (
              <EyeOff size={13} color={"grey"} strokeWidth={3} />
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.flagWrapper}>
            <Image
              style={styles.flagIconStyle}
              source={require("../../../../assets/icons/ng-icon.png")}
            />
            <Text style={styles.countryText}>NGN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*Account balance number*/}
      <View style={styles.accountBalanceWrapper}>
        <Text style={styles.accountBalanceText}>
          ₦
          <Text>
            {""}
            {showBalance ? profile?.balance || 0.0 : "*****"}
          </Text>
        </Text>
      </View>

      {/*Nippyy Tag wrapper*/}
      <TouchableOpacity
        style={styles.nippyytagWrapper}
        onPress={handleTagPress}
      >
        <Copy size={13} color={"grey"} strokeWidth={3} />
        <Text style={styles.nippyTagText}>
          {profile?.nippyy_tag ? profile?.nippyy_tag : "create tag"}
        </Text>
      </TouchableOpacity>

      {/*action buttons*/}
      <View style={styles.actionWrapper}>
        <View style={styles.actionItemStyle}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleRestrictedAction("Addmoney")}
          >
            <Plus color={theme.colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.actionText}>Add money</Text>
        </View>
        <View style={styles.actionItemStyle}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleRestrictedAction("Send")}
          >
            <ArrowUpRight
              color={theme.colors.primary}
              size={20}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Send</Text>
        </View>
        <View style={styles.actionItemStyle}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleRestrictedAction("Wallets")}
          >
            <Wallet color={theme.colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.actionText}>Wallets</Text>
        </View>
        <View style={styles.actionItemStyle}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleRestrictedAction("Convert")}
          >
            <RefreshCcw
              color={theme.colors.primary}
              size={20}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Convert</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topOfCardStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availabaleBalanceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  availabaleBalancText: {
    fontFamily: "bold",
  },
  flagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#eee",
    padding: 4,
    gap: 5,
  },
  flagIconStyle: {
    height: 20,
    width: 20,
  },
  countryText: {
    fontFamily: "semi",
    fontSize: 12,
  },
  accountBalanceWrapper: {
    marginTop: 10,
  },
  accountBalanceText: {
    fontFamily: "bold",
    fontSize: 23,
  },
  nippyytagWrapper: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  nippyTagText: {
    fontFamily: "medium",
    color: "grey",
  },
  actionWrapper: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  actionItemStyle: {
    alignItems: "center",
  },
  actionItem: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#eee",
  },
  actionText: {
    fontFamily: "medium",
    fontSize: 12,
    marginTop: 2,
  },
});
