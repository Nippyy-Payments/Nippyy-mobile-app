import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import RecentTransactions from "../../components/others/RecentTransactions";
import { TouchableOpacity } from "react-native";
import { Landmark, ChevronRight, AtSign } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useKycModal } from "../../../contexts/KycModal";
import { useUser } from "../../../contexts/UserContext";

export default function Transfer() {
  //theme context
  const { theme } = useTheme();

  const navigation = useNavigation();
  const { openKycModal } = useKycModal();

   //user data object from context
    const { profile, loading: profileLoading } = useUser();

  const handleRestrictedAction = (screen) => {
    if (profile?.kyc_level >= 1) {
      navigation.navigate(screen);
    } else {
      openKycModal(
        "Please complete Phone and BVN verification to use this feature."
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity></TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/*Recent Transaction*/}
        <View>
          <View style={styles.recentTransactionWrapper}>
            <View>
              <Text style={styles.recentText}>Recents</Text>
            </View>
            <View>
              <Text style={styles.seeallText}>See all</Text>
            </View>
          </View>

          <View>
            <RecentTransactions />
          </View>
        </View>

        {/*Options*/}
        <View style={styles.sendMoneyOptionsWrapper}>
          <View>
            <View>
              <Text
                style={{ fontFamily: "regular", marginBottom: 10, color: "grey" }}
              >
                Send locally:
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionWrapper}
              onPress={() => handleRestrictedAction("Bank")}
            >
              <View style={styles.innerLeftIconWrapper}>
                <Landmark size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Bank Transfer</Text>
                <Text style={styles.lowerText}>Reflects within minutes</Text>
              </View>
              <View>
                <ChevronRight size={20} color={"grey"} />
              </View>
            </TouchableOpacity>
             <TouchableOpacity
              style={[styles.optionWrapper,{marginTop:15}]}
              onPress={() => handleRestrictedAction("Tag")}
            >
              <View style={styles.innerLeftIconWrapper}>
                <AtSign size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Send to Nippyy Tag</Text>
                <Text style={styles.lowerText}>
                  Any Nippyy user in any country
                </Text>
              </View>
              <View>
                <ChevronRight size={20} color={"grey"} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 40 }}>
            <View>
              <Text
                style={{ fontFamily: "regular", marginBottom: 10, color: "grey" }}
              >
                Send internationally:
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.optionWrapper]}
              onPress={() => handleRestrictedAction("Tag")}
            >
              <View style={styles.innerLeftIconWrapper}>
                <AtSign size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Send to Nippyy Tag</Text>
                <Text style={styles.lowerText}>
                  Any Nippyy user in any country
                </Text>
              </View>
              <View>
                <ChevronRight size={20} color={"grey"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
  recentTransactionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentText: {
    fontFamily: "bold",
    fontSize: 19,
  },
  seeallText: {
    fontFamily: "semi",
    color: "grey",
  },
  sendMoneyOptionsWrapper: {
    marginTop: 25,
  },
  optionWrapper: {
    backgroundColor: "#eee",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
    fontFamily: "bold",
    fontSize: 15,
  },
  lowerText: {
    fontFamily: "regular",
    fontSize: 13,
    color: "grey",
  },
});
