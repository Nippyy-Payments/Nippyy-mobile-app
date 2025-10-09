import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Bell, ScanQrCode } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeHeader() {
  //navigation hook
  const navigation = useNavigation();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerLeftTextWrapper}>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.imageWrapper} onPress={()=>navigation.navigate("ProfileStack")}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/38.jpg",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.greetingText}>Hi Mtchy,</Text>
          <Text style={styles.greetingDesc}>Welcome back</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.rightRoundedPill}>
          <Bell size={20} color={"#000"} strokeWidth={2.2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightRoundedPill}>
          <ScanQrCode size={20} color={"#000"} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    justifyContent: "space-between",
    marginTop: 50,
  },
  headerLeftTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 20,
    fontFamily: "bold",
  },
  greetingDesc: {
    fontSize: 13,
    fontFamily: "semi",
    color: "grey",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rightRoundedPill: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 100,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
